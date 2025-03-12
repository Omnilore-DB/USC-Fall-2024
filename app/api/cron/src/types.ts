import type { SupabaseMemberInsert } from "./supabase/types";

// --- APPLICATION TYPES ---

export type ParsedFormData = {
  sku: string;
  amount: number;
} & Partial<SupabaseMemberInsert>;

export type Issue = {
  message: string;
  code: IssueCode;
  more: Record<string, unknown>;
};

export type IssueCode =
  | "FETCH_ERROR"
  | "PROFILE_NOT_FOUND"
  | "ORDER_NOT_FOUND"
  | "SKU_UNASSIGNED"
  | "VALIDATION_ERROR";
