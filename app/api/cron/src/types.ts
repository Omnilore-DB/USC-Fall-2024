// --- Shared types ---
type Money = {
  currency: string;
  value: string; // as provided by the API (e.g., "150.00")
};

type Link = {
  rel: string;
  href: string;
  method: string;
  targetSchema?: string;
  schema?: string;
};

// --- TRANSACTIONS API TYPES ---

// Payment refunds
type PaymentRefund = {
  id: string;
  amount: Money;
  refundedOn: string;
  externalTransactionId: string;
};

// Processing fee refunds within a payment's processing fees
type ProcessingFeeRefund = {
  id: string;
  amount: Money;
  amountGatewayCurrency: Money;
  exchangeRate: string;
  refundedOn: string;
  externalTransactionId: string;
};

// Payment processing fees (can have nested fee refunds)
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

// A Payment transaction
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

// Taxes (used in sales line items and shipping)
type Tax = {
  amount: Money;
  rate: string;
  name: string;
  // For salesLineItems:
  jurisdiction?: string;
  // For shippingLineItems:
  description?: string;
};

// A sales line item for an order (for orders, this is in the "salesLineItems" array)
type SalesLineItem = {
  id: string;
  discountAmount: Money;
  totalSales: Money;
  totalNetSales: Money;
  total: Money;
  taxes: Tax[];
};

// A discount applied to an order or donation
type Discount = {
  description: string;
  name: string;
  amount: Money;
};

// A shipping line item
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

// Shipping line for orders
type OrderShippingLine = {
  method: string;
  amount: Money;
};

// Discount lines for orders
type OrderDiscountLine = {
  description?: string;
  name: string;
  amount: Money;
  promoCode?: string;
};

// Fulfillment details for an order
type OrderFulfillment = {
  shipDate: string;
  carrierName: string;
  service: string;
  trackingNumber: string;
  trackingUrl: string;
};

// Notes and form submission entries
type OrderInternalNote = {
  content: string;
};

type OrderFormSubmission = {
  label: string;
  value: string;
};

// Full Order response type
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
  email?: string;
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
  /** Array of InventoryItem resources. If no physical or service product variants exist, this array is empty. */
  inventory: SquarespaceInventoryItem[];
  /** Pagination details for iterating on the available InventoryItems. */
  pagination: Pagination;
};

// --- INVENTORY API TYPES (Retrieve Specific Inventory) ---

export type SquarespaceSpecificInventoryAPIResponse = {
  /** Array of InventoryItem resources. If the merchant site doesn't have any physical or service products, this array is empty. */
  inventory: SquarespaceInventoryItem[];
};

// --- SUPABASE SCHEMA ---

export type SupabasePaymentPlatform = "STRIPE" | "PAYPAL" | "MAIL";

export type SupabaseTransaction = {
  created_at: string; // timestampz
  updated_at: string; // timestampz
  sqsp_transaction_id: string; // varchar
  sqsp_order_id: string | null; // varchar | null
  amount: number; // float8
  fee: number; // float8
  date: string; // timestampz
  skus: string[]; // varchar[]
  payment_platform: SupabasePaymentPlatform; // paymentplatform
  external_transaction_id: string; // varchar
  user_names: string[]; // varchar[]
  user_amounts: number[]; // float8[]
  user_emails: string[]; // varchar[]
  member_pid: number[]; // int8[]
  issues: Issue[]; // jsonb[]
  user_form_input: Record<string, unknown>[]; // jsonb[]
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
  name: string;
  email: string;
  phone?: string;
  amount: number;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  emergency_contact_name?: string;
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
  | "SKU_NOT_FOUND"
  | "MEMBER_CONFLICT";

export type Product = {
  id: string;
  sku: string;
  descriptor: string;
};
