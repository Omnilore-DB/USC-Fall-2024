import type { Issue, ParsedFormData } from "../types";
import type { Database as DatabaseGenerated } from "./generated.types";
import type { MergeDeep } from "type-fest";

// --- SUPABASE SCHEMA ---

export type SupabaseTransaction =
  Database["public"]["Tables"]["transactions"]["Row"];
export type SupabaseTransactionInsert =
  Database["public"]["Tables"]["transactions"]["Insert"];

export type SupabasePaymentPlatform =
  Database["public"]["Enums"]["PaymentPlatform"];

export type SupabaseProductType = Database["public"]["Enums"]["ProductType"];

export type SupabaseProduct = Database["public"]["Tables"]["products"]["Row"];
export type SupabaseProductInsert =
  Database["public"]["Tables"]["products"]["Insert"];

export type SupabaseMember = Database["public"]["Tables"]["members"]["Row"];
export type SupabaseMemberInsert =
  Database["public"]["Tables"]["members"]["Insert"];

export type SupabaseMemberTransaction =
  Database["public"]["Tables"]["members_to_transactions"]["Row"];
export type SupabaseMemberTransactionInsert =
  Database["public"]["Tables"]["members_to_transactions"]["Insert"];

export type SupabaseMemberConflict =
  Database["public"]["Tables"]["member_conflicts"]["Row"];
export type SupabaseMemberConflictInsert =
  Database["public"]["Tables"]["member_conflicts"]["Insert"];

export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        transactions: {
          Row: {
            issues: Issue[];
            parsed_form_data: ParsedFormData[];
            raw_form_data: Record<string, string>[];
          };

          Insert: {
            issues: Issue[];
            parsed_form_data: ParsedFormData[];
            raw_form_data: Record<string, string>[];
          };

          Update: {
            issues?: Issue[];
            parsed_form_data?: ParsedFormData[];
            raw_form_data?: Record<string, string>[];
          };
        };
      };

      Functions: {
        upsert_products: {
          Args: {
            _products: SupabaseProductInsert[];
          };
        };
      };
    };
  }
>;
