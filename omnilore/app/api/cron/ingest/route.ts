import { createClient } from "@supabase/supabase-js";
import type {
  SquarespaceOrderAPIResponse,
  SquarespaceProfileAPIResponse,
  SquarespaceTransactionsAPIResponse,
  Transaction,
  TransactionData,
  SupabaseOrder,
} from "./types";

// THIS IS SUPER SECRET SERVICE KEY! DO NOT USE OUTSIDE THIS FILE
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 5
): Promise<Response> {
  let retryCount = 0;
  let lastError: Error | null = null;

  while (retryCount < maxRetries) {
    try {
      const res = await fetch(url, options);

      // If we hit rate limit, wait and retry
      if (res.status === 429) {
        const retryAfter = res.headers.get("Retry-After");
        const waitTime = retryAfter
          ? parseInt(retryAfter) * 1000
          : Math.pow(2, retryCount) * 1000;
        console.log(
          `Rate limited, waiting ${waitTime}ms before retry ${
            retryCount + 1
          }/${maxRetries}`
        );
        await wait(waitTime);
        retryCount++;
        continue;
      }

      return res;
    } catch (error) {
      lastError = error as Error;
      const waitTime = Math.pow(2, retryCount) * 1000;
      console.log(
        `Request failed, waiting ${waitTime}ms before retry ${
          retryCount + 1
        }/${maxRetries}`
      );
      await wait(waitTime);
      retryCount++;
    }
  }

  throw lastError || new Error("Max retries reached");
}

async function getLastUpdateTime() {
  const { data, error } = await supabase
    .from("last_updated")
    .select()
    .eq("table_name", "orders");

  if (error) throw new Error(error.hint);
  return new Date(data[0].last_sync).toISOString();
}

async function fetchTransactions(
  lastUpdated: string,
  now: string
): Promise<Transaction[]> {
  const allTransactions: Transaction[] = [];
  let nextPageUrl = `https://api.squarespace.com/1.0/commerce/transactions?modifiedAfter=${lastUpdated}&modifiedBefore=${now}`;

  while (nextPageUrl) {
    const res = await fetchWithRetry(nextPageUrl, {
      headers: { Authorization: `Bearer ${process.env.SQUARESPACE_API_KEY}` },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch transactions with body: ${await res.text()}`
      );
    }

    const json = (await res.json()) as SquarespaceTransactionsAPIResponse;
    console.log(`Fetched page with ${json.documents.length} transactions`);

    const pageTransactions = json.documents
      .filter(t => t.payments.length > 0)
      .map(t => ({
        transaction_id: t.id,
        order_id: t.salesOrderId,
        date: t.createdOn,
        total: Number(t.total.value),
        fee: Number(t.total.value) - Number(t.totalNetPayment.value),
        payment_platform: t.payments[0].provider,
        external_transaction_id: t.payments[0].externalTransactionId,
        transaction_email: t.customerEmail,
        skus: [] as string[],
        data: [] as TransactionData[],
      }));

    allTransactions.push(...pageTransactions);
    nextPageUrl = json.pagination?.nextPageUrl || "";
  }

  console.log(`Total transactions fetched: ${allTransactions.length}`);
  return allTransactions;
}

async function processDonation(transaction: Transaction): Promise<Transaction> {
  transaction.skus.push("SQDONATION");

  const res = await fetchWithRetry(
    `https://api.squarespace.com/1.0/profiles?${new URLSearchParams({
      filter: "email," + transaction.transaction_email,
    })}`,
    {
      headers: { Authorization: `Bearer ${process.env.SQUARESPACE_API_KEY}` },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch profiles with body: ${await res.text()}`);
  }

  const json = (await res.json()) as SquarespaceProfileAPIResponse;

  if (json.profiles.length > 0) {
    transaction.data.push({
      sku: "SQDONATION",
      name: json.profiles[0].firstName + " " + json.profiles[0].lastName,
      email: transaction.transaction_email,
      amount: transaction.total,
    });
  }

  return transaction;
}

