import { useEffect, useState } from "react";
import { Permission } from "@/app/supabase";

export const useTables = (permissions: Record<string, Permission[]>) => {
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    const accessibleTables = new Set<string>();

    Object.values(permissions)
      .flat()
      .forEach((permission) => {
        if (permission.can_read) {
          accessibleTables.add(permission.table_name);
        }
      });

    setTables(Array.from(accessibleTables));
  }, [permissions]);

  return tables;
};
