"use client";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import UserIcon from "@/components/assets/user-icon.png";
import { MoonLoader } from "react-spinners";

interface TableComponentProps {
  entries: Record<string, any>[];
  roles: string[];
  selectedRow: Record<string, any> | null;
  handleRowSelection: (row: Record<string, any>) => void;
  primaryKeys: string[];
  adminTable?: boolean;
  showImages?: boolean;
}

const TableComponent = ({
  entries,
  roles,
  selectedRow,
  handleRowSelection,
  primaryKeys,
  adminTable = true,
  showImages = false,
}: TableComponentProps) => {
  const [localSelectedRow, setLocalSelectedRow] = useState<Record<
    string,
    any
  > | null>(selectedRow);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const headerRefs = useRef<(HTMLTableCellElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);



  const handleRowClick = (row: Record<string, any>) => {
    if (localSelectedRow !== row) {
      setLocalSelectedRow(row);
      handleRowSelection(row);
    }
  };

  
  useEffect(() => {
    setIsLoading(true); // Start loading when entries change
    if (headerRefs.current.length > 0) {
      const newWidths = headerRefs.current.map((th) => th?.offsetWidth || 50);
      setColumnWidths(newWidths);
    }

    // Simulate a small delay to allow for proper rendering
    const timer = setTimeout(() => {
      setIsLoading(false); // End loading after rendering
    }, 200); // Adjust delay as needed

    return () => clearTimeout(timer);
  }, [entries, primaryKeys]);

  
  const validRoles = ["admin", "registrar", "member", "treasurer"];
  const hasValidRole = roles.some((role) => validRoles.includes(role));

  if (!hasValidRole) {
    return (
      <div className="py-4 text-center text-gray-500">
        You do not have the necessary permissions to view this data.
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <MoonLoader />
        </div>
      ) : (

      <div className="overflow-x:visible custom-scrollbar h-full w-full flex-grow overflow-x-auto overflow-y-auto">
        <div className="h-full min-h-full w-full min-w-full">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {(() => {
                  let leftOffset = 0;

                  return (
                    <>
                      {adminTable && (
                        <th
                          ref={(el) => {
                            headerRefs.current[0] = el;
                          }}
                          className="sticky top-0 z-20 bg-gray-100 px-4 py-2 outline-none"
                          style={{
                            left: `${leftOffset}px`,
                            boxShadow: "inset 0 0 0 0.5px #e5e7eb",
                          }}
                        >
                          Select
                        </th>
                      )}

                      {adminTable &&
                        primaryKeys.map((key, colIndex) => {
                          leftOffset += columnWidths[colIndex] || 50;

                          return (
                            <th
                              key={key}
                              ref={(el) => {
                                headerRefs.current[colIndex + 1] = el;
                              }}
                              className="sticky top-0 z-20 bg-gray-100 px-4 py-2 outline-none"
                              style={{
                                left: `${leftOffset}px`,
                                boxShadow: "inset 0 0 0 0.5px #e5e7eb",
                              }}
                            >
                              {key}
                            </th>
                          );
                        })}
                    </>
                  );
                })()}

                {entries.length > 0 &&
                  Object.keys(entries[0])
                    .filter((name) => !primaryKeys.includes(name))
                    .map((columnName) => (
                      <th
                        key={columnName}
                        className="sticky top-0 z-10 bg-gray-100 px-4 py-2 outline-none"
                        style={{ boxShadow: "inset 0 0 0 0.5px #e5e7eb" }}
                      >
                        {columnName}
                      </th>
                    ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((item, index) => {
                const hasIssue = Object.keys(item).some(
                  (columnName) =>
                    columnName === "issues" &&
                    Array.isArray(item[columnName]) &&
                    item[columnName].length > 0,
                );

                const isSelected =
                  localSelectedRow &&
                  primaryKeys.every(
                    (key) => localSelectedRow[key] === item[key],
                  );

                return (
                  <tr
                    key={index}
                    className={`group cursor-pointer ${
                      hasIssue
                        ? "bg-red-50"
                        : isSelected
                          ? "bg-gray-100"
                          : "bg-white group-hover:bg-gray-50"
                    }`}
                    onClick={() => handleRowClick(item)}
                  >
                    {(() => {
                      let leftOffset = 0;

                      return (
                        <>
                          {/* Select body */}
                          {adminTable && (
                            <td
                              className={`sticky z-10 w-10 px-4 py-2 text-center ${
                                hasIssue
                                  ? "bg-red-50"
                                  : isSelected
                                    ? "bg-gray-100"
                                    : "bg-white group-hover:bg-gray-50"
                              }`}
                              style={{
                                left: `${leftOffset}px`,
                                boxShadow: "inset 0 0 0 0.5px #e5e7eb",
                                outline: "none",
                              }}
                            >
                              <span
                                className="absolute -left-[1px] top-0 h-full w-[1px] bg-gray-200"
                                aria-hidden="true"
                              />

                              <input
                                type="radio"
                                name="row-selection"
                                checked={!!isSelected}
                                onClick={(e) => e.stopPropagation()}
                                onChange={() => handleRowClick(item)}
                              />
                            </td>
                          )}

                          {/* Primary keys body */}
                          {adminTable &&
                            primaryKeys.map((key, colIndex) => {
                              leftOffset += columnWidths[colIndex] || 50;
                              return (
                                <td
                                  key={key}
                                  className={`sticky z-10 px-4 py-2 ${hasIssue ? "bg-red-50" : isSelected ? "bg-gray-100" : "bg-white group-hover:bg-gray-50"}`}
                                  style={{
                                    left: `${leftOffset}px`,
                                    boxShadow: "inset 0 0 0 0.5px #e5e7eb",
                                  }}
                                >
                                  {item[key] ?? ""}
                                </td>
                              );
                            })}
                        </>
                      );
                    })()}

                    <>
                      {Object.keys(item)
                        .filter((name) => !primaryKeys.includes(name))
                        .map((columnName) =>
                          showImages &&
                          (columnName === "Photo" ||
                            columnName === "photo_link") ? (
                            <td
                              key={columnName}
                              className={`px-4 py-2 ${
                                hasIssue
                                  ? "bg-red-50"
                                  : isSelected
                                    ? "bg-gray-100"
                                    : "bg-white group-hover:bg-gray-50"
                              }`}
                              style={{
                                boxShadow: "inset 0 0 0 0.5px #e5e7eb",
                                outline: "none",
                              }}
                            >
                              <div className="h-12 w-12 overflow-hidden rounded-full border border-gray-300">
                                <img
                                  src={item[columnName] || UserIcon.src}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </td>
                          ) : (
                            <td
                              key={columnName}
                              className={`px-4 py-2 ${
                                hasIssue
                                  ? "bg-red-50"
                                  : isSelected
                                    ? "bg-gray-100"
                                    : "bg-white group-hover:bg-gray-50"
                              }`}
                              style={{
                                boxShadow: "inset 0 0 0 0.5px #e5e7eb",
                                outline: "none",
                              }}
                            >
                              {columnName === "issues" &&
                              Array.isArray(item[columnName]) &&
                              item[columnName].length > 0
                                ? item[columnName]
                                    .map((issue) => issue.message)
                                    .join(", ")
                                : typeof item[columnName] === "object" &&
                                    item[columnName] !== null
                                  ? JSON.stringify(item[columnName])
                                  : item[columnName]}
                            </td>
                          ),
                        )}
                    </>
                  </tr>
                );
              })}
              {entries.length === 0 && (
                <tr>
                  <td
                    colSpan={
                      entries.length > 0 ? Object.keys(entries[0]).length : 1
                    }
                    className="py-4 text-center text-gray-500"
                  >
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
};

export default TableComponent;
