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

// Processing fee refunds within a payment’s processing fees
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
  externalTransactionProperties: any[]; // Array of key/value pairs
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

// A sales line item for an order (for orders, this is in the “salesLineItems” array)
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

// SUPABASE ORDER SCHEMA

export type PaymentPlatform = "STRIPE" | "PAYPAL" | "MAIL";

export type SupabaseOrder = {
  created_at: string; // timestampz
  updated_at: string; // timestampz
  sqsp_transaction_id: string; // varchar
  sqsp_order_id: string | null; // varchar | null
  amount: number; // float8
  fee: number; // float8
  date: string; // timestampz
  skus: string[]; // varchar[]
  payment_platform: PaymentPlatform; // paymentplatform
  external_transaction_id: string; // varchar
  user_names: string[]; // varchar[]
  user_amounts: number[]; // float8[]
  user_emails: string[]; // varchar[]
  member_pid: number[]; // int8[]
};

// --- APPLICATION TYPES ---
// (Your internal types that you map API data into.)

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
};
