"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, X } from "lucide-react";

interface MultiSelectDropdownProps {
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: (values: string[]) => void;
  placeholder?: string;
}

const MultiSelectDropdown = ({
  options,
  selectedOptions,
  setSelectedOptions,
  placeholder = "Select options",
}: MultiSelectDropdownProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionToggle = (value: string) => {
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((opt) => opt !== value));
    } else {
      const sortedSelected = [...selectedOptions, value].sort(
        (a, b) => options.indexOf(a) - options.indexOf(b),
      );
      setSelectedOptions(sortedSelected);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div
        className="border-1 group flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border-gray-200 bg-white px-2 py-0 font-semibold text-gray-800 shadow-xs transition focus:outline-hidden"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="invisible-scrollbar flex items-center gap-1 overflow-x-auto whitespace-nowrap">
          {selectedOptions.length > 0 ? (
            <div className="flex gap-1">
              {selectedOptions.map((option) => (
                <div
                  key={option}
                  className="flex items-center whitespace-nowrap rounded-full bg-blue-200 px-2 py-0.5 text-sm text-blue-800"
                >
                  {option}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOptionToggle(option);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
      </div>
      {open && (
        <div className="absolute left-0 top-12 z-30 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="max-h-60 overflow-y-auto p-1">
            {options.length > 0 ? (
              options.map((option) => (
                <label
                  key={option}
                  className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 ${
                    selectedOptions.includes(option) ? "bg-gray-200" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionToggle(option)}
                    className="form-checkbox text-green-600"
                  />
                  {option}
                  {selectedOptions.includes(option) && (
                    <Check className="ml-auto h-4 w-4 text-green-600" />
                  )}
                </label>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-400">
                No options available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
