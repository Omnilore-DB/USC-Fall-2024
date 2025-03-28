"use client";

import { useEffect, useRef, useState } from "react";
import { getRowById } from "@/app/supabase";

interface ResolveConflictPanelProps {
  isOpen: boolean;
  onClose: () => void;
  firstMemberId: number;
  secondMemberId: number;
}

export default function ResolveConflictPanel({
  isOpen,
  onClose,
  firstMemberId,
  secondMemberId,
}: ResolveConflictPanelProps) {
  const [member1, setMember1] = useState<Record<string, any> | null>(null);
  const [member2, setMember2] = useState<Record<string, any> | null>(null);
  const [resolvedValues, setResolvedValues] = useState<Record<string, string>>(
    {},
  );
  const [customFields, setCustomFields] = useState<Record<string, boolean>>({});
  const [resolvedFields, setResolvedFields] = useState<Record<string, boolean>>(
    {},
  );
  const [openFields, setOpenFields] = useState<Record<string, boolean>>({});
  const [mergeView, setMergeView] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mergeView && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [mergeView]);

  useEffect(() => {
    const fetchMembers = async () => {
      const data1 = await getRowById("members", firstMemberId);
      const data2 = await getRowById("members", secondMemberId);
      setMember1(data1);
      setMember2(data2);

      const defaultResolved: Record<string, string> = {};
      const defaultResolvedFields: Record<string, boolean> = {};
      const defaultOpenFields: Record<string, boolean> = {};

      Object.keys(data1 || {}).forEach((key) => {
        const val1 = data1[key];
        const val2 = data2[key];
        const bothEmpty = (!val1 && !val2) || (val1 === "" && val2 === "");

        const isResolved = val1 === val2 || bothEmpty;
        defaultResolved[key] = isResolved ? String(val1 ?? "") : "";
        defaultResolvedFields[key] = isResolved;
        defaultOpenFields[key] = !isResolved;
      });

      setResolvedValues(defaultResolved);
      setResolvedFields(defaultResolvedFields);
      setOpenFields(defaultOpenFields);
    };

    if (isOpen) {
      fetchMembers();
    } else {
      setMember1(null);
      setMember2(null);
      setResolvedValues({});
      setCustomFields({});
      setResolvedFields({});
      setOpenFields({});
      setMergeView(false);
    }
  }, [isOpen, firstMemberId, secondMemberId]);

  const handleSelection = (key: string, value: string) => {
    setResolvedValues((prev) => ({ ...prev, [key]: value }));
    setResolvedFields((prev) => ({ ...prev, [key]: true }));
    setOpenFields((prev) => ({ ...prev, [key]: false }));
    setCustomFields((prev) => ({ ...prev, [key]: false }));
  };

  const updateCustomValue = (key: string, value: string) => {
    setResolvedValues((prev) => ({ ...prev, [key]: value }));
    const isValid = value.trim().length > 0;
    setResolvedFields((prev) => ({ ...prev, [key]: isValid }));
  };

  const confirmCustom = (key: string) => {
    if (resolvedValues[key]?.trim()) {
      setOpenFields((prev) => ({ ...prev, [key]: false }));
    }
  };

  const toggleFieldOpen = (key: string) => {
    setOpenFields((prev) => {
      if (!resolvedFields[key]) return { ...prev, [key]: true };
      return { ...prev, [key]: !prev[key] };
    });
  };

  if (!isOpen || !member1 || !member2) return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 transition-opacity z-40"
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
              <div className="inline-block max-w-fit text-medium px-4 py-1 bg-[#E5E7EB] rounded-3xl italic">
                <span className="font-semibold">resolving </span>
                <span className="font-light">conflict in </span>
                <span className="font-semibold">members</span>
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
            className="flex flex-col w-full h-full gap-8 overflow-y-auto overflow-hidden custom-scrollbar p-8"
          >
            {!mergeView ? (
              <>
                {Object.keys(member1).map((key) => {
                  if (key === "id") return null;
                  const val1 = member1[key];
                  const val2 = member2[key];
                  const isEqual = String(val1) === String(val2);
                  const bgColor = isEqual ? "bg-[#DAFBC9]" : "bg-[#FAD9D9]";

                  return (
                    <div key={key} className={`p-3 rounded ${bgColor}`}>
                      <label className="block font-semibold capitalize mb-2">
                        {key}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="border rounded p-1 bg-white">
                          {val1 ?? "—"}
                        </div>
                        <div className="border rounded p-1 bg-white">
                          {val2 ?? "—"}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="w-full flex justify-start gap-2">
                  <button
                    className="inline-block max-w-fit max-h-fit text-medium rounded-lg px-3 py-1 bg-gray-100 items-center justify-center"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-block max-w-fit max-h-fit text-medium font-semibold rounded-lg px-3 py-1 bg-[#C9FFAE] items-center justify-center"
                    onClick={() => setMergeView(true)}
                  >
                    Merge Members
                  </button>
                  <button
                    className="inline-block max-w-fit max-h-fit text-medium font-semibold rounded-lg px-3 py-1 bg-red-200 items-center justify-center"
                    onClick={() => {
                      console.log("Members marked as separate");
                      alert("Members marked as separate, add backend logic");
                      onClose();
                    }}
                  >
                    Mark as Separate
                  </button>
                </div>
              </>
            ) : (
              <>
                {Object.keys(member1).map((key) => {
                  if (key === "id") return null;

                  const val1 = member1[key];
                  const val2 = member2[key];
                  const resolved = resolvedValues[key] ?? "";
                  const isResolved = resolvedFields[key];
                  const isOpenField = openFields[key];

                  const bgColor = isResolved ? "bg-[#DAFBC9]" : "bg-[#FAD9D9]";

                  return (
                    <div key={key} className={`p-3 rounded ${bgColor}`}>
                      <details open={isOpenField}>
                        <summary
                          className="cursor-pointer mb-2 flex justify-between items-center gap-2"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFieldOpen(key);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold capitalize">
                              {key}:
                            </span>
                            {!isOpenField && (
                              <span className="text-sm text-gray-600 italic truncate max-w-[200px]">
                                {resolved || "—"}
                              </span>
                            )}
                          </div>
                          <span className="ml-auto text-gray-500">▾</span>
                        </summary>

                        <div className="grid grid-cols-3 gap-2">
                          <button
                            className={`border rounded p-1 ${resolved === String(val1) ? "bg-blue-100" : "bg-white"}`}
                            onClick={() => handleSelection(key, String(val1))}
                          >
                            {val1 ?? "—"}
                          </button>
                          <button
                            className={`border rounded p-1 ${resolved === String(val2) ? "bg-blue-100" : "bg-white"}`}
                            onClick={() => handleSelection(key, String(val2))}
                          >
                            {val2 ?? "—"}
                          </button>
                          <input
                            className="border rounded p-1 w-full"
                            placeholder="Custom value"
                            value={
                              resolvedFields[key] &&
                              resolved !== String(val1) &&
                              resolved !== String(val2)
                                ? resolved
                                : ""
                            }
                            onChange={(e) =>
                              updateCustomValue(key, e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                confirmCustom(key);
                              }
                            }}
                          />
                        </div>
                      </details>
                    </div>
                  );
                })}

                <div className="w-full flex justify-start gap-2">
                  <button
                    className="inline-block max-w-fit max-h-fit text-medium rounded-lg px-3 py-1 bg-gray-100 items-center justify-center"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-block max-w-fit max-h-fit text-medium font-semibold rounded-lg px-3 py-1 bg-[#E5E7EB] items-center justify-center"
                    onClick={() => {
                      console.log("Resolved Data:", resolvedValues);
                      alert("Merged Members, add backend logic");
                      onClose();
                    }}
                  >
                    Merge
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
