import { supabase } from "@/app/supabase";
import { CompositeType, View } from "@/app/schemas/schema";

export const committeeMembersViews: View[] = [
  {
    name: "CommitteeMembers",
    priority: 2,
    roles: ["admin"],
    schema: {
      type: "composite",
      columns: {
        pid: { type: "basic", name: "int", nullable: false },
        committee_id: { type: "basic", name: "int", nullable: true },
        member_id: { type: "basic", name: "int", nullable: true },
        position: { type: "basic", name: "text", nullable: true },
        active: { type: "basic", name: "boolean", nullable: true },
        start_date: { type: "basic", name: "timestamp", nullable: true },
        end_date: { type: "basic", name: "timestamp", nullable: true },
        notes: { type: "basic", name: "text", nullable: true },
      },
    },
    query_function: async (): Promise<any> => {
      const { data, error } = await supabase
        .from("committee_members")
        .select(
          "pid, committee_id, member_id, position, active, start_date, end_date, notes"
        )
        .order("pid", { ascending: true });
      if (error) throw error;
      return data;
    },
    upsert_function: async (value: any): Promise<any> => {
      const { data, error } = await supabase
        .from("committee_members")
        .upsert(value);
      if (error) throw error;
      return data;
    },
    delete_function: async (pid: any): Promise<any> => {
      const { data, error } = await supabase
        .from("committee_members")
        .delete()
        .eq("pid", pid);
      if (error) throw error;
      return data;
    },
  },
];
