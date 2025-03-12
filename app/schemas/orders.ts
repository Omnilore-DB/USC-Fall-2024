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
        pid: { type: "basic", name: "varchar", nullable: false },
        member_names: { type: "basic", name: "_varchar", nullable: true },
        member_emails: { type: "basic", name: "_varchar", nullable: false },
        payment_platform: { type: "enum", values: ["STRIPE", "PAYPAL", "MAIL"]},
        date: { type: "basic", name: "timestamp", nullable: false },
        SKUDescription: { type: "basic", name: "_varchar", nullable: false },
        amount: { type: "basic", name: "double precision", nullable: false },
        external_transaction_id: { type: "basic", name: "varchar", nullable: false },
      },
    },
    query_function: async (): Promise<any> => {
      const { data, error } = await supabase
        .from("orders")
        .select("sqsp_transaction_id, user_names, user_emails,payment_platform, date, skus, amount, external_transaction_id")
        .order("sqsp_transaction_id", { ascending: true });
      if (error) throw error;
      const transformedData = data.map((item: any) => ({
        pid: item.sqsp_transaction_id,
        member_names: item.user_names.join(", "),
        member_emails: item.user_emails.join(", "),
        SKUDescription: item.skus.join(", "),
        payment_platform: item.payment_platform,
        date: item.date,
        amount: item.amount,
        external_transaction_id: item.external_transaction_id,
      }));
    
      return transformedData;
    },
    upsert_function: async (value: any): Promise<any> => {

      const upsertData = {
        user_names: [value.member_names], // Wrap single name in an array
        user_emails: [value.member_emails], // Wrap single email in an array
        skus: [value.SKUDescription], // Wrap single SKU in an array
        payment_platform: value.payment_platform,
        sqsp_transaction_id: value.pid,
        date: value.date,
        amount: value.amount,
        external_transaction_id: value.external_transaction_id,
      };

      const { data, error } = await supabase.from("orders").upsert(upsertData, { onConflict: "sqsp_transaction_id" });
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
