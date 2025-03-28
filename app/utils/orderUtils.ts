export interface Order {
  created_at: string;
  updated_at: string;
  sqsp_transaction_id: string;
  sqsp_order_id: string;
  user_emails: string[];
  amount: number;
  date: string;
  skus: string[];
  payment_platform: string;
  fee: number;
  external_transaction_id: string;
  user_names: string[];
  user_amounts: number[];
}

export interface FilteredOrder {
  created_at: string;
  updated_at: string;
  sqsp_transaction_id: string;
  sqsp_order_id: string;
  user_emails: string;
  amount: number;
  date: string;
  skus: string;
  payment_platform: string;
  fee: number;
  external_transaction_id: string;
  user_names: string;
  user_amounts: number;
}

export function filter_splitOrdersBySKU(ordersData: Order[], skus: string[]) {
  const filteredOrdersData: FilteredOrder[] = [];
  ordersData.forEach((order) => {
    // Validate that necessary fields are arrays
    const orderSkus = Array.isArray(order.skus) ? order.skus : [];
    const userEmails = Array.isArray(order.user_emails)
      ? order.user_emails
      : [];
    const userNames = Array.isArray(order.user_names) ? order.user_names : [];
    const userAmounts = Array.isArray(order.user_amounts)
      ? order.user_amounts
      : [];

    const N = userAmounts.length;

    for (let i = 0; i < N; i++) {
      // Check if skus[i] exists and matches the selected sku
      if (!skus.includes(orderSkus[i])) continue;

      filteredOrdersData.push({
        created_at: order.created_at || "",
        updated_at: order.updated_at || "",
        sqsp_transaction_id: order.sqsp_transaction_id || "",
        sqsp_order_id: order.sqsp_order_id || "",
        user_emails: userEmails[i] || "",
        amount: order.amount !== undefined ? order.amount : 0,
        date: order.date || "",
        skus: orderSkus[i] || "",
        payment_platform: order.payment_platform || "",
        fee: order.fee !== undefined ? order.fee : 0,
        external_transaction_id: order.external_transaction_id || "",
        user_names: userNames[i] || "",
        user_amounts: userAmounts[i] !== undefined ? userAmounts[i] : 0,
      });
    }
  });

  return filteredOrdersData;
}
