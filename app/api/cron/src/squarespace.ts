import type {
  Product,
  SquarespaceInventoryAPIResponse,
  SquarespaceOrderAPIResponse,
  SquarespaceProfileAPIResponse,
  SquarespaceTransactionsAPIResponse,
  Transaction,
} from "./types";

export async function fetchTransactions(
  lastUpdated: string,
  now: string
): Promise<Transaction[]> {
  const allTransactions: Transaction[] = [];
  let nextPageUrl = `https://api.squarespace.com/1.0/commerce/transactions?modifiedAfter=${lastUpdated}&modifiedBefore=${now}`;

  while (nextPageUrl) {
    const res = await fetch(nextPageUrl, {
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
      .map(
        t =>
          ({
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
          } satisfies Transaction)
      );

    allTransactions.push(...pageTransactions);
    nextPageUrl = json.pagination?.nextPageUrl || "";
  }

  return allTransactions;
}

export async function processDonation(t: Transaction): Promise<Transaction> {
  t.skus.push("SQDONATION");

  const res = await fetch(
    `https://api.squarespace.com/1.0/profiles?filter=email,${encodeURIComponent(
      t.transaction_email
    )}`,
    {
      headers: { Authorization: `Bearer ${process.env.SQUARESPACE_API_KEY}` },
    }
  );

  if (!res.ok) {
    t.issues.push({
      message: "Failed to fetch user info from Squarespace Profiles API",
      code: "FETCH_ERROR",
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
      message: "No user info found from Squarespace Profiles API",
      code: "PROFILE_NOT_FOUND",
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

export async function processOrder(t: Transaction): Promise<Transaction> {
  const res = await fetch(
    `https://api.squarespace.com/1.0/commerce/orders/${t.order_id}`,
    {
      headers: { Authorization: `Bearer ${process.env.SQUARESPACE_API_KEY}` },
    }
  );

  if (res.status === 404) {
    t.issues.push({
      message: "Order not found in Squarespace Orders API",
      code: "ORDER_NOT_FOUND",
      info: {
        order_id: t.order_id,
        transaction_id: t.transaction_id,
      },
    });
    return t;
  }

  if (!res.ok) {
    t.issues.push({
      message: "Failed to fetch order from Squarespace Orders API",
      code: "FETCH_ERROR",
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
        code: "SKU_UNASSIGNED",
        info: {
          line_item_idx: idx,
          order_id: t.order_id,
          transaction_id: t.transaction_id,
        },
      });
    }

    t.skus.push(p.sku ?? "SKU_UNASSIGNED");

    const isValid =
      cust.has("Email") &&
      (cust.has("Name") || (cust.has("First Name") && cust.has("Last Name")));

    if (!isValid) {
      t.issues.push({
        message: "Important fields missing",
        code: "MISSING_FIELDS",
        info: {
          line_item_idx: idx,
          order_id: t.order_id,
          transaction_id: t.transaction_id,
        },
      });
    }

    t.data.push({
      sku: p.sku ?? "SKU_UNASSIGNED",
      email: cust.get("Email")!,
      name:
        cust.get("Name") ??
        (cust.has("First Name") && cust.has("Last Name")
          ? `${cust.get("First Name")} ${cust.get("Last Name")}`
          : ""),
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

export async function fetchProducts(): Promise<Product[]> {
  const allProducts: Product[] = [];
  let nextPageUrl = `https://api.squarespace.com/1.0/commerce/inventory`;

  while (nextPageUrl) {
    const res = await fetch(nextPageUrl, {
      headers: { Authorization: `Bearer ${process.env.SQUARESPACE_API_KEY}` },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch products with url ${nextPageUrl}. ${await res.text()}`
      );
    }

    const json = (await res.json()) as SquarespaceInventoryAPIResponse;

    const pageProducts = json.inventory.map(p => ({
      id: p.variantId,
      sku: p.sku,
      descriptor: p.descriptor,
    }));

    allProducts.push(...pageProducts);
    nextPageUrl = json.pagination?.nextPageUrl || "";
  }

  return allProducts;
}
