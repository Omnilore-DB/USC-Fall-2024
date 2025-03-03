// --- SUPABASE SCHEMA ---

export type SupabasePaymentPlatform = "STRIPE" | "PAYPAL" | "MAIL";

export type SupabaseTransaction = {
  created_at: string; // timestampz
  updated_at: string; // timestampz
  sqsp_transaction_id: string; // varchar
  sqsp_order_id: string | null; // varchar | null
  transaction_email: string; // text
  amount: number; // float8
  fee: number; // float8
  date: string; // timestampz
  skus: string[]; // varchar[]
  payment_platform: SupabasePaymentPlatform; // paymentplatform
  external_transaction_id: string; // varchar
  user_names: string[]; // varchar[]
  user_amounts: number[]; // float8[]
  member_pid: number[]; // int8[]
  issues: Issue[]; // jsonb[]
  parsed_form_data: Record<string, unknown>[]; // jsonb[]
  raw_form_data: Record<string, string>[]; // jsonb[]
};

type SupabaseProductType = "MEMBERSHIP" | "DONATION" | "FORUM";

export type SupabaseProduct = {
  created_at: string; // timestampz
  updated_at: string; // timestampz
  id: string; // varchar
  sku: string; // varchar
  descriptor: string; // varchar
  type: SupabaseProductType; // ProductType
  year: number | null; // text
  group_id: number | null; // int4
};

export type SupabaseMember = {
  pid: number; // bigint, auto-generated identity, primary key
  first_name: string; // text
  last_name: string; // text
  street_address: string | null; // text
  city: string | null; // text
  state: string | null; // text
  zip_code: string | null; // text
  phone: string | null; // text
  email: string | null; // text
  emergency_contact: string | null; // text
  emergency_contact_phone: string | null; // text
  member_status: string | null; // text
  expiration_date: string | null; // date
  partner: string | null; // text
  date_of_birth: string | null; // date
  deceased_date: string | null; // date
  public: boolean; // boolean, default true
  orientation_date: string | null; // date
  date_joined: string | null; // date
  notes: string | null; // text
  photo_link: string | null; // text
  gender: string | null; // text
  photo_path: string | null; // text
  created_at: string; // timestampz
  updated_at: string; // timestampz
  alias: string | null; // text
};

// --- APPLICATION TYPES ---
// (Internal types to map API data into.)
export type TransactionData = {
  sku: string;
  amount: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  emergency_contact?: string;
  emergency_contact_phone?: string;
};

export type Transaction = {
  transaction_id: string;
  order_id: string | null;
  date: string;
  total: number;
  fee: number;
  payment_platform: string;
  external_transaction_id: string;
  transaction_email: string;
  skus: string[];
  data: TransactionData[];
  raw_data: Record<string, string>[];
  issues: Issue[];
};

type Issue = {
  message: string;
  code: IssueCode;
  info: Record<string, unknown>;
};

type IssueCode =
  | "FETCH_ERROR"
  | "MISSING_FIELDS"
  | "PROFILE_NOT_FOUND"
  | "ORDER_NOT_FOUND"
  | "SKU_UNASSIGNED"
  | "MEMBER_CONFLICT"
  | "VALIDATION_ERROR";

export type Product = {
  id: string;
  sku: string;
  descriptor: string;
};
