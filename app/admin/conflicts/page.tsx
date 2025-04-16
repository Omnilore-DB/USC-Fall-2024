"use client";

import { useEffect, useState, useMemo } from "react";
import { getRoles, getPermissions, Permission, getMemberNamesByIds } from "@/app/supabase";
import { queryTableWithPrimaryKey } from "@/app/queryFunctions";
import TableComponent from "@/components/ui/TableComponent";
import SearchInput from "@/components/ui/SearchInput";
import ResolveConflictPanel from "@/components/ui/ResolveConflictPanel";
import { MoonLoader } from "react-spinners";

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
  const [isLoading, setIsLoading] = useState(true);
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

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const { data, primaryKeys } = await queryTableWithPrimaryKey(tableName);
  
      // Get all unique member IDs from the conflicts
      const memberIds = Array.from(new Set(
        data
          .filter((entry) => !entry.resolved)
          .flatMap(entry => [entry.first_member_id, entry.second_member_id])
      )).filter(Boolean);
  
      let memberMap: Record<string, string> = {};
      if (memberIds.length > 0) {
        // Use the reusable function to fetch member names
        const members = await getMemberNamesByIds(memberIds);
        memberMap = Object.fromEntries(
          members.map((m: any) => [String(m.id), `${m.first_name} ${m.last_name}`])
        );
      }
  
      // Attach names to each conflict entry
      setEntries(
        data
          .filter((entry) => !entry.resolved)
          .map(entry => ({
            first_member_id: entry.first_member_id,
            first_member_name: memberMap[entry.first_member_id] || "",
            second_member_id: entry.second_member_id,
            second_member_name: memberMap[entry.second_member_id] || "",
            createdAt: entry.createdAt,
            resolved: entry.resolved,
            ...entry, 
          }))
      );
      setPrimaryKeys(primaryKeys ?? []);
    } catch (error) {
      console.error(`Failed to fetch ${tableName}`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const setup = async () => {
      try {
        setIsLoading(true);
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
      } catch (error) {
        console.error("Error during setup", error);
      } finally {
        setIsLoading(false);
      }
    };

    setup().catch(console.error);
    fetchEntries();
  }, []);

  return (
    <div className="flex h-full w-full flex-col bg-gray-100">
      <div className="flex w-full flex-grow flex-col items-center justify-center overflow-y-auto">
        {roles.length === 0 ? (
          <div>Don't have the necessary permission</div>
        ) : isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-lg font-bold">
              <MoonLoader />
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center gap-3 px-4 pt-4">
            <SearchInput query={query} setQuery={setQuery} />

            {primaryKeys && (
              <div className="w-full flex-grow overflow-y-auto">
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
                refresh={fetchEntries}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
