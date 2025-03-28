import { supabase } from "@/app/supabase";
import { CompositeType, View } from "@/app/schemas/schema";

export const roleViews: View[] = [
  {
    name: "Roles",
    priority: 1,
    roles: ["admin"],
    schema: {
      type: "composite",
      columns: {
        pid: { type: "basic", name: "int", nullable: false },
        user_email: { type: "basic", name: "text", nullable: true },
        role: { type: "basic", name: "text", nullable: true },
      },
    },
    query_function: async (): Promise<any> => {
      const { data, error } = await supabase.rpc("get_user_roles_with_email");

      if (error) throw error;

      return data;
    },
    upsert_function: async (value: any): Promise<any> => {
      const { pid, user_email, role } = value;

      // const { data: users, error: userError } = await supabase
      //     .from('auth.users')
      //     .select('id')
      //     .eq('email', user_email);
      const { data: user_id, error: userError } = await supabase.rpc(
        "get_user_id_from_email",
        { p_email: user_email },
      );

      if (userError) throw userError;

      const upsertData = {
        id: pid,
        user_id: user_id,
        role: role,
      };

      const { data, error } = await supabase
        .from("user_roles")
        .upsert(upsertData, { onConflict: "id" });

      if (error) throw error;

      return data;
    },
    delete_function: async (pid: any): Promise<any> => {
      const { data, error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", pid);

      if (error) throw error;

      return data;
    },
  },
];
