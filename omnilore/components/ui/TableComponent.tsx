'use client';
import { useState, useEffect, useRef } from 'react';
import UserIcon from "@/components/assets/user-icon.png"


interface TableComponentProps {
    entries: Record<string, any>[];
    roles: string[];
    selectedRow: Record<string, any> | null;
    handleRowSelection: (row: Record<string, any>) => void;
    primaryKeys: string[];
    adminView?: boolean;
    showImages?: boolean;
}

const TableComponent = ({
    entries,
    roles,
    selectedRow,
    handleRowSelection,
    primaryKeys,
    adminView = true,
    showImages = false
}: TableComponentProps) => {
    
    const [localSelectedRow, setLocalSelectedRow] = useState<Record<string, any> | null>(selectedRow);
    const [columnWidths, setColumnWidths] = useState<number[]>([]);
    const headerRefs = useRef<(HTMLTableCellElement | null)[]>([]);

    useEffect(() => {
        if (headerRefs.current.length > 0) {
          const newWidths = headerRefs.current.map(
            (th) => th?.offsetWidth || 50
          );
          setColumnWidths(newWidths);
        }
      }, [entries, primaryKeys]);
      

    const handleRowClick = (row: Record<string, any>) => {
        if (localSelectedRow !== row) {
            setLocalSelectedRow(row);
            handleRowSelection(row);
        }
    };

    useEffect(() => {
        console.log("UPDATED ROW OBJECT: ", localSelectedRow);
    }, [localSelectedRow]);

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex-grow h-full w-full overflow-y-auto overflow-x-auto overflow-x:visible custom-scrollbar">
                <div className="h-full w-full min-h-full min-w-full">
                    <table className="w-full border-collapse border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                {(() => {
                                    let leftOffset = 0;

                                    return (
                                        <>
                                            {adminView && (roles.includes('admin') || roles.includes('treasurer') || roles.includes('registrar')) && (
                                                <th
                                                    ref={(el) => headerRefs.current[0] = el}
                                                    className="sticky top-0 z-20 bg-gray-100 px-4 py-2 outline-none"
                                                    style={{
                                                        left: `${leftOffset}px`,
                                                        boxShadow: 'inset 0 0 0 0.5px #e5e7eb'
                                                    }}
                                                >
                                                    Select
                                                </th>
                                            )}


                                            
                                            {adminView && (
                                            primaryKeys.map((key, colIndex) => {
                                                leftOffset += columnWidths[colIndex] || 50; // Set left based on measured width

                                                return (
                                                    <th
                                                        key={key}
                                                        ref={(el) => headerRefs.current[colIndex + 1] = el} // Store ref for measurement
                                                        className="sticky top-0 z-20 bg-gray-100 px-4 py-2 outline-none"
                                                        style={{
                                                            left: `${leftOffset}px`,
                                                            boxShadow: 'inset 0 0 0 0.5px #e5e7eb'
                                                        }}
                                                    >
                                                        {key}
                                                    </th>
                                                );
                                            }
                                            ))}
                                        </>
                                    );
                                })()}

                                {entries.length > 0 && Object.keys(entries[0])
                                    .filter(name => !primaryKeys.includes(name))
                                    .map(columnName => (
                                        <th key={columnName} className="sticky top-0 z-10 bg-gray-100 px-4 py-2 outline-none"
                                            style={{ boxShadow: 'inset 0 0 0 0.5px #e5e7eb' }}>
                                            {columnName}
                                        </th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((item, index) => {
                                const hasIssue = Object.keys(item).some(columnName => 
                                    columnName === 'issues' && Array.isArray(item[columnName]) && item[columnName].length > 0
                                );

                                const isSelected = localSelectedRow && primaryKeys.every(key => localSelectedRow[key] === item[key]);
                                
                                return (
                                <tr
                                    key={index}
                                    className={`group cursor-pointer ${
                                        hasIssue 
                                            ? 'bg-red-50' 
                                            : (isSelected) 
                                                ? 'bg-gray-100' 
                                                : 'bg-white group-hover:bg-gray-50'
                                    }`}
                                    onClick={() => handleRowClick(item)}
                                >
                                {(() => {
                                    let leftOffset = 0;

                                    return (
                                        <>
                                        {/* (roles.includes('admin') || roles.includes('treasurer') || roles.includes('registrar'))  */}
                                            {adminView && (
                                                <td 
                                                    className={`px-4 py-2 w-10 text-center sticky z-10
                                                        ${ hasIssue 
                                                                ? 'bg-red-50' 
                                                                : (isSelected) 
                                                                    ? 'bg-gray-100' 
                                                                    : 'bg-white group-hover:bg-gray-50'
                                                        }`}
                                                    style={{
                                                        left: `${leftOffset}px`,
                                                        boxShadow: 'inset 0 0 0 0.5px #e5e7eb',
                                                        outline: 'none'
                                                    }}
                                                >
                                                    <span 
                                                        className="absolute top-0 -left-[1px] h-full w-[1px] bg-gray-200"
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

                                            {adminView && (
                                                primaryKeys.map((key, colIndex) => {
                                                    leftOffset += columnWidths[colIndex] || 50;
                                                    return(
                                                    <td key={key} 
                                                    // ref={(el) => headerRefs.current[index + 1] = el}
                                                    className={`px-4 py-2 sticky z-10 ${hasIssue ? 'bg-red-50' : isSelected ? 'bg-gray-100' : 'bg-white group-hover:bg-gray-50'}`}
                                                        style={{ 
                                                            left: `${leftOffset}px`,
                                                            boxShadow: 'inset 0 0 0 0.5px #e5e7eb' 
                                                        }}>
                                                        {item[key] ?? ''}
                                                    </td>
                                                    )
                                                }))
                                        }

                                        </>
                                    );
                                })()}


                                    {roles.includes("admin") || roles.includes("treasurer") || roles.includes("registrar") ? (
                                        <>
                                        {/* {enableRowSelection && ( 
                                        <td 
                                                className={`px-4 py-2 w-10 text-center sticky left-0 z-10
                                                    ${ hasIssue 
                                                            ? 'bg-red-50' 
                                                            : (isSelected) 
                                                                ? 'bg-gray-100' 
                                                                : 'bg-white group-hover:bg-gray-50'
                                                    }`}
                                                style={{
                                                    boxShadow: 'inset 0 0 0 0.5px #e5e7eb',
                                                    outline: 'none'
                                                }}
                                            >
                                                <span 
                                                    className="absolute top-0 -left-[1px] h-full w-[1px] bg-gray-200"
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
                                
                                            {primaryKeys.map((key) => (
                                                <td key={key} className={`px-4 py-2 sticky left-20 z-10 ${hasIssue ? 'bg-red-50' : isSelected ? 'bg-gray-100' : 'bg-white group-hover:bg-gray-50'}`}
                                                    style={{ boxShadow: 'inset 0 0 0 0.5px #e5e7eb' }}>
                                                    {item[key] ?? ''}
                                                </td>
                                            ))} */}

                                            {Object.keys(item)
                                                .filter(name => !primaryKeys.includes(name))
                                                .map(columnName => (
                                                    showImages && (columnName === "Photo" || columnName === "photo_link") ? (
                                                        <td 
                                                          key={columnName} 
                                                          className={`px-4 py-2 ${
                                                            hasIssue
                                                              ? 'bg-red-50'
                                                              : isSelected
                                                                ? 'bg-gray-100'
                                                                : 'bg-white group-hover:bg-gray-50'
                                                          }`}
                                                          style={{
                                                            boxShadow: 'inset 0 0 0 0.5px #e5e7eb',
                                                            outline: 'none'
                                                          }}
                                                        >
                                                          <div className="w-12 h-12 overflow-hidden rounded-full border border-gray-300">
                                                            <img 
                                                              src={item[columnName] || UserIcon.src} 
                                                              alt="" 
                                                              className="w-full h-full object-cover"
                                                            />
                                                          </div>
                                                        </td>
                                                      ) : (
                                                    <td 
                                                        key={columnName} 
                                                        className={` px-4 py-2
                                                            ${hasIssue
                                                                ? 'bg-red-50' 
                                                                : (isSelected)
                                                                    ? 'bg-gray-100' 
                                                                    : 'bg-white group-hover:bg-gray-50'
                                                            }`}
                                                            style={{
                                                                boxShadow: 'inset 0 0 0 0.5px #e5e7eb',
                                                                outline: 'none'
                                                            }}
                                                    >
                                                        {columnName === "issues" && Array.isArray(item[columnName]) && item[columnName].length > 0
                                                            ? item[columnName].map((issue) => issue.message).join(", ")
                                                            : typeof item[columnName] === "object" && item[columnName] !== null
                                                                ? JSON.stringify(item[columnName])
                                                                : item[columnName]
                                                        }
                                                    </td>
                                                )
                                                ))}
                                        </>
                                    ) : (
                                        Object.keys(item).map(columnName => (
                                            <td 
                                                key={columnName} 
                                                className={` px-4 py-2
                                                    ${(isSelected)
                                                        ? 'bg-gray-100' 
                                                        : 'bg-white group-hover:bg-gray-50'
                                                    }`}
                                                    style={{
                                                        boxShadow: 'inset 0 0 0 0.5px #e5e7eb',
                                                        outline: 'none'
                                                    }}
                                            >
                                                {item[columnName]}
                                            </td>
                                        ))
                                    )}
                                </tr>
                            )})}
                            {entries.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={entries.length > 0 ? Object.keys(entries[0]).length : 1}
                                        className="text-center py-4 text-gray-500"
                                    >
                                        No results found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TableComponent;
