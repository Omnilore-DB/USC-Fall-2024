import { get, upsert, update, perform } from "../src/supabase/api";
import { convert } from "../src/processing";
import {
  fetchSquarespaceProducts,
  fetchSquarespaceTransactions,
} from "../src/squarespace/api";
import { apiResponse } from "../src/utils";

export async function POST() {
  return apiResponse(async () => {
    const start_time = new Date();

    const { data: products, error: products_error } =
      await fetchSquarespaceProducts();

    if (products_error) {
      throw new Error(products_error.toString());
    }

    const upsertedProducts = await upsert.products(
      products.map(convert.product),
    );

    const { data: ts, error: ts_error } = await fetchSquarespaceTransactions(
      await get.last_sync(),
      start_time,
    );

    if (ts_error) {
      throw new Error(ts_error.toString());
    }

    const convertedTs = await convert.transactions(ts);
    const upsertedTs = await upsert.transactions(convertedTs);

    const new_members = await update.users_given_transactions(upsertedTs);

    await update.last_sync(start_time);
    await perform.calculate_member_conflicts();

    return Response.json({
      message: `Found ${ts.length} transactions, processed ${
        convertedTs.length
      }, upserted ${upsertedTs.length}, issues with ${
        convertedTs.filter((r) => r.issues.length > 0).length
      }. Created ${new_members.length} new members. Found ${
        products.length
      } products, upserted ${upsertedProducts.length}.`,
      warnings: upsertedTs
        .filter((r) => r.issues.length > 0)
        .map((r) => ({
          id: r.id,
          issues: r.issues,
          date: r.date,
        })),
      new_members: new_members.map((m) => ({
        id: m.id,
        first_name: m.first_name,
        last_name: m.last_name,
        email: m.email,
        phone: m.phone,
      })),
    });
  });
}
