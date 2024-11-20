import { supabase } from "@/app/supabase";
import { CompositeType, View } from "@/app/schemas/schema";

export const committeeViews: View[] = [
  {
    name: "Committee",
    priority: 2,
    roles: ["admin"],
    schema: {
      type: "composite",
      columns: {
        pid: { type: "basic", name: "int", nullable: false },
        committee_name: { type: "basic", name: "text", nullable: false },
      },
    },
    query_function: async (): Promise<any> => {
      const { data, error } = await supabase
        .from("committees")
        .select("pid, committee_name")
        .order("pid", { ascending: true });
      if (error) throw error;
      return data;
    },
    upsert_function: async (value: any): Promise<any> => {
      const { data, error } = await supabase.from("committees").upsert(value);
      if (error) throw error;
      return data;
    },
    delete_function: async (pid: any): Promise<any> => {
      const { data, error } = await supabase
        .from("committees")
        .delete()
        .eq("pid", pid);
      if (error) throw error;
      return data;
    },
  },
];
