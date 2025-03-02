import { useEffect, useState } from "react";
import InputField from "@/components/ui/InputField";
import { getTableSchema } from "@/app/supabase";

interface ActionPanelProps {
    isOpen: boolean;
    onClose: () => void;
    selectedTable: string;
    mode: string;
}

export default function ActionPanel({ isOpen, onClose, selectedTable, mode }: ActionPanelProps) {
    const [fields, setFields] = useState<{ name: string; type: string; nullable: boolean; }[]>([]);

    useEffect(() => {
        if (isOpen && selectedTable) {
            fetchSchema();
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isOpen, selectedTable]);

    const fetchSchema = async () => {
        const schema = await getTableSchema(selectedTable);
        if (schema?.columns) {
            const fieldList = Object.entries(schema.columns).map(([name, details]: any) => ({
                name,
                type: details.type,
                nullable: details.nullable,
            }));
            setFields(fieldList);
        }
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-white bg-opacity-50 transition-opacity z-40"
                    onClick={onClose} // Close when clicking outside
                ></div>
            )}

            <div
                className={` border rounded-xl fixed bottom-0 right-0 h-[90%] w-1/3 bg-white shadow-lg z-50 transform ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-250`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-4 flex flex-col border-b">
                        <div className="flex justify-between">
                            {mode === 'add' ? 
                                <div className="inline-block max-w-fit text-medium px-4 py-1 bg-[#C9FFAE] rounded-3xl italic"> 
                                    <span className="font-semibold">adding </span>
                                    <span className="font-light">new row to </span>
                                    <span className="font-semibold">{selectedTable}</span>
                                </div>
                            :
                                <div className="inline-block max-w-fit text-medium px-4 py-1 bg-[#E5E7EB] rounded-3xl italic"> 
                                    <span className="font-semibold">editing </span>
                                    <span className="font-light">row in </span>
                                    <span className="font-semibold">{selectedTable}</span>
                                </div>
                            }
                            
                            <button className="inline-block max-w-fit text-xl text-[#616161]" onClick={onClose}>✖</button>
                        </div>

                    </div>

                    <div className="p-8 flex flex-col w-full h-full">
                            {fields.map(({ name, type, nullable }) => (
                            <InputField key={name} fieldName={name} fieldType={type} required={!nullable} value={""} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
