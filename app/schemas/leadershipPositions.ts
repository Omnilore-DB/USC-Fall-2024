import { supabase } from "@/app/supabase";
import { CompositeType, View } from "@/app/schemas/schema";

export const leadershipPositionsViews: View[] = [
  {
    name: "LeadershipPositions",
    priority: 2,
    roles: ["admin"],
    schema: {
      type: "composite",
      columns: {
        pid: { type: "basic", name: "int", nullable: false },
        leadership_position: { type: "basic", name: "text", nullable: true },
      },
    },
    query_function: async (): Promise<any> => {
      const { data, error } = await supabase
        .from("leadership_positions")
        .select("pid, leadership_position")
        .order("pid", { ascending: true });
      if (error) throw error;
      return data;
    },
    upsert_function: async (value: any): Promise<any> => {
      const { data, error } = await supabase
        .from("leadership_positions")
        .upsert(value);
      if (error) throw error;
      return data;
    },
    delete_function: async (pid: any): Promise<any> => {
      const { data, error } = await supabase
        .from("leadership_positions")
        .delete()
        .eq("pid", pid);
      if (error) throw error;
      return data;
    },
  },
];
