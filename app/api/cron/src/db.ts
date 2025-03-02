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
  const { error, data } = await supabase
    .from("transactions")
    .upsert(transactionsToUpsert, { onConflict: "sqsp_transaction_id" })
    .select();

  if (error)
    throw new Error(
      `Failed to upsert transactions. ${error.hint}. ${error.message}`
    );

  return data;
}

export async function upsertProducts(
  productsToUpsert: Omit<SupabaseProduct, "created_at" | "updated_at">[]
) {
  const { error, data } = await supabase
    .from("products")
    .upsert(productsToUpsert, { onConflict: "sku" })
    .select();

  if (error)
    throw new Error(
      `Failed to upsert products. ${error.hint}. ${error.message}`
    );

  return data;
}

export async function getMembers() {
  const { data, error } = await supabase.from("members").select();

  if (error)
    throw new Error(
      `Failed to get supabase members. ${error.hint}. ${error.message}`
    );

  return data as SupabaseMember[];
}

export async function getTransactionsAfterDate(date: Date | string) {
  // Convert Date object to ISO string if needed
  const dateString = date instanceof Date ? date.toISOString() : date;

  const { data, error } = await supabase
    .from("transactions")
    .select("sqsp_transaction_id, issues, parsed_form_data")
    .gte("updated_at", dateString);

  if (error)
    throw new Error(
      `Failed to get supabase transactions after ${dateString}. ${error.hint}. ${error.message}`
    );

  return data;
}
