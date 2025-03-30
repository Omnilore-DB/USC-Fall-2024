import { useEffect, useState } from "react";
import { Permission } from "@/app/supabase";

export const usePermissions = (roles: string[]) => {
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>(
    {},
  );

  useEffect(() => {
    if (!roles.length) return;

    const fetchPermissions = async () => {
      try {
        const allPermissions: Record<string, Permission[]> = {};
        for (const role of roles) {
          const response = await fetch(`/api/permissions?role=${role}`);
          const data = await response.json();
          allPermissions[role] = data || [];
        }
        setPermissions(allPermissions);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      }
    };

    fetchPermissions();
  }, [roles]);

  return permissions;
};
