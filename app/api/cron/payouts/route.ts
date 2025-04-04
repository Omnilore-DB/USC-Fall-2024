import { convert } from "../src/processing";
import { upsert } from "../src/supabase/api";
import { apiResponse } from "../src/utils";
import Stripe from "stripe";

export async function POST() {
  return apiResponse(async () => {
    const stripe_key = process.env.STRIPE_SECRET_KEY;

    if (!stripe_key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const stripe = new Stripe(stripe_key);

    const stripe_payouts: Stripe.Payout[] = [];
    let res = await stripe.payouts.list({ limit: 100 });

    stripe_payouts.push(...res.data);
    while (res.has_more) {
      res = await stripe.payouts.list({
        limit: 100,
        starting_after: res.data.at(-1)!.id,
      });

      stripe_payouts.push(...res.data);
    }

    await upsert.payouts(stripe_payouts.map(convert.payouts.stripe));

    return Response.json({
      message: `Upserted ${stripe_payouts.length} stripe payouts and ${0} paypal payouts`,
    });
  });
}
