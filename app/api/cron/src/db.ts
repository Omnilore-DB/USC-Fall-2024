import type {
  SupabaseTransaction,
  SupabaseProduct,
  SupabaseMember,
} from "./types";
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

export async function getLastSyncTime(tableName: "transactions" | "members") {
  const { data, error } = await supabase
    .from("last_updated")
    .select()
    .eq("table_name", tableName);

  if (error)
    throw new Error(
      `Failed to get last updated time for ${tableName}. ${error.hint}`
    );
  return new Date(data[0].last_sync).toISOString();
}

export async function updateLastSyncTime(
  tableName: "transactions" | "members",
  currentTime: string
) {
  const { error: updateError } = await supabase
    .from("last_updated")
    .update({ last_sync: currentTime })
    .eq("table_name", tableName);

  if (updateError)
    throw new Error(
      `Failed to update last sync time for ${tableName}. ${updateError.hint}. ${updateError.message}`
    );
}

export async function upsertTransactions(
  transactionsToUpsert: Omit<SupabaseTransaction, "created_at" | "updated_at">[]
) {
  const { error: transactionsError, data: transactionsData } = await supabase
    .from("transactions")
    .upsert(transactionsToUpsert, { onConflict: "sqsp_transaction_id" })
    .select();

  if (transactionsError)
    throw new Error(
      `Failed to upsert transactions. ${transactionsError.hint}. ${transactionsError.message}`
    );

  return transactionsData;
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

export async function getMembers() {
  const { data, error } = await supabase.from("members").select();

  if (error)
    throw new Error(`Failed to get members. ${error.hint}. ${error.message}`);

  return data as SupabaseMember[];
}
