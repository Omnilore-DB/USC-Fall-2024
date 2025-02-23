import { getLastUpdateTime, updateLastSyncTime, upsertOrders } from "../src/db";
import { prepareOrdersForUpsert, processTransactions } from "../src/processing";
import { fetchTransactions } from "../src/squarespace";

export async function POST() {
  try {
    const lastUpdated = await getLastUpdateTime();
    const now = new Date().toISOString();

    const transactions = await fetchTransactions(lastUpdated, now);
    const processedOrders = await processTransactions(transactions);
    const ordersToUpsert = prepareOrdersForUpsert(processedOrders);

    const upsertedOrders = await upsertOrders(ordersToUpsert);
    await updateLastSyncTime(now);

    return Response.json({
      message: `Found ${transactions.length} transactions, processed ${
        processedOrders.length
      }, upserted ${upsertedOrders.length}, issues with ${
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
