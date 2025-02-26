'use client'
import { useState, useEffect } from "react";
import { getRoles, getPermissions, Permission } from "@/app/supabase";
import { ActionButton} from "@/components/ui/actionButton";
import InsertComponent from "./add";
import TableComponent from "@/components/ui/TableComponent";
import TableSelectDropdown from "@/components/ui/TableSelectDropdown";
import SearchInput from "@/components/ui/SearchInput";
import { queryTableWithPrimaryKey } from '@/app/queryFunctions';


export default function AdminSearch() {
    const [query, setQuery] = useState("");
    const [entries, setEntries] = useState<Record<string, any>[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<Record<string, any>[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [isInsertOpen, setIsInsertOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [permissions, setPermissions ] = useState<Record<string, Permission[]>>({});
    const [tables, setTables] = useState<string[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [primaryKey, setPrimaryKey] = useState<string | null>(null);


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

            console.log("allPermissions", allPermissions)

            setPermissions(allPermissions);
            setTables(Array.from(viewTables));
            setSelectedTable(Array.from(viewTables)[0] || null);
            console.log("Accessible tables:", viewTables);
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
        console.log("running hasPermission");

        console.log("selectedTable", selectedTable);
        console.log("current permissions", permissions);
        
        if (!selectedTable) return false;

        return roles.some((role) =>
            permissions[role]?.some((p) => p.table_name === selectedTable && p[action])
        );
    };

    useEffect(() => {
        const keywords = query.toLowerCase().split(" ").filter(Boolean);
        setFilteredEntries(entries.filter(item =>
            keywords.every(kw =>
                Object.values(item).some(value =>
                    value !== null && value.toString().toLowerCase().includes(kw)
                )
            )
        ));
    }, [query, entries]);
    
    const handleAddClick = () => {
        if (hasPermission("can_create")) {
            setIsInsertOpen(true);
            alert("ADD REGISTERED");
            // Add addition logic here



        } else {
            alert("NO ADD PERMISSION");
        }
    };

    const handleEditClick = () => {
        if (!selectedRow) {
            alert("Please select a row to edit.");
            return;
        }
        
        if (hasPermission("can_write")) {
            alert("EDIT REGISTERED");
            // Add edit logic here

            // setIsInsertOpen(true);
            // const rowData = entries.find(entry => entry.pid === selectedRow);
            //     if (rowData) {
            //     setFormData(rowData);
            //     setEditMode(true);
            //     setIsInsertOpen(true);
            // }
        } else {
            alert("NO EDIT PERMISSION");
        }
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

    const handleCloseModal = () => {
        setIsInsertOpen(false);
        setFormData({});
    };

    
    return (
        <div className="w-full flex justify-center items-center flex-col">
            <div className="w-5/6">
                <div className="w-full flex justify-between">
                    <div className="relative w-1/6">
                    
                    <TableSelectDropdown tables={tables} selectedTable={selectedTable} setSelectedTable={setSelectedTable} />

                    </div>
                    <div className="flex flex-row gap-1">
                        <ActionButton actionType="add" onClick={handleAddClick} />
                        <ActionButton actionType="edit" onClick={handleEditClick} disabled={selectedRow === null} />
                        <ActionButton actionType="delete" onClick={handleDeleteClick}/>
                    </div>
                </div>

                <SearchInput query={query} setQuery={setQuery} />

                {selectedTable && (
                    <InsertComponent
                        selectedTable={selectedTable}
                        isOpen={isInsertOpen}
                        setIsOpen={handleCloseModal}
                        formData={formData}
                        setFormData={setFormData}
                        editMode={editMode}
                    />
                )}
                {primaryKey && (
                    <TableComponent
                        entries={filteredEntries}
                        roles={roles}
                        selectedRow={selectedRow}
                        handleRowSelection={setSelectedRow}
                        primaryKey={primaryKey}
                    />
                )}
            </div>
        </div>
    );
}
