import { supabase } from "@/app/supabase";
import { CompositeType, View } from "@/app/schemas/schema";

export const referralViews: View[] = [
  {
    name: "Prospects",
    priority: 2,
    roles: ["admin"],
    schema: {
      type: "composite",
      columns: {
        pid: { type: "basic", name: "int", nullable: false },
        referred_by_phone: { type: "basic", name: "text", nullable: false },
        referred_by_member_id: { type: "basic", name: "int", nullable: false },
        prospect_name: { type: "basic", name: "text", nullable: false },
        prospect_phone: { type: "basic", name: "text", nullable: false },
        date: { type: "basic", name: "timestamp", nullable: false },
        notes: { type: "basic", name: "text", nullable: true },
      },
    },
    query_function: async (): Promise<any> => {
      const { data, error } = await supabase
        .from("prospects")
        .select(
          "pid, referred_by_phone, referred_by_member_id, prospect_name, prospect_phone, date, notes",
        )
        .order("pid", { ascending: true });
      if (error) throw error;
      return data;
    },
    upsert_function: async (value: any): Promise<any> => {
      const { data, error } = await supabase.from("prospects").upsert(value);
      if (error) throw error;
      return data;
    },
    delete_function: async (pid: any): Promise<any> => {
      const { data, error } = await supabase
        .from("prospects")
        .delete()
        .eq("pid", pid);
      if (error) throw error;
      return data;
    },
  },
];
