import { processDonation, processOrder } from "./squarespace";
import type { Transaction, SupabaseOrder } from "./types";
import { wait } from "./utils";

export async function processTransactions(
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

export function prepareOrdersForUpsert(orders: Transaction[]) {
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
