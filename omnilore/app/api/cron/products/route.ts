import { upsertProducts } from "../src/db";
import { fetchProducts } from "../src/squarespace";

export async function POST() {
  try {
    const products = await fetchProducts();
    const upsertedProducts = await upsertProducts(products);

    return Response.json({
      message: `Found ${products.length} products, upserted ${upsertedProducts.length}.`,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
