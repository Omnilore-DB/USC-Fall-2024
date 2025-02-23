import { createClient } from "@supabase/supabase-js";
import type {
  SquarespaceOrderAPIResponse,
  SquarespaceProfileAPIResponse,
  SquarespaceTransactionsAPIResponse,
  Transaction,
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

  if (error)
    throw new Error(
      `Failed to get last updated time for orders. ${error.hint}`
    );
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
        `Failed to fetch transactions with url ${nextPageUrl}. ${await res.text()}`
      );
    }

    const json = (await res.json()) as SquarespaceTransactionsAPIResponse;

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
        skus: [],
        data: [],
        issues: [],
      }));

    allTransactions.push(...pageTransactions);
    nextPageUrl = json.pagination?.nextPageUrl || "";
  }

  return allTransactions;
}

async function processDonation(t: Transaction): Promise<Transaction> {
  t.skus.push("SQDONATION");

  const res = await fetchWithRetry(
    `https://api.squarespace.com/1.0/profiles?filter=email,${encodeURIComponent(
      t.transaction_email
    )}`,
    {
      headers: { Authorization: `Bearer ${process.env.SQUARESPACE_API_KEY}` },
    }
  );

  if (!res.ok) {
    t.issues.push({
      message: "Failed to fetch profile",
      info: {
        email: t.transaction_email,
        status: res.status,
        body: await res.text(),
      },
    });
    return t;
  }

  const json = (await res.json()) as SquarespaceProfileAPIResponse;

  if (json.profiles.length < 1) {
    t.issues.push({
      message: "No profile found",
      info: {
        email: t.transaction_email,
        status: res.status,
      },
    });
    return t;
  }

  t.data.push({
    sku: "SQDONATION",
    name: json.profiles[0].firstName + " " + json.profiles[0].lastName,
    email: t.transaction_email,
    amount: t.total,
  });

  return t;
}

async function processOrder(t: Transaction): Promise<Transaction> {
  const res = await fetchWithRetry(
    `https://api.squarespace.com/1.0/commerce/orders/${t.order_id}`,
    {
      headers: { Authorization: `Bearer ${process.env.SQUARESPACE_API_KEY}` },
    }
  );

  if (res.status === 404) {
    t.issues.push({
      message: "Order not found",
      info: {
        order_id: t.order_id,
        transaction_id: t.transaction_id,
      },
    });
    return t;
  }

  if (!res.ok) {
    t.issues.push({
      message: "Failed to fetch order",
      info: {
        order_id: t.order_id,
        transaction_id: t.transaction_id,
        status: res.status,
        body: await res.text(),
      },
    });
    return t;
  }

  const json = (await res.json()) as SquarespaceOrderAPIResponse;

  json.lineItems.forEach((p, idx) => {
    const cust = new Map(
      (p.customizations ?? []).map(obj => [obj.label, obj.value] as const)
    );

    if (p.sku === null) {
      t.issues.push({
        message: "No SKU assigned",
        info: {
          line_item_idx: idx,
          order_id: t.order_id,
          transaction_id: t.transaction_id,
        },
      });
    }

    t.skus.push(p.sku ?? "NO_SKU_ASSIGNED");

    const isValid =
      cust.has("Email") &&
      (cust.has("Name") || (cust.has("First Name") && cust.has("Last Name")));

    if (!isValid) {
      t.issues.push({
        message: "Important fields missing",
        info: {
          line_item_idx: idx,
          order_id: t.order_id,
          transaction_id: t.transaction_id,
        },
      });
    }

    t.data.push({
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

  return t;
}

async function processTransactions(
  transactions: Transaction[]
): Promise<Transaction[]> {
  const BATCH_SIZE = 5; // Process 5 transactions at a time
  const results: Transaction[] = [];

  for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
    const batch = transactions.slice(i, i + BATCH_SIZE);
    const done = wait(1000);
    const processedBatch = await Promise.all(
      batch.map(t => (t.order_id ? processOrder(t) : processDonation(t)))
    );
    results.push(...processedBatch);

    // Add a small delay between batches
    if (i + BATCH_SIZE < transactions.length) {
      await done;
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
      issues: t.issues.map(i => i.message),
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

  if (ordersError)
    throw new Error(
      `Failed to upsert orders. ${ordersError.hint}. ${ordersError.message}`
    );
}

async function updateLastSyncTime(currentTime: string) {
  const { error: updateError } = await supabase
    .from("last_updated")
    .update({ last_sync: currentTime })
    .eq("table_name", "orders");

  if (updateError)
    throw new Error(
      `Failed to update last sync time. ${updateError.hint}. ${updateError.message}`
    );
}

export async function POST() {
  try {
    const lastUpdated = await getLastUpdateTime();
    const now = new Date().toISOString();

    const transactions = await fetchTransactions(lastUpdated, now);
    const processedOrders = await processTransactions(transactions);
    const ordersToUpsert = prepareOrdersForUpsert(processedOrders);

    await upsertOrders(ordersToUpsert);
    await updateLastSyncTime(now);

    return Response.json({
      message: `Found ${transactions.length} transactions, processed ${
        processedOrders.length
      }, upserted ${ordersToUpsert.length}, issues with ${
        processedOrders.filter(r => r.issues.length > 0).length
      }.`,
      warnings: processedOrders
        .filter(r => r.issues.length > 0)
        .map(r => ({
          transaction_id: r.transaction_id,
          order_id: r.order_id,
          issues: r.issues,
          date: r.date,
        })),
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
