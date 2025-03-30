"use client";

import { useState, useEffect, useMemo } from "react";
import { getRoles, getPermissions, Permission } from "@/app/supabase";
import { ActionButton } from "@/components/ui/ActionButton";
import TableComponent from "@/components/ui/TableComponent";
import SelectDropdown from "@/components/ui/SelectDropdown";
import SearchInput from "@/components/ui/SearchInput";
import { queryTableWithPrimaryKey } from "@/app/queryFunctions";
import ActionPanel from "@/components/ui/ActionPanel";
import DeletePanel from "@/components/ui/DeletePanel";

export default function Reports() {
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
  const reportTypes = ["Financial", "Member", "Type"];

  const typeTOTableName: Record<string, string> = {
    Financial: "transactions",
    Member: "members",
    Type: "members",
  };

  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);

  const [primaryKeys, setPrimaryKeys] = useState<string[] | null>(null);

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

      // update later
      // Defaults to financial report type
      setSelectedReportType("Financial");
    };

    setup().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!selectedReportType) return;
      try {
        const tableName = typeTOTableName[selectedReportType];
        const { data, primaryKeys } = await queryTableWithPrimaryKey(tableName);

        setEntries(data);
        setPrimaryKeys(primaryKeys ?? "");
      } catch (error: any) {
        console.error(
          `Failed to fetch data and primary key for table ${selectedReportType}`,
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
  }, [selectedReportType]);

  
  
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
                    <SelectDropdown
                      options={reportTypes}
                      selectedOption={selectedReportType}
                      setSelectedOption={(option) => {
                        setSelectedReportType(option);
                      }}
                    />
                  </div>
                </div>


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

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
