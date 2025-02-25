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
    const [selectedView, setSelectedView] = useState<View | null>(null);
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
            const accessibleTables = new Set<string>();

            for (const role of userRoles) {
                const rolePermissions = await getPermissions(role);
                allPermissions[role] = rolePermissions;

                rolePermissions.forEach((permission) => {
                    if (permission.can_read) {
                        accessibleTables.add(permission.table_name);
                    }
                });
            }

            setPermissions(allPermissions);
            setTables(Array.from(accessibleTables));
            setSelectedTable(Array.from(accessibleTables)[0] || null);
            console.log("Accessible tables:", accessibleTables);
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
        if (!selectedView) return false;

        console.log("selected view ", selectedView)

        return roles.some((role) =>
            permissions[role]?.some((p) => p.table_name === selectedView.name && p[action])
        );
    };

    useEffect(() => {
        if (!selectedView) {
          return;
        }
        const fetchEntries = async () => {
          const data = await selectedView.query_function();
          setEntries(data);
        };
        fetchEntries().catch(console.error);
      }, [selectedView]);

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

    const handleRowSelection = (pid: number) => {
        if (selectedRow !== pid) {
            setSelectedRow(pid);
        }
    };

    const handleEditClick = () => {
        if (selectedRow !== null) {
            const rowData = entries.find(entry => entry.pid === selectedRow);
            if (rowData) {
                setFormData(rowData);
                setEditMode(true);
                setIsInsertOpen(true);
            }
        }
    };


    const handleAddClick = () => {
        if (hasPermission("can_create")) {
            setIsInsertOpen(true);
        } else {
            alert("You do not have permission to create entries for this table.");
        }
    };

    const handleDeleteClick = () => {
        if (!selectedRow) {
            alert("Please select a row to delete.");
            return;
        }
    
        if (hasPermission("can_delete")) {
            console.log("Delete action initiated for row:", selectedRow);
            // Add your delete logic here, e.g., call an API to delete the entry
        } else {
            alert("You do not have permission to delete entries for this table.");
        }
    };

    
    const handleCloseModal = () => {
        setIsInsertOpen(false);
        setFormData({}); // Clear form data when the modal closes
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

                {selectedView && (
                    <InsertComponent
                        selectedView={selectedView}
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
