import type { SupabaseOrder, SupabaseProduct } from "./types";
import { createClient } from "@supabase/supabase-js";

// THIS IS SUPER SECRET SERVICE KEY! DO NOT USE UNLESS YOU WANT USER TO HAVE READ/WRITE ACCESS TO ALL DATA
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function getLastUpdateTime() {
  const { data, error } = await supabase
    .from("last_updated")
    .select()
    .eq("table_name", "orders");

  if (error)
    throw new Error(
      `Failed to get last updated time for orders. ${error.hint}`
    );
  return new Date(data[0].last_sync).toISOString();
}

export async function updateLastSyncTime(currentTime: string) {
  const { error: updateError } = await supabase
    .from("last_updated")
    .update({ last_sync: currentTime })
    .eq("table_name", "orders");

  if (updateError)
    throw new Error(
      `Failed to update last sync time. ${updateError.hint}. ${updateError.message}`
    );
}

export async function upsertOrders(
  ordersToUpsert: Omit<SupabaseOrder, "created_at" | "updated_at">[]
) {
  const { error: ordersError, data: ordersData } = await supabase
    .from("orders")
    .upsert(ordersToUpsert, { onConflict: "sqsp_transaction_id" })
    .select();

  if (ordersError)
    throw new Error(
      `Failed to upsert orders. ${ordersError.hint}. ${ordersError.message}`
    );

  return ordersData;
}

export async function upsertProducts(
  productsToUpsert: Omit<SupabaseProduct, "created_at" | "updated_at">[]
) {
  const { error: productsError, data: productsData } = await supabase
    .from("products")
    .upsert(productsToUpsert, { onConflict: "sku" })
    .select();

  if (productsError)
    throw new Error(
      `Failed to upsert products. ${productsError.hint}. ${productsError.message}`
    );

  return productsData;
}
