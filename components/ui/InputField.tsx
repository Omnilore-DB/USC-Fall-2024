import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

interface ActionPanelProps {
  fieldName: string;
  fieldType: string;
  required: boolean;
  isAutoIncrement: boolean;
  value: any;
  isArray: boolean;
  isEnum?: boolean;
  enumValues?: string[];
  mode: string;
}

export default function InputField({
  fieldName,
  fieldType,
  required,
  isAutoIncrement,
  value,
  isArray,
  isEnum,
  enumValues,
  mode,
}: ActionPanelProps) {
  const [arrayInput, setArrayInput] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Format array elements for display
  const formatArray = (arr: any[]) =>
    `[${arr
      .map((v) => (typeof v === "object" ? JSON.stringify(v) : v))
      .join(", ")}]`;

  // Determine the normalized value
  const normalizedValue = isArray
    ? Array.isArray(value)
      ? value
      : []
    : value;

  // Handle date change from DatePicker
  const handleChange = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
  };

  useEffect(() => {
    if (mode === "add") {
        if (isArray) {
          setArrayInput("[]");
        } else if (fieldType === "timestamp" || fieldType === "timestamptz" || fieldType === "date") {
          setSelectedDate(new Date());
        } else {
          setArrayInput("");
          setSelectedDate(null);
        }
    } else {
      // On edit mode
      setArrayInput(isArray ? formatArray(normalizedValue) : normalizedValue);

      // If there's a timestamp/date in value, parse it
      if (
        (fieldType.includes("timestamp") ||
          fieldType.includes("timestampz") ||
          fieldType === "date") &&
        value
      ) {
        setSelectedDate(new Date(value));
      }
    }
  }, [mode, value]);

  return (
    <div>
      <div className="text-medium">
        <span className="font-semibold text-[#616161]">{fieldName}</span>
        {required && <span className="text-red-500">*</span>}
        <span className="font-light text-[#8C8C8C]"> {fieldType}</span>
      </div>

      {/* Timestamp (with time) */}
      {(fieldType === "timestamp" || fieldType === "timestamptz") && (
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          showTimeSelect
          dateFormat="yyyy-MM-dd HH:mm:ss.SSSSSS"
          className="border border-gray-300 rounded p-2 w-full"
        />
      )}

      {/* Date (no time) */}
      {fieldType === "date" && (
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          dateFormat="yyyy-MM-dd"
          className="border border-gray-300 rounded p-2 w-full"
        />
      )}

      {isEnum ? (
        <select
          className="border border-gray-300 rounded p-2 w-full"
          required={required}
          defaultValue={normalizedValue}
        >
          {enumValues?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : isArray ? (
        <input
          type="text"
          className="border border-gray-300 rounded p-2 w-full"
          required={required}
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
        />
      ) : (
        <>
          {(fieldType === "text" || fieldType === "varchar") && (
            <input
              type="text"
              className="border border-gray-300 rounded p-2 w-full"
              required={required}
              defaultValue={normalizedValue}
            />
          )}

          {(fieldType === "int2" ||
            fieldType === "int4" ||
            fieldType === "int8" ||
            fieldType === "numeric" ||
            fieldType === "float4" ||
            fieldType === "float8") && (
            <input
              type="number"
              className="border border-gray-300 rounded p-2 w-full"
              required={required}
              defaultValue={normalizedValue ?? 0}
              placeholder={isAutoIncrement ? "automatically generated" : ""}

            />
          )}

          {fieldType === "bool" && (
            <input
              type="checkbox"
              className="border border-gray-300 rounded p-2"
              required={required}
              defaultChecked={normalizedValue === "true"}
            />
          )}

          {fieldType === "uuid" && (
            <input
              type="text"
              className="border border-gray-300 rounded p-2 w-full"
              required={required}
              defaultValue={normalizedValue}
              readOnly
            />
          )}

          {(fieldType === "json" || fieldType === "jsonb") && (
            <input
              type="text"
              className="border border-gray-300 rounded p-2 w-full"
              required={required}
              defaultValue={
                typeof normalizedValue === "object"
                  ? JSON.stringify(normalizedValue)
                  : normalizedValue
              }
            />
          )}

          {fieldType === "bytea" && (
            <input
              type="file"
              className="border border-gray-300 rounded p-2 w-full"
              required={required}
            />
          )}
        </>
      )}
    </div>
  );
}
