import { supabase } from "@/app/supabase";
import { CompositeType, View } from "@/app/schemas/schema";

export const sdgMembersViews: View[] = [
  {
    name: "SDGMembers",
    priority: 2,
    roles: ["admin"],
    schema: {
      type: "composite",
      columns: {
        pid: { type: "basic", name: "int", nullable: false },
        member_id: { type: "basic", name: "int", nullable: true },
        sdg_id: { type: "basic", name: "int", nullable: true },
      },
    },
    query_function: async (): Promise<any> => {
      const { data, error } = await supabase
        .from("sdg_members")
        .select("pid, member_id, sdg_id")
        .order("pid", { ascending: true });
      if (error) throw error;
      return data;
    },
    upsert_function: async (value: any): Promise<any> => {
      const { data, error } = await supabase.from("sdg_members").upsert(value);
      if (error) throw error;
      return data;
    },
    delete_function: async (pid: any): Promise<any> => {
      const { data, error } = await supabase
        .from("sdg_members")
        .delete()
        .eq("pid", pid);
      if (error) throw error;
      return data;
    },
  },
];
