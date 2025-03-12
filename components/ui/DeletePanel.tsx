import { useEffect, useRef } from "react";

interface DeletePanelProps {
    isOpen: boolean;
    onClose: () => void;
    selectedTable: string;
    selectedRow?: Record<string, any> | null;
    onDelete: () => void;
}

export default function DeletePanel({ isOpen, onClose, selectedTable, selectedRow, onDelete }: DeletePanelProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0;
            }
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isOpen]);

    return (
        <>
            {isOpen && (
                <div
                    className="fixed top-0 left-0 bottom-0 w-full bg-white bg-opacity-50 transition-opacity z-40"
                    onClick={onClose}
                ></div>
            )}
            <div
                className={`border rounded-tl-xl fixed bottom-0 right-0 h-[90%] w-1/3 bg-white shadow-lg z-50 transform ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-250`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-4 flex flex-col border-b">
                        <div className="flex justify-between">
                            <div className="inline-block max-w-fit text-medium px-4 py-1 bg-[#FFCFCF] rounded-3xl italic">
                                <span className="font-semibold">deleting </span>
                                <span className="font-light">row in </span>
                                <span className="font-semibold">{selectedTable}</span>
                            </div>
                            <button className="inline-block max-w-fit text-xl text-[#616161]" onClick={onClose}>✖</button>
                        </div>
                    </div>
                    <div ref={scrollContainerRef} className="flex flex-col w-full h-full gap-4 overflow-y-auto p-8 ">
                        <p>Are you sure you want to delete the following row?</p>
                        <div className="bg-gray-100 p-2 rounded mt-2 overflow-auto h-2/3 custom-scrollbar">
                        <pre className="whitespace-pre-wrap break-words">
                            {JSON.stringify(selectedRow, null, 2)}
                        </pre>
                        </div>
                        <div className="w-full flex justify-start gap-2">
                            <button className="inline-block max-w-fit max-h-fit text-medium rounded-lg px-3 py-1 bg-gray-100" onClick={onClose}>Cancel</button>
                            <button className="inline-block max-w-fit max-h-fit text-medium font-semibold rounded-lg px-3 py-1 bg-[#FFCFCF]" onClick={onDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
