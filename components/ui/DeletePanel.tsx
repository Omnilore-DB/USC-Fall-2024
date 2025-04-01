import { TableName } from "@/app/queryFunctions";
import { supabase } from "@/app/supabase";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
interface DeletePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTable: TableName;
  selectedRow?: Record<string, any> | null;
  primaryKeys: string[];
  reloadData: () => Promise<void>;
}

export default function DeletePanel({
  isOpen,
  onClose,
  selectedTable,
  selectedRow,
  primaryKeys,
  reloadData,
}: DeletePanelProps) {
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
          className="fixed bottom-0 left-0 top-0 z-40 w-full bg-white bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`fixed bottom-0 right-0 z-50 h-[90%] w-1/3 transform rounded-tl-xl border bg-white shadow-lg ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } duration-250 transition-transform`}
      >
        <div className="flex h-full flex-col">
          <div className="flex flex-col border-b p-4">
            <div className="flex justify-between">
              <div className="text-medium inline-block max-w-fit rounded-3xl bg-[#FFCFCF] px-4 py-1 italic">
                <span className="font-semibold">deleting </span>
                <span className="font-light">row in </span>
                <span className="font-semibold">{selectedTable}</span>
              </div>
              <button
                className="inline-block max-w-fit text-xl text-[#616161]"
                onClick={onClose}
              >
                ✖
              </button>
            </div>
          </div>
          <div
            ref={scrollContainerRef}
            className="flex h-full w-full flex-col gap-4 overflow-y-auto p-8"
          >
            <p>Are you sure you want to delete the following row?</p>
            <div className="custom-scrollbar mt-2 h-2/3 overflow-auto rounded bg-gray-100 p-2">
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(selectedRow, null, 2)}
              </pre>
            </div>
            <div className="flex w-full justify-start gap-2">
              <button
                className="text-medium inline-block max-h-fit max-w-fit rounded-lg bg-gray-100 px-3 py-1"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="text-medium inline-block max-h-fit max-w-fit rounded-lg bg-[#FFCFCF] px-3 py-1 font-semibold"
                onClick={async () => {
                  if (!selectedRow) {
                    toast.error("No row selected");
                    return;
                  }

                  const { error } = await supabase
                    .from(selectedTable)
                    .delete()
                    .match(
                      Object.fromEntries(
                        primaryKeys.map((key) => [key, selectedRow[key]]),
                      ),
                    );

                  if (error) {
                    toast.error(`Error deleting data. ${error.message}`);
                  } else {
                    toast.success("Deleted successfully.");
                    reloadData();
                    onClose();
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
