'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTableSchema, upsertTableEntry } from "@/app/supabase";

interface InsertComponentProps {
  selectedTable: string | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
  editMode: boolean;
}

export default function InsertComponent({ selectedTable, isOpen, setIsOpen, formData, setFormData, editMode }: InsertComponentProps) {
  const [schema, setSchema] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchSchema = async () => {
      if (selectedTable) {
        try {
          const tableSchema = await getTableSchema(selectedTable);
          setSchema(tableSchema);
        } catch (error: any) {
          console.error("Failed to fetch schema for table:", selectedTable, error);
          toast.error("Failed to fetch table schema.");
        }
      }
    };

    fetchSchema().catch(console.error);
  }, [selectedTable]);

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedTable) {
      toast.error("No table selected");
      return;
    }

    try {
      if (editMode) {
        await upsertTableEntry(selectedTable, formData); // Assume upsert handles updates
        toast.success("Entry updated successfully");
      } else {
        const { pid, ...newEntry } = formData; // Remove PID if it's a new entry
        await upsertTableEntry(selectedTable, newEntry);
        toast.success("Data inserted successfully");
      }

      setIsOpen(false);
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData({}); // Clear form data when the modal is closed
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] flex flex-col">
            <h2 className="text-lg font-bold mb-4">{editMode ? "Edit Entry" : "Add New Entry"}</h2>
            <div className="overflow-y-auto flex-1 px-2" style={{ maxHeight: "60vh" }}>
              {Object.keys(schema?.columns || {})
                .filter(column => column.toLowerCase() !== "pid")
                .map(column => (
                  <div key={column} className="flex flex-col mb-2">
                    <label className="text-sm font-medium text-gray-700">{column}</label>
                    <input
                      type="text"
                      value={formData[column] || ""}
                      onChange={(e) => handleInputChange(column, e.target.value)}
                      className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                    />
                  </div>
                ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Submit</Button>
              <Button onClick={() => setIsOpen(false)} className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
