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
      <Select.Trigger className="border-1 group flex w-full items-center justify-between rounded-lg border-gray-200 bg-gray-100 px-3 py-1 font-semibold text-gray-800 shadow-sm transition focus:outline-none focus:ring-0 data-[state=open]:border-transparent">
        <Select.Value placeholder="Select a view" />
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </Select.Trigger>
      <Select.Content
        position="popper"
        className="z-30 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
      >
        <Select.Viewport className="p-1">
          {tables.length > 0 ? (
            tables.map((table) => (
              <Select.Item
                key={table}
                value={table}
                className="flex cursor-pointer items-center justify-between rounded-md border-none px-4 py-2 font-semibold text-gray-700 outline-none hover:bg-gray-100 focus:bg-gray-100"
              >
                <Select.ItemText>{table}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check className="h-4 w-4" />
                </Select.ItemIndicator>
              </Select.Item>
            ))
          ) : (
            <Select.Item
              value="no-value"
              disabled
              className="px-3 py-2 text-gray-400"
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
