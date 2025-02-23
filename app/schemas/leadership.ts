import { supabase } from "@/app/supabase";
import { CompositeType, View } from "@/app/schemas/schema";

export const leadershipViews: View[] = [
  {
    name: "Leadership",
    priority: 2,
    roles: ["admin"],
    schema: {
      type: "composite",
      columns: {
        pid: { type: "basic", name: "int", nullable: false },
        leadership_position_id: { type: "basic", name: "int", nullable: true },
        member_id: { type: "basic", name: "int", nullable: true },
        start_date: { type: "basic", name: "timestamp", nullable: true },
        end_date: { type: "basic", name: "timestamp", nullable: true },
      },
    },
    query_function: async (): Promise<any> => {
      const { data, error } = await supabase
        .from("leadership")
        .select("pid, leadership_position_id, member_id, start_date, end_date")
        .order("pid", { ascending: true });
      if (error) throw error;
      return data;
    },
    upsert_function: async (value: any): Promise<any> => {
      const { data, error } = await supabase.from("leadership").upsert(value);
      if (error) throw error;
      return data;
    },
    delete_function: async (pid: any): Promise<any> => {
      const { data, error } = await supabase
        .from("leadership")
        .delete()
        .eq("pid", pid);
      if (error) throw error;
      return data;
    },
  },
];
