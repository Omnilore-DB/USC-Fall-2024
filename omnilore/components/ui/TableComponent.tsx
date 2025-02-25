'use client';

interface TableComponentProps {
    entries: Record<string, any>[];
    roles: string[];
    selectedRow: number | null;
    handleRowSelection: (primaryKeyValue: any) => void;
    primaryKey: string;
}

const handleRowSelection = (pid: number) => {
    if (selectedRow !== pid) {
        setSelectedRow(pid);
    }
};

const TableComponent = ({
    entries,
    roles,
    selectedRow,
    handleRowSelection,
    primaryKey
}: TableComponentProps) => {
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
                            className="group hover:bg-gray-50"
                            onClick={() => handleRowSelection(item[primaryKey])}
                        >
                            {roles.includes("admin") || roles.includes("treasurer") || roles.includes("registrar") ? (
                                <>
                                    <td className="px-4 py-2 w-10 text-center sticky left-0 z-5 bg-white outline outline-1 outline-gray-200 group-hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="row-selection"
                                            checked={selectedRow === item[primaryKey]}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() => handleRowSelection(item[primaryKey])}
                                        />
                                    </td>
                                    <td className="outline outline-gray-200 outline-1 px-4 py-2 bg-white sticky left-20 z-5 group-hover:bg-gray-50">
                                        {item[primaryKey]}
                                    </td>
                                    {Object.keys(item)
                                        .filter(name => name !== primaryKey)
                                        .map(columnName => (
                                            <td key={columnName} className="border border-gray-200 px-4 py-2 group-hover:bg-gray-50">
                                                {item[columnName]}
                                            </td>
                                        ))}
                                </>
                            ) : (
                                Object.keys(item).map(columnName => (
                                    <td key={columnName} className="border border-gray-200 px-4 py-2 group-hover:bg-gray-50">
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
