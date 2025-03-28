import type {
  SquarespaceInventoryAPIResponse,
  SquarespaceOrderAPIResponse,
  SquarespaceProfileAPIResponse,
  SquarespaceTransactionsAPIResponse,
} from "./types";
import { make_data, make_error } from "../utils";

const URL = "https://api.squarespace.com/1.0";

export const fetchSquarespaceTransactions = async (
  last_updated: Date,
  now: Date,
) => {
  const documents: SquarespaceTransactionsAPIResponse["documents"] = [];

  let nextPageUrl = `${URL}/commerce/transactions?modifiedAfter=${last_updated.toISOString()}&modifiedBefore=${now.toISOString()}`;
  while (nextPageUrl) {
    const res = await fetch(nextPageUrl, {
      headers: { Authorization: `Bearer ${process.env.SQUARESPACE_API_KEY}` },
    });

    if (!res.ok) {
      return make_error({
        message:
          "Failed to fetch transactions from Squarespace Transactions API",
        code: "FETCH_ERROR",
        more: {
          url: nextPageUrl,
          status: res.status,
          body: await res.text(),
        },
      });
    }

    const json = (await res.json()) as SquarespaceTransactionsAPIResponse;

    documents.push(...json.documents);
    nextPageUrl = json.pagination?.nextPageUrl || "";
  }

  return make_data(documents);
};

export const fetchSquarespaceProducts = async () => {
  const inventory: SquarespaceInventoryAPIResponse["inventory"] = [];

  let nextPageUrl = `${URL}/commerce/inventory`;
  while (nextPageUrl) {
    const res = await fetch(nextPageUrl, {
      headers: { Authorization: `Bearer ${process.env.SQUARESPACE_API_KEY}` },
    });

    if (!res.ok) {
      return make_error({
        message: "Failed to fetch products from Squarespace Inventory API",
        code: "FETCH_ERROR",
        more: {
          url: nextPageUrl,
          status: res.status,
          body: await res.text(),
        },
      });
    }

    const json = (await res.json()) as SquarespaceInventoryAPIResponse;

    inventory.push(...json.inventory);
    nextPageUrl = json.pagination?.nextPageUrl || "";
  }

  return make_data(inventory);
};

export const fetchSquarespaceProfile = async (email: string) => {
  const res = await fetch(
    `${URL}/profiles?filter=email,${encodeURIComponent(email)}`,
    {
      headers: { Authorization: `Bearer ${process.env.SQUARESPACE_API_KEY}` },
    },
  );

  if (!res.ok) {
    return make_error({
      message: "Failed to fetch user info from Squarespace Profiles API",
      code: "FETCH_ERROR",
      more: {
        email,
        status: res.status,
        body: await res.text(),
      },
    });
  }

  const json = (await res.json()) as SquarespaceProfileAPIResponse;

  if (json.profiles.length < 1) {
    return make_error({
      message: "No user info found from Squarespace Profiles API",
      code: "PROFILE_NOT_FOUND",
      more: {
        email,
      },
    });
  }

  return make_data(json.profiles[0]);
};

export const fetchSquarespaceOrder = async (order_id: string) => {
  const res = await fetch(`${URL}/commerce/orders/${order_id}`, {
    headers: { Authorization: `Bearer ${process.env.SQUARESPACE_API_KEY}` },
  });

  if (res.status === 404) {
    return make_error({
      message: "Order not found in Squarespace Orders API",
      code: "ORDER_NOT_FOUND",
      more: {
        order_id,
      },
    });
  }

  if (!res.ok) {
    return make_error({
      message: "Failed to fetch order from Squarespace Orders API",
      code: "FETCH_ERROR",
      more: {
        order_id,
        status: res.status,
        body: await res.text(),
      },
    });
  }

  const json = (await res.json()) as SquarespaceOrderAPIResponse;
  return make_data(json);
};
