import { useRef } from "react";
import { Copy } from "lucide-react";

interface MemberPanelProps {
    isOpen: boolean;
    onClose: () => void;
    selectedRow: {
        id: number;
        Name: string;
        Address: string;
        "Phone Number": string;
        Email: string;
        Photo?: string;
    } | null;
}

export default function MemberPanel({ isOpen, onClose, selectedRow }: MemberPanelProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const FieldWithCopy = ({ label, value }: { label: string; value: string }) => (
        <div className="flex items-start gap-2">
            <span className="font-semibold">{label}:</span>
            <span>{value}</span>
            <button
                className="text-gray-300 hover:text-gray-500 mt-1"
                onClick={() => copyToClipboard(value)}
            >
                <Copy className="w-4 h-4" />
            </button>
        </div>
    );

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-white bg-opacity-50 z-40" onClick={onClose} />}

            <div className={`border rounded-tl-xl fixed bottom-0 right-0 h-[90%] w-1/4 bg-white shadow-lg z-50 transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-250`}>
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-4 border-b">
                        <h2 className="text-xl font-semibold">Member Details</h2>
                        <button className="text-[#616161] text-xl" onClick={onClose}>✖</button>
                    </div>

                    <div ref={scrollContainerRef} className="overflow-y-auto px-6 py-8 flex-grow custom-scrollbar">
                        {selectedRow ? (
                            <div className="space-y-4 text-medium text-[#616161]">
                                {selectedRow?.Photo && (
                                    <div className="mb-4 flex justify-center">
                                        <img
                                            src={selectedRow.Photo}
                                            alt="Member Photo"
                                            className="rounded-full w-24 h-24 object-cover shadow"
                                        />
                                    </div>
                                )}
                                <FieldWithCopy label="Name" value={selectedRow.Name} />
                                <FieldWithCopy label="Address" value={selectedRow.Address} />
                                <FieldWithCopy label="Phone Number" value={selectedRow["Phone Number"]} />
                                <FieldWithCopy label="Email" value={selectedRow.Email} />
                            </div>
                        ) : (
                            <div>No member selected.</div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 border-t p-4">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded-lg"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
