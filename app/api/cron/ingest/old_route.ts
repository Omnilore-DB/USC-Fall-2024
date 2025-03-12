import { get, upsert, update, perform } from "../src/supabase/api";
import {
  prepareTransactionsForUpsert,
  processDetails,
} from "../src/processing";
import {
  fetchProducts,
  fetchTransactions,
} from "../src/squarespace/legacy_api";
import { apiResponse } from "../src/utils";

export async function POST() {
  return apiResponse(async () => {
    const products = await fetchProducts();
    const upsertedProducts = await upsert.products(products);

    const start_time = new Date().toISOString();
    const lastUpdated = await get.last_sync();

    const ts = await fetchTransactions(lastUpdated, start_time);
    const processedTs = await processDetails(ts);
    const tsToUpsert = prepareTransactionsForUpsert(processedTs);

    const upsertedTs = await upsert.transactions(tsToUpsert);
    const new_members = await update.members_given_transactions(upsertedTs);

    await update.last_sync("transactions", start_time);
    await perform.calculate_member_conflicts();

    return Response.json({
      message: `Found ${ts.length} transactions, processed ${
        processedTs.length
      }, upserted ${upsertedTs.length}, issues with ${
        processedTs.filter(r => r.issues.length > 0).length
      }. Created ${new_members.length} new members. Found ${
        products.length
      } products, upserted ${upsertedProducts.length}.`,
      warnings: processedTs
        .filter(r => r.issues.length > 0)
        .map(r => ({
          transaction_id: r.transaction_id,
          order_id: r.order_id,
          issues: r.issues,
          date: r.date,
        })),
      new_members: new_members.map(m => ({
        id: m.id,
        first_name: m.first_name,
        last_name: m.last_name,
        email: m.email,
        phone: m.phone,
      })),
    });
  });
}