async function processOrder(transaction: Transaction): Promise<Transaction> {
  const res = await fetchWithRetry(
    `https://api.squarespace.com/1.0/commerce/orders/${transaction.order_id}`,
    {
      headers: { Authorization: `Bearer ${process.env.SQUARESPACE_API_KEY}` },
    }
  );

  if (res.status === 404) {
    transaction.skus.push("ORDER_NOT_FOUND");
    return transaction;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch order with body: ${await res.text()}`);
  }

  const json = (await res.json()) as SquarespaceOrderAPIResponse;

  json.lineItems.forEach(p => {
    const cust = new Map(
      (p.customizations ?? []).map(obj => [obj.label, obj.value] as const)
    );

    transaction.skus.push(p.sku ?? "NO_SKU_ASSIGNED");

    const isValid =
      cust.has("Email") &&
      (cust.has("Name") || (cust.has("First Name") && cust.has("Last Name")));

    if (!isValid) return;

    transaction.data.push({
      sku: p.sku ?? "NO_SKU_ASSIGNED",
      email: cust.get("Email")!,
      name:
        cust.get("Name") ??
        `${cust.get("First Name")} ${cust.get("Last Name")}`,
      amount: Number(p.unitPricePaid.value),
      phone: cust.get("Phone"),
      address: cust.get("Address"),
      city: cust.get("City"),
      state: cust.get("State"),
      zip_code: cust.get("Zip Code"),
      emergency_contact_name: cust.get("Emergency Contact Name"),
      emergency_contact_phone: cust.get("Emergency Contact Phone"),
    });
  });

  return transaction;
}

async function processTransactions(
  transactions: Transaction[]
): Promise<Transaction[]> {
  const BATCH_SIZE = 5; // Process 5 transactions at a time
  const results: Transaction[] = [];

  for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
    const batch = transactions.slice(i, i + BATCH_SIZE);
    const processedBatch = await Promise.all(
      batch.map(t => (t.order_id ? processOrder(t) : processDonation(t)))
    );
    results.push(...processedBatch);

    // Add a small delay between batches
    if (i + BATCH_SIZE < transactions.length) {
      await wait(1000); // Wait 1 second between batches
    }
  }

  return results;
}

function prepareOrdersForUpsert(orders: Transaction[]) {
  return orders.map(t => {
    const hasData = t.data.length > 0;
    return {
      sqsp_transaction_id: t.transaction_id,
      sqsp_order_id: t.order_id,
      user_emails: hasData ? t.data.map(d => d.email) : [t.transaction_email],
      amount: t.total,
      date: t.date,
      skus: t.skus,
      payment_platform: t.payment_platform,
      fee: t.fee,
      external_transaction_id: t.external_transaction_id,
      user_names: hasData ? t.data.map(d => d.name) : [],
      user_amounts: hasData ? t.data.map(d => d.amount) : [],
      member_pid: [],
    } as Omit<SupabaseOrder, "created_at" | "updated_at">;
  });
}

async function upsertOrders(
  ordersToUpsert: Omit<SupabaseOrder, "created_at" | "updated_at">[]
) {
  const { error: ordersError } = await supabase
    .from("orders")
    .upsert(ordersToUpsert, { onConflict: "sqsp_transaction_id" })
    .select();

  if (ordersError) throw new Error(ordersError.message);
}

async function updateLastSyncTime(currentTime: string) {
  const { error: updateError } = await supabase
    .from("last_updated")
    .update({ last_sync: currentTime })
    .eq("table_name", "orders");

  if (updateError) throw new Error(updateError.message);
}

export async function POST() {
  try {
    const lastUpdated = await getLastUpdateTime();
    const now = new Date().toISOString();

    const transactions = await fetchTransactions(lastUpdated, now);
    console.log("Fetched transactions:", transactions.length);
    const processedOrders = await processTransactions(transactions);
    console.log("Processed transactions:", processedOrders.length);
    const ordersToUpsert = prepareOrdersForUpsert(processedOrders);
    console.log("Prepared orders for upsert:", ordersToUpsert.length);

    await upsertOrders(ordersToUpsert);
    console.log("Upserted orders:", ordersToUpsert.length);
    await updateLastSyncTime(now);
    console.log("Last updated updated successfully.");

    return Response.json({
      message: "Orders upserted and last_updated updated successfully.",
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
