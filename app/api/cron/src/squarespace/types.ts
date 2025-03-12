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
