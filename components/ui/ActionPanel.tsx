import { useEffect, useState, useRef } from "react";
import InputField from "@/components/ui/InputField";
import { getTableSchema, supabase } from "@/app/supabase";
import { SupabaseProduct } from "@/app/api/cron/src/supabase/types";
import { getProducts, TableName } from "@/app/queryFunctions";
import { toast } from "sonner";

interface ActionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTable: TableName;
  mode: string;
  primaryKeys: string[];
  selectedRow?: Record<string, any>;
  reloadData: () => Promise<void>;
}

export default function ActionPanel({
  isOpen,
  onClose,
  selectedTable,
  mode,
  selectedRow,
  primaryKeys,
  reloadData,
}: ActionPanelProps) {
  const [fields, setFields] = useState<
    Map<
      string,
      {
        name: string;
        type: string;
        nullable: boolean;
        isAutoIncrement: boolean;
        isArray: boolean;
        isEnum: boolean;
        enumValues: string[];
      }
    >
  >(new Map());
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [userFormData, setUserFormData] = useState<Record<string, any>>({});
  const [products, setProducts] = useState<SupabaseProduct[]>([]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const strip_empty_fields = (obj: Record<string, any>) => {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => [
          // sets date fields to null if empty string
          key,
          value === "" && fields.get(key)?.type === "date" ? null : value,
        ]),
    );
  };

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
        setUserFormData(selectedRow);
        console.log("form data ", formData);
      } else {
        console.log("ADD MODE");
        setFormData({});
        setUserFormData({});
        console.log("form data ", formData);
      }
    } else {
      // Clear form data when panel is closing
      console.log("Panel closed, clearing form data");
      setFormData({});
      setUserFormData({});
      document.body.style.overflow = "auto";
    }
  }, [isOpen, selectedTable, mode, selectedRow]);

  useEffect(() => {
    if (isOpen) {
      getProducts().then((products) => setProducts(products));
    }
  }, [isOpen]);

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
      setFields(new Map(fieldList.map((field) => [field.name, field])));
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
            {Array.from(fields.values())
              .filter(
                (field) =>
                  field.name !== "created_at" &&
                  field.name !== "updated_at" &&
                  !(
                    field.isAutoIncrement && primaryKeys.includes(field.name)
                  ) &&
                  !["json", "jsonb"].includes(field.type),
              )
              .map(
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
                    key={`${name}-${type}-${selectedRow?.[name]}`}
                    fieldName={name}
                    fieldType={type}
                    required={!nullable}
                    value={formData[name]}
                    isAutoIncrement={isAutoIncrement}
                    isArray={isArray}
                    isEnum={isEnum}
                    isSKU={["sku", "skus"].includes(name)}
                    products={products}
                    setFormValue={setUserFormData}
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
                onClick={async () => {
                  console.log("form data", { ...formData, ...userFormData });

                  if (mode === "add") {
                    const { error } = await supabase
                      .from(selectedTable)
                      .insert(strip_empty_fields(userFormData));

                    if (error) {
                      toast.error(`Error inserting data. ${error.message}`);
                    } else {
                      toast.success("Inserted successfully.");
                      reloadData();
                      onClose();
                    }
                  }

                  if (mode === "edit") {
                    const { error } = await supabase
                      .from(selectedTable)
                      .update(
                        strip_empty_fields({ ...formData, ...userFormData }),
                      )
                      .match(
                        Object.fromEntries(
                          primaryKeys.map((key) => [key, formData[key]]),
                        ),
                      );

                    if (error) {
                      toast.error(`Error updating data. ${error.message}`);
                    } else {
                      toast.success("Updated successfully.");
                      reloadData();
                      onClose();
                    }
                  }
                }}
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
