import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MultiSelect } from "./multi-select";
import { SupabaseProduct } from "@/app/api/cron/src/supabase/types";

interface InputFieldProps {
  fieldName: string;
  fieldType: string;
  required: boolean;
  isAutoIncrement: boolean;
  value: any;
  isArray: boolean;
  isEnum?: boolean;
  isSKU?: boolean;
  products?: SupabaseProduct[];
  // setFormValue: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setFormValue: (name: string, value: any) => void;
  enumValues?: string[];
  mode: string;
  displayLabel?: boolean;
  onEnter?: () => void;
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
  displayLabel = true,
  onEnter,
}: InputFieldProps) {

  // Determine the normalized value
  const normalizedValue = isArray ? (Array.isArray(value) ? value : []) : value;

  function parseDate(value: any): Date | null {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  

  function getInitialValueByType(type: string) {
    if (type === "bool") return false;
    if (type === "date" || type.includes("timestamp")) return new Date();
    if (type.startsWith("int") || type.startsWith("float") || type === "numeric") return "";
    if (type === "json" || type === "jsonb") return "";
    if (type === "text" || type === "varchar" || type === "uuid") return "";
    if (type === "array") return [];
    return "";
  }

  const initialValue =
    value === null || value === undefined || value === ""
      ? getInitialValueByType(fieldType)
      : value;
  
  const [currentValue, setCurrentValue] = useState(initialValue);

  useEffect(() => {
    if (mode === "add") {
      if (isEnum) {
        setCurrentValue(enumValues?.[0]);
      } else if (isArray) {
        setCurrentValue([]);
      } else if (
        fieldType === "timestamp" ||
        fieldType === "timestamptz" ||
        fieldType === "date"
      ) {
        setCurrentValue(new Date());
      }
    } else {
      if (
        (fieldType.includes("timestamp") ||
          fieldType.includes("timestampz") ||
          fieldType === "date") &&
        value
      ) {
        if (value instanceof Date && !isNaN(value.getTime())) {
          setCurrentValue(value);
        } else {
          const parsed = parseDate(value);
          setCurrentValue(parsed);
        }
      } else {
        setCurrentValue(normalizedValue);
      }
    }
  }, [mode, value]);
  

  return (
    <div>
      {displayLabel && (
        <div className="text-medium">
          <span className="font-semibold text-[#616161]">{fieldName}</span>
          {required && <span className="text-red-500">*</span>}
          <span className="font-light text-[#8C8C8C]"> {fieldType}</span>
        </div>
      )}

      {/* Timestamp (with time) */}
      {(fieldType === "timestamp" || fieldType === "timestamptz") && (
        <DatePicker
          wrapperClassName="w-full"
          className="w-full rounded border border-gray-300 p-2"
          selected={currentValue}
          onChange={(date) => {
            setCurrentValue(date);
            setFormValue(fieldName, date);
          }}
          showTimeSelect
          dateFormat="yyyy-MM-dd HH:mm:ss.SSSSSS"
        />
      )}

      {/* Date (no time) */}
      {fieldType === "date" && (
        <DatePicker
          wrapperClassName="w-full"
          className="w-full rounded border border-gray-300 p-2"
          selected={currentValue}
          onChange={(date) => {
            setCurrentValue(date);
            setFormValue(fieldName, date);
          }}
          dateFormat="yyyy-MM-dd"
        />
      )}

      {isEnum ? (
        <select
          className="w-full rounded border border-gray-300 p-2"
          required={required}
          value={currentValue}
          onChange={(e) => {
            setCurrentValue(e.target.value);
            setFormValue(fieldName, e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && typeof onEnter === "function") onEnter();
          }}
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
            setCurrentValue(value);
            setFormValue(fieldName, value);
          }}
          defaultValue={currentValue}
        />
      ) : isArray ? (
        <input
          type="text"
          className="w-full rounded border border-gray-300 p-2"
          required={required}
          value={currentValue}
          onChange={(e) => {
            setCurrentValue(e.target.value);
            setFormValue(fieldName, e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && typeof onEnter === "function") onEnter();
          }}
        />
      ) : (
        <>
          {(fieldType === "text" || fieldType === "varchar") && (
            <input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              required={required}
              value={currentValue}
              onChange={(e) => {
                setCurrentValue(e.target.value);
                setFormValue(fieldName, e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && typeof onEnter === "function") onEnter();
              }}
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
              value={currentValue}
              placeholder={isAutoIncrement ? "automatically generated" : ""}
              onChange={(e) => {
                setCurrentValue(e.target.value);
                setFormValue(fieldName, e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && typeof onEnter === "function") onEnter();
              }}
            />
          )}

          {fieldType === "bool" && (
            <input
              type="checkbox"
              className="rounded border border-gray-300 p-2"
              required={required}
              checked={!!currentValue}
              onChange={(e) => {
                setCurrentValue(e.target.checked);
                setFormValue(fieldName, e.target.checked);
              }}
            />
          )}

          {fieldType === "uuid" && (
            <input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              required={required}
              value={normalizedValue ?? ""}
              readOnly
            />
          )}

          {(fieldType === "json" || fieldType === "jsonb") && (
            <input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              required={required}
              value={
                typeof normalizedValue === "object"
                  ? JSON.stringify(normalizedValue)
                  : (normalizedValue ?? "")
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
