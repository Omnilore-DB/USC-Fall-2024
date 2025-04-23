"use server";

import { update } from "@/app/api/cron/src/supabase/api";

export async function updatePayout(
  temporalKey: string,
  received: boolean,
  paymentPlatform: "PAYPAL" | "STRIPE",
) {
  return await update.payout(temporalKey, received, paymentPlatform);
}
