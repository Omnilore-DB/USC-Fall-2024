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
        <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        {roles.includes("admin") || roles.includes("treasurer") || roles.includes("registrar") ? (
                            <>
                                <th className="outline outline-gray-200 outline-1 bg-gray-100 px-4 py-2 sticky left-0 z-5">Select</th>
                                <th className="outline outline-gray-200 outline-1 bg-gray-100 px-4 py-2 sticky left-20 z-5 border border-right-gray-200">
                                    {primaryKey}
                                </th>
                                {entries.length > 0 && Object.keys(entries[0])
                                    .filter(name => name !== primaryKey)
                                    .map(columnName => (
                                        <th key={columnName} className="border border-gray-200 px-4 py-2">{columnName}</th>
                                    ))}
                            </>
                        ) : (
                            entries.length > 0 && Object.keys(entries[0]).map(columnName => (
                                <th key={columnName} className="border border-gray-200 px-4 py-2">{columnName}</th>
                            ))
                        )}
                    </tr>
                </thead>
                <tbody>
                    {entries.map((item, index) => (
                        <tr
                        key={index}
                        className={`group cursor-pointer ${
                            localSelectedRow === item[primaryKey] 
                                ? 'bg-gray-100' 
                                : 'bg-white group-hover:bg-gray-50'
                        }`}
                        onClick={() => handleRowClick(item[primaryKey])}
                    >
                        {roles.includes("admin") || roles.includes("treasurer") || roles.includes("registrar") ? (
                            <>
                                <td 
                                    className={`px-4 py-2 w-10 text-center sticky left-0 z-5 outline outline-1 outline-gray-200
                                        ${localSelectedRow === item[primaryKey] 
                                            ? 'bg-gray-100' 
                                            : 'bg-white group-hover:bg-gray-50'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="row-selection"
                                        checked={localSelectedRow === item[primaryKey]}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={() => handleRowClick(item[primaryKey])}
                                    />
                                </td>
                    
                                <td 
                                    className={`outline outline-gray-200 outline-1 px-4 py-2 sticky left-20 z-5
                                        ${localSelectedRow === item[primaryKey] 
                                            ? 'bg-gray-100' 
                                            : 'bg-white group-hover:bg-gray-50'
                                        }`}
                                >
                                    {item[primaryKey]}
                                </td>
                    
                                {Object.keys(item)
                                    .filter(name => name !== primaryKey)
                                    .map(columnName => (
                                        <td 
                                            key={columnName} 
                                            className={`border border-gray-200 px-4 py-2
                                                ${localSelectedRow === item[primaryKey] 
                                                    ? 'bg-gray-100' 
                                                    : 'bg-white group-hover:bg-gray-50'
                                                }`}
                                        >
                                            {item[columnName]}
                                        </td>
                                    ))}
                            </>
                        ) : (
                            Object.keys(item).map(columnName => (
                                <td 
                                    key={columnName} 
                                    className={`border border-gray-200 px-4 py-2
                                        ${localSelectedRow === item[primaryKey] 
                                            ? 'bg-gray-100' 
                                            : 'bg-white group-hover:bg-gray-50'
                                        }`}
                                >
                                    {item[columnName]}
                                </td>
                            ))
                        )}
                    </tr>
                    
                    ))}
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
    );
};

export default TableComponent;
