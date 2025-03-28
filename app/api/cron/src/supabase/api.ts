import { convert } from "../processing";
import type {
  Database,
  SupabaseMember,
  SupabaseMemberInsert,
  SupabaseMemberTransaction,
  SupabaseMemberTransactionInsert,
  SupabaseProduct,
  SupabaseProductInsert,
  SupabaseTransaction,
  SupabaseTransactionInsert,
} from "./types";
import { createClient } from "@supabase/supabase-js";

// THIS IS SUPER SECRET SERVICE KEY!
// DO NOT USE UNLESS YOU WANT USER TO HAVE READ/WRITE ACCESS TO ALL DATA
// NEVER USE ON CLIENT SIDE, ONLY SERVER SIDE
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const get = {
  last_sync: async () => {
    const { data, error } = await supabase
      .from("last_updated")
      .select()
      .eq("table_name", "transactions");

    if (error)
      throw new Error(
        `Failed to get last updated time for transactions. ${error.hint}`
      );

    return new Date(data[0].last_sync);
  },

  all_members_matching: async (
    member: SupabaseMemberInsert
  ): Promise<SupabaseMember[]> => {
    const { data, error } = await supabase.rpc("get_normalized_member", {
      _first_name: member.first_name,
      _last_name: member.last_name,
      _email: member.email ?? "",
      _phone: member.phone ?? "",
    });

    if (error)
      throw new Error(
        `Failed to get supabase members. ${error.hint}. ${error.message}`
      );

    return data;
  },

  products: async (): Promise<SupabaseProduct[]> => {
    const { data, error } = await supabase.from("products").select();

    if (error)
      throw new Error(
        `Failed to get supabase products. ${error.hint}. ${error.message}`
      );

    return data;
  },
};

export const upsert = {
  transactions: async (
    transactionsToUpsert: SupabaseTransactionInsert[]
  ): Promise<SupabaseTransaction[]> => {
    const { error, data } = await supabase
      .from("transactions")
      .upsert(transactionsToUpsert, { onConflict: "sqsp_transaction_id" })
      .select();

    if (error)
      throw new Error(
        `Failed to upsert transactions. ${error.hint}. ${error.message}`
      );

    return data;
  },

  products: async (
    productsToUpsert: SupabaseProductInsert[]
  ): Promise<SupabaseProduct[]> => {
    const { error, data } = await supabase.rpc("upsert_products", {
      _products: productsToUpsert,
    });

    if (error)
      throw new Error(
        `Failed to upsert products. ${error.hint}. ${error.message}`
      );

    return data;
  },

  member_transaction: async (
    mt: SupabaseMemberTransactionInsert
  ): Promise<SupabaseMemberTransaction[]> => {
    const { data, error } = await supabase
      .from("members_to_transactions")
      .upsert(mt, {
        onConflict: "member_id,transaction_id,line_item_index",
      })
      .select();

    if (error) {
      throw new Error(
        `Failed to insert member-to-transaction mapping with data ${JSON.stringify(
          mt
        )}: ${error.hint} ${error.message}`
      );
    }

    return data;
  },
};

export const update = {
  last_sync: async (time: Date) => {
    const { error } = await supabase
      .from("last_updated")
      .update({ last_sync: time.toISOString() })
      .eq("table_name", "transactions");

    if (error)
      throw new Error(
        `Failed to update last sync time for transactions. ${error.hint}. ${error.message}`
      );
  },

  members_given_transactions: async (ts: SupabaseTransaction[]) => {
    const new_members: SupabaseMember[] = [];

    const products = await get.products();
    const sku_map = new Map(products.map(p => [p.sku, p]));

    for (const t of ts) {
      for (const [i, d] of t.parsed_form_data.entries()) {
        if (sku_map.get(d.sku)?.type !== "MEMBERSHIP") {
          continue;
        }

        const { data: mem, error } = convert.member(d);
        if (error) {
          continue;
        }

        const matches = (await get.all_members_matching(mem))
          .sort((a, b) => a.id - b.id)
          .filter(match => perform.is_member_subset(match, mem));
        if (matches.length > 0) {
          await upsert.member_transaction({
            member_id: matches[0].id,
            transaction_id: t.id,
            line_item_index: i,
            amount: d.amount,
            sku: d.sku,
          });
        } else {
          const created_mem = await insert.member(mem);
          await upsert.member_transaction({
            member_id: created_mem.id,
            transaction_id: t.id,
            line_item_index: i,
            amount: d.amount,
            sku: d.sku,
          });
          new_members.push(created_mem);
        }
      }
    }

    return new_members;
  },
};

export const insert = {
  member: async (m: SupabaseMemberInsert): Promise<SupabaseMember> => {
    const member = { ...m, sku: undefined, amount: undefined };
    const { error, data } = await supabase
      .from("members")
      .insert(member)
      .select();

    if (error)
      throw new Error(
        `Failed to insert new member. ${error.hint}. ${error.message}`
      );

    return data[0];
  },
};

export const perform = {
  calculate_member_conflicts: async () => {
    const { error } = await supabase.rpc("populate_member_conflicts");

    if (error)
      throw new Error(
        `Failed to populate member conflicts. ${error.hint}. ${error.message}`
      );
  },

  is_member_subset: (
    existingMember: SupabaseMember,
    newMemberData: SupabaseMemberInsert
  ) => {
    const keys = Object.keys(newMemberData) as (keyof SupabaseMemberInsert)[];

    for (const key of keys) {
      if (
        typeof existingMember[key] === "string" &&
        typeof newMemberData[key] === "string"
      ) {
        if (
          existingMember[key].toLowerCase() !== newMemberData[key].toLowerCase()
        ) {
          return false;
        }
      }
    }
    return true;
  },
};
