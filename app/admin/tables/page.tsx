"use client";

import { useState, useEffect, useMemo } from "react";
import { getRoles, getPermissions, Permission } from "@/app/supabase";
import { ActionButton } from "@/components/ui/actionButton";
import TableComponent from "@/components/ui/TableComponent";
import TableSelectDropdown from "@/components/ui/TableSelectDropdown";
import SearchInput from "@/components/ui/SearchInput";
import { queryTableWithPrimaryKey } from "@/app/queryFunctions";
import ActionPanel from "@/components/ui/ActionPanel";
import DeletePanel from "@/components/ui/DeletePanel";

export default function Search() {
  const [query, setQuery] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [entries, setEntries] = useState<Record<string, any>[]>([]);
  const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(
    null,
  );
  const [editMode, setEditMode] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>(
    {},
  );
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [primaryKeys, setPrimaryKeys] = useState<string[] | null>(null);
  const [isEntryPanelOpen, setIsEntryPanelOpen] = useState(false);
  const [isDeletePanelOpen, setIsDeletePanelOpen] = useState(false);

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

  useEffect(() => {
    const setup = async () => {
      const userRoles = await getRoles();
      if (!userRoles) {
        console.error("Failed to fetch roles");
        return;
      }
      setRoles(userRoles);

      const allPermissions: Record<string, Permission[]> = {};
      const viewTables = new Set<string>();
      const addTables = new Set<string>();
      const editTables = new Set<string>();
      const deleteTables = new Set<string>();

      for (const role of userRoles) {
        const rolePermissions = await getPermissions(role);
        allPermissions[role] = rolePermissions;

        rolePermissions.forEach((permission) => {
          if (permission.can_create) {
            addTables.add(permission.table_name);
          }
          if (permission.can_read) {
            viewTables.add(permission.table_name);
          }
          if (permission.can_write) {
            editTables.add(permission.table_name);
          }
          if (permission.can_delete) {
            deleteTables.add(permission.table_name);
          }
        });
      }

      const tablesArray = Array.from(viewTables);
      setPermissions(allPermissions);
      setTables(tablesArray);
      setSelectedTable(tablesArray[0] || null);
    };

    setup().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!selectedTable) return;
      try {
        const { data, primaryKeys } =
          await queryTableWithPrimaryKey(selectedTable);
        setEntries(data);
        setPrimaryKeys(primaryKeys ?? "");
      } catch (error: any) {
        console.error(
          `Failed to fetch data and primary key for table ${selectedTable}`,
          error,
        );
        if (error?.message) {
          console.error("Error message:", error.message);
        }
        if (error?.status) {
          console.error("HTTP Status:", error.status);
        }
      }
    };

    fetchEntries();
  }, [selectedTable]);

  const hasPermission = (action: keyof Permission) => {
    if (!selectedTable) return false;

    return roles.some((role) =>
      permissions[role]?.some(
        (p) => p.table_name === selectedTable && p[action],
      ),
    );
  };

  const openDeletePanel = () => {
    if (selectedRow == null) {
      alert("Select a row");
      return;
    }

    setIsDeletePanelOpen(true);
  };

  const openEntryPanel = (mode: "add" | "edit") => {
    if (mode === "edit" && selectedRow === null) {
      alert("Select a row");
      return;
    }

    if (
      (mode === "add" && hasPermission("can_create")) ||
      (mode === "edit" && hasPermission("can_write"))
    ) {
      setEditMode(mode === "edit");
      setIsEntryPanelOpen(true);
    } else {
      alert(`NO ${mode.toUpperCase()} PERMISSION`);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-gray-100">
      <div className="flex w-full flex-grow flex-col items-center justify-center overflow-y-auto">
        {roles === null ? (
          <div>Don't have the necessary permission</div>
        ) : (
          <div className="flex h-[95%] w-[98%] flex-row items-center gap-4">
            <div className="flex h-full w-full flex-col items-center">
              <div className="flex h-full w-full flex-col gap-3">
                {/* Select and add, delete, and edit buttons */}
                <div className="flex justify-between">
                  <div className="w-1/5">
                    <TableSelectDropdown
                      tables={tables}
                      selectedTable={selectedTable}
                      setSelectedTable={(table) => {
                        setSelectedTable(table);
                      }}
                    />
                  </div>
                  <div className="flex gap-1">
                    {hasPermission("can_create") && (
                      <ActionButton
                        actionType="add"
                        onClick={() => openEntryPanel("add")}
                      />
                    )}
                    {hasPermission("can_write") && (
                      <ActionButton
                        actionType="edit"
                        onClick={() => openEntryPanel("edit")}
                      />
                    )}
                    {hasPermission("can_delete") && (
                      <ActionButton
                        actionType="delete"
                        onClick={() => openDeletePanel()}
                      />
                    )}
                  </div>
                </div>

                {/* Search Input */}
                <SearchInput query={query} setQuery={setQuery} />

                {/* Table Component */}
                {primaryKeys && (
                  <div className="w-full flex-grow overflow-y-auto">
                    <TableComponent
                      entries={filteredEntries}
                      roles={roles}
                      selectedRow={selectedRow}
                      handleRowSelection={(row) => setSelectedRow(row)}
                      primaryKeys={primaryKeys}
                      adminTable={true}
                      showImages={false}
                    />
                  </div>
                )}
              </div>

              {/* Add and Edit Panel */}
              {selectedTable && (
                <ActionPanel
                  isOpen={isEntryPanelOpen}
                  onClose={() => setIsEntryPanelOpen(false)}
                  selectedTable={selectedTable}
                  mode={editMode ? "edit" : "add"}
                  selectedRow={selectedRow || undefined}
                />
              )}
              {/* Delete Panel */}
              {selectedTable && (
                <DeletePanel
                  isOpen={isDeletePanelOpen}
                  onClose={() => setIsDeletePanelOpen(false)}
                  selectedTable={selectedTable}
                  selectedRow={selectedRow}
                  onDelete={() => {
                    setIsDeletePanelOpen(false);
                    alert("DELETE REGISTERED");
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
