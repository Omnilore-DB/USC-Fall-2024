'use client';

import { useState } from 'react';

interface TableComponentProps {
    entries: Record<string, any>[];
    roles: string[];
    selectedRow: number | null;
    handleRowSelection: (primaryKeyValue: any) => void;
    primaryKey: string;
}

const TableComponent = ({
    entries,
    roles,
    selectedRow,
    handleRowSelection,
    primaryKey
}: TableComponentProps) => {
    
    const [localSelectedRow, setLocalSelectedRow] = useState<number | null>(selectedRow);

    const handleRowClick = (pid: number) => {
            if (localSelectedRow !== pid) {
            setLocalSelectedRow(pid);
            handleRowSelection(pid);
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex-grow h-full w-full overflow-y-auto overflow-x-auto overflow-x: visible custom-scrollbar">
                <div className="h-full w-full min-h-full min-w-full">
                    <table className="w-full border-collapse border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                {roles.includes("admin") || roles.includes("treasurer") || roles.includes("registrar") ? (
                                    <>
                                        <th className="sticky top-0 z-20 bg-gray-100 px-4 py-2 left-0 outline-none"
                                            style={{
                                                boxShadow: 'inset 0 0 0 0.5px #e5e7eb',
                                            }}>
                                            <span 
                                                className="absolute -top-[1px] left-0 w-full h-[1px] bg-gray-200"
                                                aria-hidden="true"
                                            />
                                            <span 
                                                className="absolute top-0 -left-[1px] h-full w-[1px] bg-gray-200"
                                                aria-hidden="true"
                                            />
                                            Select
                                        </th>

                                        <th className="sticky top-0 z-20 bg-gray-100 px-4 py-2 left-20 outline-none"
                                            style={{
                                                boxShadow: 'inset 0 0 0 0.5px #e5e7eb',
                                                outline: 'none'
                                            }}
                                        >
                                            <span 
                                                className="absolute -top-[1px] left-0 w-full h-[1px] bg-gray-200"
                                                aria-hidden="true"
                                            />
                                            
                                            {primaryKey}
                                        </th>

                                        {entries.length > 0 && Object.keys(entries[0])
                                            .filter(name => name !== primaryKey)
                                            .map(columnName => (
                                                <th 
                                                    key={columnName} 
                                                    className="sticky top-0 z-10 bg-gray-100 px-4 py-2 outline-none"
                                                    style={{
                                                        boxShadow: 'inset 0 0 0 0.5px #e5e7eb',
                                                        outline: 'none'
                                                    }}
                                                >
                                                    <span 
                                                        className="absolute -top-[1px] left-0 w-full h-[1px] bg-gray-200"
                                                        aria-hidden="true"
                                                    />
                                                    {columnName}
                                                </th>
                                            ))
                                        }
                                    </>
                                ) : (
                                    entries.length > 0 && Object.keys(entries[0]).map(columnName => (
                                        <th key={columnName} className="px-4 py-2" 
                                        style={{
                                            boxShadow: 'inset 0 0 0 0.5px #e5e7eb',
                                            outline: 'none'
                                        }}
                                        >
                                            {columnName}
                                        </th>
                                    ))
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((item, index) => {
                                const hasIssue = Object.keys(item).some(columnName => 
                                    columnName === 'issues' && Array.isArray(item[columnName]) && item[columnName].length > 0
                                );
                                
                                return (
                                <tr
                                    key={index}
                                    className={`group cursor-pointer ${
                                        hasIssue 
                                            ? 'bg-red-50' 
                                            : localSelectedRow === item[primaryKey] 
                                                ? 'bg-gray-100' 
                                                : 'bg-white group-hover:bg-gray-50'
                                    }`}
                                    onClick={() => handleRowClick(item[primaryKey])}
                                >
                                    {roles.includes("admin") || roles.includes("treasurer") || roles.includes("registrar") ? (
                                        <>
                                        <td 
                                                className={`px-4 py-2 w-10 text-center sticky left-0 z-10
                                                    ${ hasIssue 
                                                            ? 'bg-red-50' 
                                                            : localSelectedRow === item[primaryKey] 
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
                                                    checked={localSelectedRow === item[primaryKey]}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={() => handleRowClick(item[primaryKey])}
                                                />
                                            </td>
                                
                                            <td className={`px-4 py-2 sticky left-20 z-10
                                                    ${ hasIssue 
                                                            ? 'bg-red-50' 
                                                            : localSelectedRow === item[primaryKey] 
                                                                ? 'bg-gray-100' 
                                                                : 'bg-white group-hover:bg-gray-50'
                                                    }`}
                                                    style={{
                                                        boxShadow: 'inset 0 0 0 0.5px #e5e7eb',
                                                        outline: 'none'
                                                    }}
                                            >
                                                {item[primaryKey]}
                                            </td>
                                
                                            {Object.keys(item)
                                                .filter(name => name !== primaryKey)
                                                .map(columnName => (
                                                    <td 
                                                        key={columnName} 
                                                        className={` px-4 py-2
                                                            ${hasIssue
                                                                ? 'bg-red-50' 
                                                                : localSelectedRow === item[primaryKey] 
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
                                                ))}
                                        </>
                                    ) : (
                                        Object.keys(item).map(columnName => (
                                            <td 
                                                key={columnName} 
                                                className={` px-4 py-2
                                                    ${localSelectedRow === item[primaryKey] 
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
