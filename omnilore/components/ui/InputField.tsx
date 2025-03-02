import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

interface ActionPanelProps {
    fieldName: string;
    fieldType: string;
    required: boolean;
    value: any;
    isArray: boolean;
    isEnum?: boolean;
    enumValues?: string[];
}

export default function InputField({ fieldName, fieldType, required, value, isArray, isEnum, enumValues }: ActionPanelProps) {
    console.log("INPUT FIELD", fieldName, fieldType, value);

    // Ensure value is an array if isArray is true and value is empty
    const normalizedValue = isArray ? (Array.isArray(value) ? value : []) : value;

    // Format array values into "[content]" format for display
    const formatArray = (arr: any[]) => `[${arr.map(v => (typeof v === "object" ? JSON.stringify(v) : v)).join(", ")}]`;

    // State for handling array values as an editable string
    const [arrayInput, setArrayInput] = useState(
        isArray ? formatArray(normalizedValue) : normalizedValue
    );

    // State to handle DatePicker input
    const [selectedDate, setSelectedDate] = useState(
        fieldType.includes("timestamp") && normalizedValue ? new Date(normalizedValue) : null
    );

    const handleChange = (date: Date) => {
        if (!date) return;
        setSelectedDate(date);
    };

    return (
        <div>
            <div className="text-medium"> 
                <span className="font-semibold text-[#616161]">{fieldName}</span>
                {required && <span className="text-red-500">*</span>}
                <span className="font-light text-[#8C8C8C]"> {fieldType}</span>
            </div>

            {(fieldType === "timestamp" || fieldType === "timestamptz") && (
                <DatePicker
                    selected={selectedDate}
                    onChange={handleChange}
                    showTimeSelect
                    dateFormat="yyyy-MM-dd HH:mm:ss.SSSSSS"
                    className="border border-gray-300 rounded p-2 w-full"
                />
            )}

            {isEnum ? (
                // Render a dropdown for ENUM values
                <select className="border border-gray-300 rounded p-2 w-full" required={required} defaultValue={normalizedValue}>
                    {enumValues?.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : isArray ? (
                // Render an input field for array values with "[content]" formatting
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

                    {(fieldType === "int2" || fieldType === "int4" || fieldType === "int8" || fieldType === "numeric" || fieldType === "float4" || fieldType === "float8") && (
                        <input 
                            type="number" 
                            className="border border-gray-300 rounded p-2 w-full"
                            required={required}
                            defaultValue={normalizedValue}
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
                            defaultValue={typeof normalizedValue === "object" ? JSON.stringify(normalizedValue) : normalizedValue}
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
