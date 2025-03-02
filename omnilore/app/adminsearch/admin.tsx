'use client'
import { useState, useEffect, useMemo } from "react";
import { getRoles, getPermissions, Permission } from "@/app/supabase";
import { ActionButton } from "@/components/ui/actionButton";
import TableComponent from "@/components/ui/TableComponent";
import TableSelectDropdown from "@/components/ui/TableSelectDropdown";
import SearchInput from "@/components/ui/SearchInput";
import { queryTableWithPrimaryKey } from '@/app/queryFunctions';
import ActionPanel from "@/components/ui/ActionPanel";

export default function AdminSearch() {
    const [query, setQuery] = useState("");
    const [entries, setEntries] = useState<Record<string, any>[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [permissions, setPermissions] = useState<Record<string, Permission[]>>({});
    const [tables, setTables] = useState<string[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [primaryKey, setPrimaryKey] = useState<string | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    
    const filteredEntries = useMemo(() => {
        const keywords = query.toLowerCase().split(" ").filter(Boolean);
        return entries.filter(item =>
            keywords.every(kw =>
                Object.values(item).some(value =>
                    value !== null && value.toString().toLowerCase().includes(kw)
                )
            )
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

            setPermissions(allPermissions);
            setTables(Array.from(viewTables));
            setSelectedTable(Array.from(viewTables)[0] || null);
        };

        setup().catch(console.error);
    }, []);


    useEffect(() => {
        const fetchEntries = async () => {
            if (!selectedTable) return;
            try {
                const { data, primaryKey } = await queryTableWithPrimaryKey(selectedTable);
                setEntries(data);
                setPrimaryKey(primaryKey ?? '');
            } catch (error: any) {
                console.error(`Failed to fetch data and primary key for table ${selectedTable}`, error);
                if (error?.message) {
                    console.error('Error message:', error.message);
                }
                if (error?.status) {
                    console.error('HTTP Status:', error.status);
                }
            }
        };

        fetchEntries();
    }, [selectedTable]);


    const hasPermission = (action: keyof Permission) => {
        if (!selectedTable) return false;

        return roles.some((role) =>
            permissions[role]?.some((p) => p.table_name === selectedTable && p[action])
        );
    };

    const handleDeleteClick = () => {
        if (!selectedRow) {
            alert("Please select a row to delete.");
            return;
        }

        if (hasPermission("can_delete")) {
            alert("DELETE REGISTERED");
            // Add delete logic here



        } else {
            alert("NO DELETE PERMISSIONS");
        }
    };
    

    const openPanel = (mode: 'add' | 'edit') => {
        if (mode === 'edit' && selectedRow === null) {
            alert("Please select a row to edit.");
            return;
        }

        if ((mode === 'add' && hasPermission("can_create")) || (mode === 'edit' && hasPermission("can_write"))) {
            setEditMode(mode === 'edit');
            setIsPanelOpen(true);
        } else {
            alert(`NO ${mode.toUpperCase()} PERMISSION`);
        }
    };


    return (
        <div className="w-full h-full flex flex-col items-center">
            <div className="w-5/6 h-full flex flex-col gap-3">
                <div className="flex justify-between">
                    <div className="w-1/5">
                        <TableSelectDropdown
                            tables={tables}
                            selectedTable={selectedTable}
                            setSelectedTable={setSelectedTable}
                        />
                    </div>
                    <div className="flex gap-1">
                        {hasPermission("can_create") && (
                            <ActionButton actionType="add" onClick={() => openPanel('add')} />
                        )}
                        {hasPermission("can_write") && (
                            <ActionButton actionType="edit" onClick={() => openPanel('edit')} disabled={selectedRow === null} />
                        )}
                        {hasPermission("can_delete") && (
                            <ActionButton actionType="delete" onClick={() => selectedRow && alert("DELETE REGISTERED")} disabled={selectedRow === null} />
                        )}
                    </div>
                </div>

                <SearchInput query={query} setQuery={setQuery} />

                {primaryKey && (
                    <div className="flex-grow w-full overflow-y-auto mb-4">
                        <TableComponent
                            entries={filteredEntries}
                            roles={roles}
                            selectedRow={selectedRow}
                            handleRowSelection={(row) => setSelectedRow(row)}
                            primaryKey={primaryKey}
                        />
                    </div>
                )}
            </div>
            {selectedTable && (
                <ActionPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                selectedTable={selectedTable}
                mode={editMode ? "edit" : "add"}
                selectedRow ={selectedRow }
                    />
            )}
            
        </div>
        

    );

}
