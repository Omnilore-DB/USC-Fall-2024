import { fetchProducts } from "../src/squarespace";
import { upsertProducts } from "../src/db";
import { apiResponse } from "../src/utils";

export async function POST() {
  return apiResponse(async () => {
    const products = await fetchProducts();
    const upsertedProducts = await upsertProducts(products);

    return Response.json({
      message: `Found ${products.length} products, upserted ${upsertedProducts.length}.`,
    });
  });
}
