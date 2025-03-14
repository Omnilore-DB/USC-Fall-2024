import { useEffect, useState, useRef } from "react";
import InputField from "@/components/ui/InputField";
import { getTableSchema } from "@/app/supabase";

interface ActionPanelProps {
    isOpen: boolean;
    onClose: () => void;
    selectedTable: string;
    mode: string;
    selectedRow?: Record<string, any>;
    primaryKeys?: string[];
}

export default function ActionPanel({ isOpen, onClose, selectedTable, mode, selectedRow }: ActionPanelProps) {
    const [fields, setFields] = useState<{ name: string; type: string; nullable: boolean; isAutoIncrement: boolean; isArray: boolean; isEnum: boolean; enumValues: string[] }[]>([]);
    const [formData, setFormData] = useState<Record<string, any>>({});

    const scrollContainerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (isOpen) {
            fetchSchema();
            document.body.style.overflow = "hidden";
    
            // Scroll to top when panel opens
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0;
            }
    
            // Set form data only when opening the panel
            if (mode === "edit" && selectedRow) {
                console.log("EDIT MODE");
                setFormData(selectedRow);
                console.log("form data ", formData);
            } else {
                console.log("ADD MODE");
                setFormData({});
                setFields([]);
                console.log("form data ", formData);
            }
    
        } else {
            // Clear form data when panel is closing
            console.log("Panel closed, clearing form data");
            setFormData({});
            document.body.style.overflow = "auto";
        }
    }, [isOpen, selectedTable, mode, selectedRow]);
    
    


    const fetchSchema = async () => {
        const schema = await getTableSchema(selectedTable);
        if (schema?.columns) {
            const fieldList = Object.entries(schema.columns).map(([name, details]: any) => ({
                name,
                type: details.type,
                nullable: details.nullable,
                isAutoIncrement: details.isAutoIncrement,
                isArray: details.isArray,
                isEnum: details.isEnum,
                enumValues: details.enumValues || [],
            }));
            setFields(fieldList);
        }
    };
    

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-white bg-opacity-50 transition-opacity z-40"
                    onClick={onClose}
                ></div>
            )}

            <div
                className={` border rounded-tl-xl fixed bottom-0 right-0 h-[90%] w-1/3 bg-white shadow-lg z-50 transform ${
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

                    <div ref={scrollContainerRef} className="flex flex-col w-full h-full gap-8 overflow-y-auto overflow-hidden custom-scrollbar p-8">
                        {fields.map(({ name, type, nullable, isAutoIncrement, isArray, isEnum, enumValues }) => (
                                <InputField 
                                    key={name} 
                                    fieldName={name} 
                                    fieldType={type} 
                                    required={!nullable} 
                                    value={formData[name]} 
                                    isAutoIncrement={isAutoIncrement}
                                    isArray={isArray} 
                                    isEnum={isEnum}
                                    enumValues={enumValues}
                                    mode={mode}
                                />
                            ))}
                        <div className="w-full flex justify-start gap-2">
                            
                            <button className="inline-block max-w-fit max-h-fit text-medium rounded-lg px-3 py-1 bg-gray-100 items-center justify-center" onClick={onClose}>Cancel</button>
                            
                            <button className={`inline-block max-w-fit max-h-fit text-medium font-semibold rounded-lg px-3 py-1 ${mode === "add" ? "bg-[#C9FFAE]" : "bg-[#E5E7EB] "} items-center justify-center`}>Save</button>
                        
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
