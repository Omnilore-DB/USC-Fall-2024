'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRoles, getPermissions, Permission } from "@/app/supabase";
import { getAccessibleViews, View } from "@/app/schemas/schema";
import { memberViews } from "@/app/schemas/members";
import { allViews } from "@/app/schemas";
import TableComponent from "@/components/ui/TableComponent";
import TableSelectDropdown from "@/components/ui/TableSelectDropdown";
import SearchInput from "@/components/ui/SearchInput";
import ModalComponent from "@/components/ui/ModalComponent";

export default function AdminSearch() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [entries, setEntries] = useState<Record<string, any>[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<Record<string, any>[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [permissions, setPermissions] = useState<Record<string, Permission[]>>({});
    const [tables, setTables] = useState<string[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [isInsertOpen, setIsInsertOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<Record<string, any>>({});

    useEffect(() => {
        if (!selectedTable) return;

        const fetchEntries = async () => {
            try {
                const response = await fetch(`/api/data?table=${selectedTable}`);
                const data = await response.json();
                setEntries(data || []);
            } catch (error) {
                console.error("Failed to fetch data for table", selectedTable, error);
            }
        };

        fetchEntries();
    }, [selectedTable]);

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

    return (
        <div className="w-full flex justify-center items-center flex-col">
            <TableSelectDropdown tables={tables} selectedTable={selectedTable} setSelectedTable={setSelectedTable} />
            <ActionButtons
                handleAddClick={() => setIsInsertOpen(true)}
                handleEditClick={() => setEditMode(true)}
                handleDeleteClick={() => console.log("Delete action")}
                isEditDisabled={selectedRow === null}
            />
            <SearchInput query={query} setQuery={setQuery} />
            <TableComponent
                entries={filteredEntries}
                roles={roles}
                selectedRow={selectedRow}
                handleRowSelection={setSelectedRow}
            />
            <ModalComponent
                isOpen={isInsertOpen}
                handleClose={() => setIsInsertOpen(false)}
                formData={formData}
                setFormData={setFormData}
                editMode={editMode}
            />
        </div>
    );
}
