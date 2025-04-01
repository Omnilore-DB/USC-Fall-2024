"use client";

import { useState, useEffect } from "react";
import { getRoles } from "@/app/supabase";
import TableComponent from "@/components/ui/TableComponent";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";

export default function MembershipReports() {
    const [roles, setRoles] = useState<string[]>([]);
    const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(null);
    const [customRange, setCustomRange] = useState(false);

    const sampleAcademicYears = [
        { id: 1, year: "2022" },
        { id: 2, year: "2023" },
        { id: 3, year: "2024" },
        { id: 4, year: "2025" },
    ];


    const sampleData = [
        { id: 1, name: "John Doe", age: 30 },
        { id: 2, name: "Jane Smith", age: 25 },
        { id: 3, name: "Alice Johnson", age: 28 },
        { id: 4, name: "Bob Brown", age: 35 },
        { id: 5, name: "Charlie Davis", age: 40 },
        { id: 6, name: "Diana Prince", age: 32 },
    ];

    const [selectedSampleAcademicYear, setselectedSampleAcademicYear] = useState<string[]>([sampleAcademicYears[sampleAcademicYears.length - 1].year]);

    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    useEffect(() => {
        const setup = async () => {
            const userRoles = await getRoles();
            if (!userRoles) {
                console.error("Failed to fetch roles");
                return;
            }
            setRoles(userRoles);
        };
        setup().catch(console.error);
    }, []);

    return (
        <div className="flex h-full w-full flex-col bg-gray-100">
            <div className="flex w-full flex-grow flex-col items-center justify-center overflow-y-auto">
                {roles === null ? (
                    <div>Don't have the necessary permission</div>
                ) : (
                    <div className="flex h-[95%] w-[98%] flex-row items-center gap-4">
                        <div className="flex h-full w-full flex-col items-center">
                            <div className="flex h-full w-full flex-col gap-3">
                                {/* Select and add, delete, and edit buttons */}
                                <div className="flex flex-row justify-between w-full items-end">
                                    <div className="flex flex-row justify-between w-3/5 gap-2">
                                        {customRange ? (
                                            <>
                                                <div className="w-1/3 flex flex-col">
                                                    <label className="text-sm font-semibold">Start Date</label>
                                                    <input
                                                        type="date"
                                                        value={startDate}
                                                        onChange={(e) => setStartDate(e.target.value)}
                                                        className="w-full h-10 rounded-lg border-gray-200 bg-white p-2"
                                                    />
                                                </div>
                                                <div className="w-1/3 flex flex-col">
                                                    <label className="text-sm font-semibold">End Date</label>
                                                    <input
                                                        type="date"
                                                        value={endDate}
                                                        onChange={(e) => setEndDate(e.target.value)}
                                                        className="w-full h-10 rounded-lg border-gray-200 bg-white p-2"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-2/3 flex flex-col">
                                                    <label className="text-sm font-semibold">Calendar Year</label>
                                                    <MultiSelectDropdown
                                                        options={sampleAcademicYears.map((year) => year.year)}
                                                        selectedOptions={selectedSampleAcademicYear}
                                                        setSelectedOptions={setselectedSampleAcademicYear}
                                                        placeholder="Select Calendar Year"
                                                    />
                                                </div>
                                            </>
                                        )}
                                        <div className="w-1/3 flex items-end">
                                            <button
                                                className="w-full h-10 rounded-lg bg-gray-200 font-semibold"
                                                onClick={() => setCustomRange((prev) => !prev)}
                                            >
                                                {customRange ? "Calendar Year" : "Custom Range"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between w-1/4 gap-2">
                                        <div className="flex items-end w-1/2">
                                            <button onClick={() => alert("Add generate report logic")} className="w-full bg-blue-500 h-10 rounded-lg font-semibold text-white">
                                                Generate Report
                                            </button>
                                        </div>
                                        <div onClick={() => alert("Add export to csv")} className="flex items-end w-1/2">
                                            <button className="w-full bg-green-500 h-10 rounded-lg font-semibold text-white">
                                                Export as CSV
                                            </button>
                                        </div>
                                    </div>
                                </div>


                                {/* Table Component */}
                                <div className="w-full flex-grow overflow-y-auto">
                                    <TableComponent
                                        entries={sampleData}
                                        roles={roles}
                                        selectedRow={selectedRow}
                                        handleRowSelection={(row) => setSelectedRow(row)}
                                        primaryKeys={[]}
                                        adminTable={false}
                                        showImages={false}
                                        selectable={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
