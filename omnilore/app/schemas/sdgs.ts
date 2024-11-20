import { supabase } from "@/app/supabase";
import { CompositeType, View } from "@/app/schemas/schema";

export const sdgsViews: View[] = [
    {
      name: "SDGs",
      priority: 2,
      roles: ["admin"],
      schema: {
        type: "composite",
        columns: {
            pid: { type: "basic", name: "int", nullable: false },
            trimester: { type: "basic", name: "text", nullable: false },
            sdg: { type: "basic", name: "text", nullable: false },
            description: { type: "basic", name: "text", nullable: true },
            coordinator: { type: "basic", name: "boolean", nullable: true },
        },
      },
      query_function: async (): Promise<any> => {
        const { data, error } = await supabase
          .from("sdgs")
          .select("pid, trimester, sdg, description, coordinator"
          )    
          .order("pid", { ascending: true });
        if (error) throw error;
        return data;
      },
      upsert_function: async (value: any): Promise<any> => {
        const { data, error } = await supabase.from("sdgs").upsert(value);
        if (error) throw error;
        return data;
      },
      delete_function: async (pid: any): Promise<any> => {
        const { data, error } = await supabase
          .from("sdgs")
          .delete()
          .eq("pid", pid);
        if (error) throw error;
        return data;
      },
    },
  ];
  