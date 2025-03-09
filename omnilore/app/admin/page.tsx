'use client'
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getRoles, getPermissions, Permission } from "@/app/supabase";
import NavBar from "@/components/ui/NavBar";
import { ActionButton } from "@/components/ui/actionButton";
import TableComponent from "@/components/ui/TableComponent";
import TableSelectDropdown from "@/components/ui/TableSelectDropdown";
import SearchInput from "@/components/ui/SearchInput";
import { queryTableWithPrimaryKey } from '@/app/queryFunctions';
import ActionPanel from "@/components/ui/ActionPanel";
import DeletePanel from "@/components/ui/DeletePanel";


export default function Search() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [roles, setRoles] = useState<string[]>([]);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [entries, setEntries] = useState<Record<string, any>[]>([]);
    const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [permissions, setPermissions] = useState<Record<string, Permission[]>>({});
    const [tables, setTables] = useState<string[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [primaryKeys, setPrimaryKeys] = useState<string[] | null>(null);
    const [isEntryPanelOpen, setIsEntryPanelOpen] = useState(false);
    const [isDeletePanelOpen, setIsDeletePanelOpen] = useState(false);

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
                const { data, primaryKeys } = await queryTableWithPrimaryKey(selectedTable);
                setEntries(data);
                setPrimaryKeys(primaryKeys ?? '');
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

    // const handleDeleteClick = () => {
    //     if (!selectedRow) {
    //         alert("Please select a row to delete.");
    //         return;
    //     }

    //     if (hasPermission("can_delete")) {
    //         alert("DELETE REGISTERED");
    //         // Add delete logic here



    //     } else {
    //         alert("NO DELETE PERMISSIONS");
    //     }
    // };

    const openDeletePanel = () => {
        if (selectedRow == null) {
            alert("Select a row");
            return;
        }

        setIsDeletePanelOpen(true);
        alert("DELETE REGISTERED");
    };


    const openEntryPanel = (mode: 'add' | 'edit') => {
        if (mode === 'edit' && selectedRow === null) {
            alert("Please select a row to edit.");
            return;
        }

        if ((mode === 'add' && hasPermission("can_create")) || (mode === 'edit' && hasPermission("can_write"))) {
            setEditMode(mode === 'edit');
            setIsEntryPanelOpen(true);
        } else {
            alert(`NO ${mode.toUpperCase()} PERMISSION`);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col">
            <NavBar />

            <div className="flex-grow flex flex-col w-full overflow-y-auto">
                {roles === null ? (
                    <div>Loading...</div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center">
                        <div className="w-5/6 h-full flex flex-col gap-3">
                            {/* Select and add, delete, and edit buttons */}
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
                                        <ActionButton actionType="add" onClick={() => openEntryPanel('add')} />
                                    )}
                                    {hasPermission("can_write") && (
                                        <ActionButton actionType="edit" onClick={() => openEntryPanel('edit')} />
                                    )}
                                    {hasPermission("can_delete") && (
                                        <ActionButton actionType="delete" onClick={() => openDeletePanel()} />
                                    )}
                                </div>
                            </div>

                            {/* Search Input */}
                            <SearchInput query={query} setQuery={setQuery} />

                            {/* Table Component */}
                            {primaryKeys && (
                                <div className="flex-grow w-full overflow-y-auto mb-4">
                                    <TableComponent
                                        entries={filteredEntries}
                                        roles={roles}
                                        selectedRow={selectedRow}
                                        handleRowSelection={(row) => setSelectedRow(row)}
                                        primaryKeys={primaryKeys}
                                        adminView={true}
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
                )}
            </div>
        </div>
    );
}
