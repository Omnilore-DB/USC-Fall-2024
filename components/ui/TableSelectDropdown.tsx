"use client";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";

interface TableSelectDropdownProps {
  tables: string[];
  selectedTable: string | null;
  setSelectedTable: (value: string) => void;
}

const TableSelectDropdown = ({
  tables,
  selectedTable,
  setSelectedTable,
}: TableSelectDropdownProps) => {
  return (
    <Select.Root value={selectedTable || ""} onValueChange={setSelectedTable}>
      <Select.Trigger className="flex items-center justify-between border-1 border-gray-200 bg-gray-100 px-3 py-1 rounded-lg w-full shadow-sm text-gray-800 font-semibold group focus:outline-none focus:ring-0 data-[state=open]:border-transparent transition">
        <Select.Value placeholder="Select a view" />
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </Select.Trigger>
      <Select.Content
        position="popper"
        className="border border-gray-200 bg-white rounded-lg shadow-lg w-full mt-1 z-30"
      >
        <Select.Viewport className="p-1">
          {tables.length > 0 ? (
            tables.map((table) => (
              <Select.Item
                key={table}
                value={table}
                className="flex items-center justify-between px-4 py-2 cursor-pointer rounded-md font-semibold text-gray-700 hover:bg-gray-100 focus:bg-gray-100 border-none outline-none"
              >
                <Select.ItemText>{table}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check className="w-4 h-4" />
                </Select.ItemIndicator>
              </Select.Item>
            ))
          ) : (
            <Select.Item
              value="no-value"
              disabled
              className="text-gray-400 px-3 py-2"
            >
              No views available
            </Select.Item>
          )}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  );
};

export default TableSelectDropdown;
