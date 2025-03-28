import { supabase } from "@/app/supabase";
import { CompositeType, View } from "@/app/schemas/schema";

export const ordersViews: View[] = [
  {
    name: "Orders",
    priority: 2,
    roles: ["admin", "treasurer", "registrar"],
    schema: {
      type: "composite",
      columns: {
        created_at: { type: "basic", name: "timestamp", nullable: false },
        sqsp_transaction_id: {
          type: "basic",
          name: "varchar",
          nullable: false,
        },
        user_emails: { type: "basic", name: "_varchar", nullable: false },
        amount: { type: "basic", name: "double precision", nullable: false },
        date: { type: "basic", name: "timestamp", nullable: false },
        skus: { type: "basic", name: "_varchar", nullable: false },
        payment_platform: {
          type: "enum",
          values: ["STRIPE", "PAYPAL", "MAIL"],
        },
        fee: { type: "basic", name: "double precision", nullable: false },
        external_transaction_id: {
          type: "basic",
          name: "varchar",
          nullable: false,
        },
        user_names: { type: "basic", name: "_varchar", nullable: false },
        user_amounts: { type: "basic", name: "_varchar", nullable: false },
        member_pid: { type: "basic", name: "_int8", nullable: false },
        issues: { type: "basic", name: "_varchar", nullable: false },
      },
    },
    query_function: async (): Promise<any> => {
      console.log("Querying orders table...");
      const { data, error } = await supabase
        .from("orders")
        .select(
          "created_at, sqsp_transaction_id, user_names, user_emails, amount, date, skus, payment_platform, fee, external_transaction_id, user_amounts, member_pid, issues",
        )
        .order("sqsp_transaction_id", { ascending: true });

      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn("No data returned from orders table.");
        return [];
      }

      console.log("Raw data from Supabase:", data);

      const transformedData = data.map((item: any) => ({
        created_at: item.created_at,
        sqsp_transaction_id: item.sqsp_transaction_id,
        user_emails: item.user_emails,
        amount: item.amount,
        date: item.date,
        skus: item.skus,
        payment_platform: item.payment_platform,
        fee: item.fee,
        external_transaction_id: item.external_transaction_id,
        user_names: item.user_names.join(", "),
        user_amounts: item.user_amounts.join(", "),
        member_pid: item.member_pid.join(", "),
        issues: item.issues.join(", "),
      }));

      return transformedData;
    },
    upsert_function: async (value: any): Promise<any> => {
      const upsertData = {
        created_at: value.created_at,
        sqsp_transaction_id: value.sqsp_transaction_id,
        user_emails: value.user_emails,
        amount: value.amount,
        date: value.date,
        skus: value.skus,
        payment_platform: value.payment_platform,
        fee: value.fee,
        external_transaction_id: value.external_transaction_id,
        user_names: [value.user_names],
        user_amounts: [value.user_amounts],
        member_pid: [value.member_pid],
        issues: [value.issues],
      };

      const { data, error } = await supabase
        .from("orders")
        .upsert(upsertData, { onConflict: "sqsp_transaction_id" });
      if (error) throw error;
      return data;
    },
    delete_function: async (pid: any): Promise<any> => {
      const { data, error } = await supabase
        .from("orders")
        .delete()
        .eq("sqsp_transaction_id", pid);
      if (error) throw error;
      return data;
    },
  },
];
