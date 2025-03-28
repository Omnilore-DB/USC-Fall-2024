import { supabase } from "@/app/supabase";
import { CompositeType, View, Report } from "@/app/schemas/schema";

export const forumsViews: View[] = [
  {
    name: "Forums",
    priority: 2,
    roles: ["admin"],
    schema: {
      type: "composite",
      columns: {
        pid: { type: "basic", name: "int", nullable: false },
        sku: { type: "basic", name: "int", nullable: false },
        forum_name: { type: "basic", name: "text", nullable: false },
        available_spots: { type: "basic", name: "int", nullable: true },
        description: { type: "basic", name: "text", nullable: true },
        date: { type: "basic", name: "timestamp", nullable: false },
      },
    },
    query_function: async (): Promise<any> => {
      // Fetch and log entries from the forums table with join on products
      const { data, error } = await supabase
        .from("forums")
        .select(
          `
            pid,
            available_spots,
            description,
            date,
            product_id,
            product:products!inner(pid, sku, description)
          `,
        )
        .order("pid", { ascending: true });

      // Log the raw data and error
      if (error) throw error;

      return data.map((item: any) => ({
        pid: item.pid,
        sku: item.product.sku,
        forum_name: item.product.description,
        available_spots: item.available_spots,
        description: item.description,
        date: item.date,
      }));
    },
    upsert_function: async (value: any): Promise<any> => {
      // Fetch the product_id from the products table using the provided sku

      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("pid")
        .eq("description", value.forum_name)
        .single();

      if (productError) throw productError;
      const product_id = productData.pid;
      // Upsert the forum entry with the fetched product_id
      const upsertData = {
        pid: value.pid,
        product_id: product_id,
        available_spots: value.available_spots,
        description: value.description,
        date: value.date,
      };

      const { data, error } = await supabase
        .from("forums")
        .upsert(upsertData)
        .single();

      if (error) throw error;

      // Fetch and log entries from the forums table with join on products
      const { data: updatedData, error: fetchError } = await supabase
        .from("forums")
        .select(
          `
            pid,
            available_spots,
            description,
            date,
            product_id,
            product:products!inner(pid, sku, description)
          `,
        )
        .order("pid", { ascending: true });

      if (fetchError) throw fetchError;

      return updatedData.map((item: any) => ({
        pid: item.pid,
        sku: item.product.sku,
        forum_name: item.product.description,
        available_spots: item.available_spots,
        description: item.description,
        date: item.date,
      }));
    },
    delete_function: async (pid: any): Promise<any> => {
      const { data, error } = await supabase
        .from("forums")
        .delete()
        .eq("pid", pid);
      if (error) throw error;
      return data;
    },
  },
];

export const forumsReports: Report[] = [
  {
    name: "Forum",
    priority: 1,
    roles: ["treasurer", "admin", "registrar"],
    schema: {
      type: "composite",
      columns: {
        pid: { type: "basic", name: "int", nullable: false },
        sku: { type: "basic", name: "int", nullable: false },
        forum_name: { type: "basic", name: "text", nullable: false },
        available_spots: { type: "basic", name: "int", nullable: true },
        description: { type: "basic", name: "text", nullable: true },
        date: { type: "basic", name: "timestamp", nullable: false },
      },
    },
    query_function: async (): Promise<any> => {
      // Fetch and log entries from the forums table with join on products
      const { data, error } = await supabase
        .from("forums")
        .select(
          `
            pid,
            available_spots,
            description,
            date,
            product_id,
            product:products!inner(pid, sku, description)
          `,
        )
        .order("pid", { ascending: true });

      // Log the raw data and error
      if (error) throw error;

      return data.map((item: any) => ({
        pid: item.pid,
        sku: item.product.sku,
        forum_name: item.product.description,
        available_spots: item.available_spots,
        description: item.description,
        date: item.date,
      }));
    },
    upsert_function: null,
    delete_function: null,
  },
];
