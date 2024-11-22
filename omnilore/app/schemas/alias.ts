import { supabase } from "@/app/supabase";
import { CompositeType, View } from "@/app/schemas/schema";

export const aliasViews: View[] = [
  {
    name: "Alias",
    priority: 2,
    roles: ["admin"],
    schema: {
      type: "composite",
      columns: {
        pid: { type: "basic", name: "int", nullable: false },
        member_id: { type: "basic", name: "int", nullable: true },
        nick_name: { type: "basic", name: "text", nullable: true },
      },
    },
    query_function: async (): Promise<any> => {
      const { data, error } = await supabase
        .from("alias")
        .select("pid, member_id, nick_name")
        .order("pid", { ascending: true });
      if (error) throw error;
      return data;
    },
    upsert_function: async (value: any): Promise<any> => {
      const { data, error } = await supabase.from("alias").upsert(value);
      if (error) throw error;
      return data;
    },
    delete_function: async (pid: any): Promise<any> => {
      const { data, error } = await supabase
        .from("alias")
        .delete()
        .eq("pid", pid);
      if (error) throw error;
      return data;
    },
  },
];
