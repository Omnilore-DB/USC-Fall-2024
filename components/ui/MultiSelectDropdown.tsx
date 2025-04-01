"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

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
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
        className="border-1 group flex w-full items-center justify-between rounded-lg border-gray-200 bg-gray-100 px-3 py-1 font-semibold text-gray-800 shadow-sm transition focus:outline-none cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>
          {selectedOptions.length > 0 ? selectedOptions.join(", ") : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </div>
      {open && (
        <div className="absolute top-12 left-0 z-30 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="p-1">
            {options.length > 0 ? (
              options.map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-2 cursor-pointer rounded-md px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 ${
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
                    <Check className="h-4 w-4 text-green-600 ml-auto" />
                  )}
                </label>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-400">No options available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
