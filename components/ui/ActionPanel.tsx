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

export default function ActionPanel({
  isOpen,
  onClose,
  selectedTable,
  mode,
  selectedRow,
}: ActionPanelProps) {
  const [fields, setFields] = useState<
    {
      name: string;
      type: string;
      nullable: boolean;
      isAutoIncrement: boolean;
      isArray: boolean;
      isEnum: boolean;
      enumValues: string[];
    }[]
  >([]);
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
      const fieldList = Object.entries(schema.columns).map(
        ([name, details]: any) => ({
          name,
          type: details.type,
          nullable: details.nullable,
          isAutoIncrement: details.isAutoIncrement,
          isArray: details.isArray,
          isEnum: details.isEnum,
          enumValues: details.enumValues || [],
        }),
      );
      setFields(fieldList);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-white bg-opacity-50 transition-opacity"
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
              {mode === "add" ? (
                <div className="text-medium inline-block max-w-fit rounded-3xl bg-[#C9FFAE] px-4 py-1 italic">
                  <span className="font-semibold">adding </span>
                  <span className="font-light">new row to </span>
                  <span className="font-semibold">{selectedTable}</span>
                </div>
              ) : (
                <div className="text-medium inline-block max-w-fit rounded-3xl bg-[#E5E7EB] px-4 py-1 italic">
                  <span className="font-semibold">editing </span>
                  <span className="font-light">row in </span>
                  <span className="font-semibold">{selectedTable}</span>
                </div>
              )}

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
            className="custom-scrollbar flex h-full w-full flex-col gap-8 overflow-hidden overflow-y-auto p-8"
          >
            {fields.map(
              ({
                name,
                type,
                nullable,
                isAutoIncrement,
                isArray,
                isEnum,
                enumValues,
              }) => (
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
              ),
            )}
            <div className="flex w-full justify-start gap-2">
              <button
                className="text-medium inline-block max-h-fit max-w-fit items-center justify-center rounded-lg bg-gray-100 px-3 py-1"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                className={`text-medium inline-block max-h-fit max-w-fit rounded-lg px-3 py-1 font-semibold ${mode === "add" ? "bg-[#C9FFAE]" : "bg-[#E5E7EB]"} items-center justify-center`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
