"use server";

import { insert, perform, update } from "@/app/api/cron/src/supabase/api";
import type { MailInOrderData } from "@/app/api/cron/src/types";

export async function insertMailInOrder(order: MailInOrderData) {
  const transaction = await insert.transaction({
    date: order.date.toISOString(),
    amount: parseFloat(order.amount),
    fee: parseFloat(order.fee),
    refunded_amount: 0,

    fulfillment_status: "PENDING",
    payment_platform: "MAIL",

    skus: [order.sku],
    transaction_email: order.email ?? "",

    issues: [],
    raw_form_data: [order],
    parsed_form_data: [
      {
        street_address: order.street_address,
        city: order.city,
        state: order.state,
        zip_code: order.zip_code,
        amount: parseFloat(order.amount),
        sku: order.sku,
        phone: order.phone,
        email: order.email,
        first_name: order.first_name,
        last_name: order.last_name,
        emergency_contact: order.emergency_contact,
        emergency_contact_phone: order.emergency_contact_phone,
      },
    ],
  });

  await update.users_given_transactions([transaction]);
  await perform.calculate_member_conflicts();
  return transaction;
}
