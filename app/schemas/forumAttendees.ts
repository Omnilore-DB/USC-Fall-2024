import { supabase } from "@/app/supabase";
import { CompositeType, View } from "@/app/schemas/schema";

export const forumsAttendeesViews: View[] = [
  {
    name: "ForumAttendees",
    priority: 2,
    roles: ["admin"],
    schema: {
      type: "composite",
      columns: {
        pid: { type: "basic", name: "int", nullable: false },
        forum_id: { type: "basic", name: "int", nullable: true },
        member_id: { type: "basic", name: "int", nullable: true },
        guest_id: { type: "basic", name: "int", nullable: true },
        order_date: { type: "basic", name: "date", nullable: true },
      },
    },
    query_function: async (): Promise<any> => {
      const { data, error } = await supabase
        .from("forum_attendees")
        .select("pid, forum_id, member_id, guest_id, order_date")
        .order("pid", { ascending: true });
      if (error) throw error;
      return data;
    },
    upsert_function: async (value: any): Promise<any> => {
      const { data, error } = await supabase
        .from("forum_attendees")
        .upsert(value);
      if (error) throw error;
      return data;
    },
    delete_function: async (pid: any): Promise<any> => {
      const { data, error } = await supabase
        .from("forum_attendees")
        .delete()
        .eq("pid", pid);
      if (error) throw error;
      return data;
    },
  },
];
