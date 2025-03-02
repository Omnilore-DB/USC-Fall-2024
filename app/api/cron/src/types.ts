import type { donation_form, forum_form, membership_form } from "./zod";
import type { z } from "zod";

// --- Shared types ---
type Money = {
  currency: string;
  value: string;
};

type Link = {
  rel: string;
  href: string;
  method: string;
  targetSchema?: string;
  schema?: string;
};

// --- TRANSACTIONS API TYPES ---

type PaymentRefund = {
  id: string;
  amount: Money;
  refundedOn: string;
  externalTransactionId: string;
};

type ProcessingFeeRefund = {
  id: string;
  amount: Money;
  amountGatewayCurrency: Money;
  exchangeRate: string;
  refundedOn: string;
  externalTransactionId: string;
};

type PaymentProcessingFee = {
  id: string;
  amount: Money;
  amountGatewayCurrency: Money;
  exchangeRate: string;
  refundedAmount: Money;
  refundedAmountGatewayCurrency: Money;
  netAmount: Money;
  netAmountGatewayCurrency: Money;
  feeRefunds: ProcessingFeeRefund[];
};

type Payment = {
  id: string;
  amount: Money;
  refundedAmount: Money;
  netAmount: Money;
  creditCardType: string | null;
  provider: string;
  refunds: PaymentRefund[];
  processingFees: PaymentProcessingFee[];
  giftCardId: string | null;
  paidOn: string;
  externalTransactionId: string;
  externalTransactionProperties: unknown[]; // Array of key/value pairs
  externalCustomerId: string | null;
};

type Tax = {
  amount: Money;
  rate: string;
  name: string;
  // For salesLineItems:
  jurisdiction?: string;
  // For shippingLineItems:
  description?: string;
};

type SalesLineItem = {
  id: string;
  discountAmount: Money;
  totalSales: Money;
  totalNetSales: Money;
  total: Money;
  taxes: Tax[];
};

type Discount = {
  description: string;
  name: string;
  amount: Money;
};

type ShippingLineItem = {
  id: string;
  amount: Money;
  discountAmount: Money;
  netAmount: Money;
  description: string;
  taxes: Tax[];
};

// A single transaction document (order/donation) from the Transactions API
export type SquarespaceTransactionDocument = {
  id: string;
  createdOn: string;
  modifiedOn: string;
  customerEmail: string;
  salesOrderId: string | null;
  voided: boolean;
  totalSales: Money;
  totalNetSales: Money;
  totalNetShipping: Money;
  totalTaxes: Money;
  total: Money;
  totalNetPayment: Money;
  payments: Payment[];
  salesLineItems: SalesLineItem[];
  discounts: Discount[];
  shippingLineItems: ShippingLineItem[];
  paymentGatewayError: string | null;
};

type Pagination = {
  hasNextPage: boolean;
  nextPageCursor: string;
  nextPageUrl: string;
};

export type SquarespaceTransactionsAPIResponse = {
  documents: SquarespaceTransactionDocument[];
  pagination: Pagination;
};

// --- ORDERS API TYPES ---

// Address type for billing and shipping addresses
type Address = {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  countryCode: string;
  postalCode: string;
  phone: string;
};

// For order line items, variant options and customizations
type OrderVariantOption = {
  value: string;
  optionName: string;
};

type OrderCustomization = {
  label: string;
  value: string;
};

type OrderLineItem = {
  id: string;
  variantId: string | null;
  sku: string | null;
  productId: string | null;
  productName: string;
  quantity: number;
  unitPricePaid: Money;
  variantOptions: OrderVariantOption[] | null;
  customizations: OrderCustomization[] | null;
  imageUrl: string | null;
  lineItemType: string;
};

type OrderShippingLine = {
  method: string;
  amount: Money;
};

type OrderDiscountLine = {
  description?: string;
  name: string;
  amount: Money;
  promoCode?: string;
};

type OrderFulfillment = {
  shipDate: string;
  carrierName: string;
  service: string;
  trackingNumber: string;
  trackingUrl: string;
};

type OrderInternalNote = {
  content: string;
};

type OrderFormSubmission = {
  label: string;
  value: string;
};

export type SquarespaceOrderAPIResponse = {
  id: string;
  orderNumber: string;
  createdOn: string;
  modifiedOn: string;
  channel: string;
  testmode: boolean;
  customerEmail: string;
  billingAddress: Address;
  shippingAddress: Address;
  fulfillmentStatus: "PENDING" | "FULFILLED" | "CANCELED";
  lineItems: OrderLineItem[];
  internalNotes: OrderInternalNote[];
  shippingLines: OrderShippingLine[];
  discountLines: OrderDiscountLine[];
  formSubmission: OrderFormSubmission[];
  fulfillments: OrderFulfillment[];
  subtotal: Money;
  shippingTotal: Money;
  discountTotal: Money;
  taxTotal: Money;
  refundedTotal: Money;
  grandTotal: Money;
  channelName: string;
  externalOrderReference: string;
  fulfilledOn: string;
  priceTaxInterpretation: "EXCLUSIVE" | "INCLUSIVE";
  _links?: Link[];
};

// --- PROFILES API TYPES ---

type SquarespaceProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Additional fields can be added as needed.
};

export type SquarespaceProfileAPIResponse = {
  profiles: SquarespaceProfile[];
};

// --- INVENTORY API TYPES ---

export type SquarespaceInventoryItem = {
  /** The product variant id, which also serves as a unique id for the InventoryItem. */
  variantId: string;
  /** Stock keeping unit (SKU) code assigned by the Squarespace merchant for the variant. */
  sku: string;
  /** Generated description using the product's title and available variant attributes. */
  descriptor: string;
  /** Indicates whether stock is tracked (when true, stock is unlimited). */
  isUnlimited: boolean;
  /** Current amount in stock, or the last known value prior to becoming unlimited. */
  quantity: number;
};

export type SquarespaceInventoryAPIResponse = {
  inventory: SquarespaceInventoryItem[];
  pagination: Pagination;
};

export type SquarespaceSpecificInventoryAPIResponse = {
  inventory: SquarespaceInventoryItem[];
};

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

export type SupabaseProduct = {
  created_at: string; // timestampz
  updated_at: string; // timestampz
  id: string; // varchar
  sku: string; // varchar
  descriptor: string; // varchar
};

export type SupabaseMember = {
  pid: number; // bigint, auto-generated identity, primary key
  first_name: string; // text
  last_name: string; // text
  street_address: string | null; // text
  city: string | null; // text
  state: string | null; // text
  zip: string | null; // text
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
} & (
  | z.infer<typeof forum_form>
  | z.infer<typeof membership_form>
  | z.infer<typeof donation_form>
  | {}
);

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
