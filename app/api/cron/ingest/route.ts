import {
  getLastSyncTime,
  updateLastSyncTime,
  upsertTransactions,
} from "../src/db";
import {
  prepareTransactionsForUpsert,
  processDetails,
} from "../src/processing";
import { fetchTransactions } from "../src/squarespace";
import { apiResponse } from "../src/utils";

export async function POST() {
  return apiResponse(async () => {
    const lastUpdated = await getLastSyncTime("transactions");
    const now = new Date().toISOString();

    const ts = await fetchTransactions(lastUpdated, now);
    const processedTs = await processDetails(ts);
    const tsToUpsert = prepareTransactionsForUpsert(processedTs);

    const upsertedTs = await upsertTransactions(tsToUpsert);
    await updateLastSyncTime("transactions", now);

    return Response.json({
      message: `Found ${ts.length} transactions, processed ${
        processedTs.length
      }, upserted ${upsertedTs.length}, issues with ${
        processedTs.filter(r => r.issues.length > 0).length
      }.`,
      warnings: processedTs
        .filter(r => r.issues.length > 0)
        .map(r => ({
          transaction_id: r.transaction_id,
          order_id: r.order_id,
          issues: r.issues,
          date: r.date,
        })),
    });
  });
}
