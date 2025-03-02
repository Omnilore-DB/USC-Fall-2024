import { processDonation, processOrder } from "./squarespace";
import { batchWithDelay } from "./utils";
import type {
  Transaction,
  SupabaseTransaction,
  SupabasePaymentPlatform,
} from "./types";

export async function processDetails(
  transactions: Transaction[]
): Promise<Transaction[]> {
  // Process transactions in batches of 5 with a delay of 1 second between batches
  // Squarespace API has a rate limit of 300 requests per minute
  return batchWithDelay(
    transactions,
    t => (t.order_id ? processOrder(t) : processDonation(t)),
    { batchSize: 5, delayMs: 1000 }
  );
}

/**
 * Prepares transaction data from Squarespace to be saved in our database.
 *
 * This function takes transactions from Squarespace and formats them to match our database structure.
 * Here's what it does in simple terms:
 *
 * 1. Takes a list of transactions from Squarespace
 * 2. For each transaction:
 *    - Gets basic info like transaction ID, order ID, total amount, date etc.
 *    - If there's customer data (like name and email), uses that
 *    - If no customer data, falls back to transaction email
 *    - Keeps track of any issues that happened during processing
 *    - Removes unnecessary info from error messages
 * 3. Returns the data in a format ready to be saved to our database
 *
 * @param ts - List of transactions from Squarespace
 * @returns List of transactions formatted for our database
 */
export function prepareTransactionsForUpsert(ts: Transaction[]) {
  return ts.map(t => {
    const hasData = t.data.length > 0;
    return {
      sqsp_transaction_id: t.transaction_id,
      sqsp_order_id: t.order_id,
      transaction_email: t.transaction_email,
      amount: t.total,
      date: t.date,
      skus: t.skus,
      payment_platform: t.payment_platform as SupabasePaymentPlatform,
      fee: t.fee,
      external_transaction_id: t.external_transaction_id,
      parsed_form_data: t.data,
      user_names: hasData
        ? t.data.map(d => d.name).filter(n => n !== undefined)
        : [],
      user_amounts: hasData ? t.data.map(d => d.amount) : [],
      member_pid: [],
      issues: t.issues.map(i => ({
        message: i.message,
        code: i.code,
        info: Object.fromEntries(
          Object.entries(i.info).filter(
            ([key]) => key !== "order_id" && key !== "transaction_id"
          )
        ),
      })),
    } satisfies Omit<SupabaseTransaction, "created_at" | "updated_at">;
  });
}
