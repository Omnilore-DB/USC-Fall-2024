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
              <div className="text-medium inline-block max-w-fit rounded-3xl bg-[#E5E7EB] px-4 py-1 italic">
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
            className="custom-scrollbar flex h-full w-full flex-col gap-8 overflow-hidden overflow-y-auto p-8"
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
                    <div key={key} className={`rounded p-3 ${bgColor}`}>
                      <label className="mb-2 block font-semibold capitalize">
                        {key}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded border bg-white p-1">
                          {val1 ?? "—"}
                        </div>
                        <div className="rounded border bg-white p-1">
                          {val2 ?? "—"}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="flex w-full justify-start gap-2">
                  <button
                    className="text-medium inline-block max-h-fit max-w-fit items-center justify-center rounded-lg bg-gray-100 px-3 py-1"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-medium inline-block max-h-fit max-w-fit items-center justify-center rounded-lg bg-[#C9FFAE] px-3 py-1 font-semibold"
                    onClick={() => setMergeView(true)}
                  >
                    Merge Members
                  </button>
                  <button
                    className="text-medium inline-block max-h-fit max-w-fit items-center justify-center rounded-lg bg-red-200 px-3 py-1 font-semibold"
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
                    <div key={key} className={`rounded p-3 ${bgColor}`}>
                      <details open={isOpenField}>
                        <summary
                          className="mb-2 flex cursor-pointer items-center justify-between gap-2"
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
                              <span className="max-w-[200px] truncate text-sm italic text-gray-600">
                                {resolved || "—"}
                              </span>
                            )}
                          </div>
                          <span className="ml-auto text-gray-500">▾</span>
                        </summary>

                        <div className="grid grid-cols-3 gap-2">
                          <button
                            className={`rounded border p-1 ${resolved === String(val1) ? "bg-blue-100" : "bg-white"}`}
                            onClick={() => handleSelection(key, String(val1))}
                          >
                            {val1 ?? "—"}
                          </button>
                          <button
                            className={`rounded border p-1 ${resolved === String(val2) ? "bg-blue-100" : "bg-white"}`}
                            onClick={() => handleSelection(key, String(val2))}
                          >
                            {val2 ?? "—"}
                          </button>
                          <input
                            className="w-full rounded border p-1"
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

                <div className="flex w-full justify-start gap-2">
                  <button
                    className="text-medium inline-block max-h-fit max-w-fit items-center justify-center rounded-lg bg-gray-100 px-3 py-1"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-medium inline-block max-h-fit max-w-fit items-center justify-center rounded-lg bg-[#E5E7EB] px-3 py-1 font-semibold"
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
