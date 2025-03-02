import { useEffect } from "react";

interface ActionPanelProps {
    fieldName: string;
    fieldType: string;
    required: boolean;
    value: string;
}

export default function InputField({ fieldName, fieldType, required, value }: ActionPanelProps) {

    useEffect(() =>{
        console.log("nullable ", required);
    })
    
    return (
        <div>
            <div className="text-medium"> 
                <span className="font-semibold text-[#616161]">{fieldName}</span>
                {required && <span className="text-red-500">*</span>}
                <span className="font-light text-[#8C8C8C]"> {fieldType}</span>
            </div>

            {(fieldType === "text" || fieldType === "varchar") && (
                <input 
                    type="text" 
                    className="border border-gray-300 rounded p-2 w-full"
                    required={required}
                    defaultValue={value}
                />
            )}

            {(fieldType === "int2" || fieldType === "int4" || fieldType === "int8" || fieldType === "numeric" || fieldType === "float4" || fieldType === "float8") && (
                <input 
                    type="number" 
                    className="border border-gray-300 rounded p-2 w-full"
                    required={required}
                    defaultValue={value}
                />
            )}

            {fieldType === "bool" && (
                <input 
                    type="checkbox" 
                    className="border border-gray-300 rounded p-2"
                    required={required}
                    defaultChecked={value === "true"}
                />
            )}

            {(fieldType === "date" || fieldType === "timestamp" || fieldType === "timestamptz") && (
                <input 
                    type="datetime-local" 
                    className="border border-gray-300 rounded p-2 w-full"
                    required={required}
                    defaultValue={value}
                />
            )}

            {fieldType === "time" && (
                <input 
                    type="time" 
                    className="border border-gray-300 rounded p-2 w-full"
                    required={required}
                    defaultValue={value}
                />
            )}

            {fieldType === "uuid" && (
                <input 
                    type="text" 
                    className="border border-gray-300 rounded p-2 w-full"
                    required={required}
                    defaultValue={value}
                    readOnly
                />
            )}

            {fieldType === "json" || fieldType === "jsonb" && (
                <textarea 
                    className="border border-gray-300 rounded p-2 w-full"
                    required={required}
                    defaultValue={value}
                    rows={4}
                />
            )}

            {fieldType === "bytea" && (
                <input 
                    type="file" 
                    className="border border-gray-300 rounded p-2 w-full"
                    required={required}
                />
            )}

        </div>
    );
}
