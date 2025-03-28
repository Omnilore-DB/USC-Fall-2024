"use client";

import { useEffect, useState, useMemo } from "react";
import { getRoles, getPermissions, Permission } from "@/app/supabase";
import { queryTableWithPrimaryKey } from "@/app/queryFunctions";
import TableComponent from "@/components/ui/TableComponent";
import SearchInput from "@/components/ui/SearchInput";
import ResolveConflictPanel from "@/components/ui/ResolveConflictPanel";

export default function ConflictsPage() {
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>(
    {},
  );
  const [entries, setEntries] = useState<Record<string, any>[]>([]);
  const [query, setQuery] = useState("");
  const [primaryKeys, setPrimaryKeys] = useState<string[] | null>(null);
  const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(
    null,
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const tableName = "member_conflicts";

  const filteredEntries = useMemo(() => {
    const keywords = query.toLowerCase().split(" ").filter(Boolean);
    return entries.filter((item) =>
      keywords.every((kw) =>
        Object.values(item).some(
          (value) =>
            value !== null && value.toString().toLowerCase().includes(kw),
        ),
      ),
    );
  }, [query, entries]);

  const hasPermission = (action: keyof Permission) => {
    return roles.some((role) =>
      permissions[role]?.some((p) => p.table_name === tableName && p[action]),
    );
  };

  const handleRowSelection = (row: Record<string, any>) => {
    if (hasPermission("can_write")) {
      setSelectedRow(row);
      setIsPanelOpen(true);
    } else {
      alert("NO EDIT PERMISSION");
    }
  };

  useEffect(() => {
    const setup = async () => {
      const userRoles = await getRoles();
      if (!userRoles) {
        console.error("Failed to fetch roles");
        return;
      }
      setRoles(userRoles);

      const allPermissions: Record<string, Permission[]> = {};
      for (const role of userRoles) {
        const rolePermissions = await getPermissions(role);
        allPermissions[role] = rolePermissions;
      }
      setPermissions(allPermissions);
    };

    setup().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data, primaryKeys } = await queryTableWithPrimaryKey(tableName);
        setEntries(data);
        setPrimaryKeys(primaryKeys ?? []);
      } catch (error: any) {
        console.error(`Failed to fetch ${tableName}`, error);
      }
    };

    fetchEntries();
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-gray-100">
      <div className="flex-grow flex flex-col w-full overflow-y-auto justify-center items-center">
        {roles.length === 0 ? (
          <div>Don't have the necessary permission</div>
        ) : (
          <div className="w-full h-full flex flex-col items-center gap-3 px-4 pt-4">
            <SearchInput query={query} setQuery={setQuery} />

            {primaryKeys && (
              <div className="flex-grow w-full overflow-y-auto">
                <TableComponent
                  entries={filteredEntries}
                  roles={roles}
                  selectedRow={selectedRow}
                  handleRowSelection={handleRowSelection}
                  primaryKeys={primaryKeys}
                  adminTable={true}
                  showImages={false}
                />
              </div>
            )}

            {selectedRow && (
              <ResolveConflictPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                firstMemberId={selectedRow.first_member_id}
                secondMemberId={selectedRow.second_member_id}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
