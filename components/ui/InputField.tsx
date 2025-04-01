import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { MultiSelect } from "./multi-select";
import { getProducts } from "@/app/queryFunctions";
import { SupabaseProduct } from "@/app/api/cron/src/supabase/types";

interface ActionPanelProps {
  fieldName: string;
  fieldType: string;
  required: boolean;
  isAutoIncrement: boolean;
  value: any;
  isArray: boolean;
  isEnum?: boolean;
  isSKU?: boolean;
  products?: SupabaseProduct[];
  setFormValue: React.Dispatch<React.SetStateAction<Record<string, any>>>;
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
  isSKU,
  products,
  enumValues,
  setFormValue,
  mode,
}: ActionPanelProps) {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    if (currentValue === value) {
      setFormValue((obj) => {
        const newObj = { ...obj };
        delete newObj[fieldName];
        return newObj;
      });
    } else setFormValue((obj) => ({ ...obj, [fieldName]: currentValue }));
  }, [currentValue]);

  // Format array elements for display
  const formatArray = (arr: any[]) =>
    `[${arr
      .map((v) => (typeof v === "object" ? JSON.stringify(v) : v))
      .join(", ")}]`;

  // Determine the normalized value
  const normalizedValue = isArray ? (Array.isArray(value) ? value : []) : value;

  // Handle date change from DatePicker
  const handleChange = (date: Date | null) => {
    if (!date) return;
    setCurrentValue(date);
  };

  useEffect(() => {
    if (mode === "add") {
      if (isArray) {
        setCurrentValue("[]");
      } else if (
        fieldType === "timestamp" ||
        fieldType === "timestamptz" ||
        fieldType === "date"
      ) {
        setCurrentValue(new Date());
      }
    } else {
      // On edit mode
      setCurrentValue(isArray ? formatArray(normalizedValue) : normalizedValue);

      // If there's a timestamp/date in value, parse it
      if (
        (fieldType.includes("timestamp") ||
          fieldType.includes("timestampz") ||
          fieldType === "date") &&
        value
      ) {
        setCurrentValue(new Date(value));
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
          selected={currentValue}
          onChange={handleChange}
          showTimeSelect
          dateFormat="yyyy-MM-dd HH:mm:ss.SSSSSS"
          className="w-full rounded border border-gray-300 p-2"
        />
      )}

      {/* Date (no time) */}
      {fieldType === "date" && (
        <DatePicker
          selected={currentValue}
          onChange={handleChange}
          dateFormat="yyyy-MM-dd"
          className="w-full rounded border border-gray-300 p-2"
        />
      )}

      {isEnum ? (
        <select
          className="w-full rounded border border-gray-300 p-2"
          required={required}
          defaultValue={normalizedValue}
          onChange={(e) => setCurrentValue(e.target.value)}
        >
          {enumValues?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : isSKU && isArray ? (
        <MultiSelect
          options={
            products?.map((option) => ({
              value: option.sku,
              label: `${option.sku} - ${option.descriptor}`,
            })) ?? []
          }
          placeholder="Select sku(s)..."
          onValueChange={(value) => {
            setCurrentValue(`[${value.join(",")}]`);
          }}
          value={currentValue}
        />
      ) : isArray ? (
        <input
          type="text"
          className="w-full rounded border border-gray-300 p-2"
          required={required}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
        />
      ) : (
        <>
          {(fieldType === "text" || fieldType === "varchar") && (
            <input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              required={required}
              defaultValue={normalizedValue}
              onChange={(e) => setCurrentValue(e.target.value)}
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
              className="w-full rounded border border-gray-300 p-2"
              required={required}
              // defaultValue={normalizedValue ?? 0} not good to default to 0 always
              placeholder={isAutoIncrement ? "automatically generated" : ""}
              onChange={(e) => setCurrentValue(e.target.value)}
            />
          )}

          {fieldType === "bool" && (
            <input
              type="checkbox"
              className="rounded border border-gray-300 p-2"
              required={required}
              defaultChecked={normalizedValue === "true"}
              onChange={(e) => setCurrentValue(e.target.value)}
            />
          )}

          {fieldType === "uuid" && (
            <input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              required={required}
              defaultValue={normalizedValue}
              readOnly
            />
          )}

          {(fieldType === "json" || fieldType === "jsonb") && (
            <input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              required={required}
              defaultValue={
                typeof normalizedValue === "object"
                  ? JSON.stringify(normalizedValue)
                  : normalizedValue
              }
              readOnly
            />
          )}

          {fieldType === "bytea" && (
            <p className="text-red-500">We do not support bytea fields</p>
          )}
        </>
      )}
    </div>
  );
}
