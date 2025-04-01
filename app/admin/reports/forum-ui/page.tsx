"use client";

import { useState, useEffect, useMemo } from "react";
import { getRoles } from "@/app/supabase";
import TableComponent from "@/components/ui/TableComponent";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { queryTableWithPrimaryKey } from "@/app/queryFunctions";

export default function Reports() {
    const [roles, setRoles] = useState<string[]>([]);

    const sampleCalendarYears = [
        { id: 1, year: "22-23" },
        { id: 2, year: "23-24" },
        { id: 3, year: "24-25" },
        { id: 4, year: "25-26" },
    ];

    const sampleTrimesterOptions = [
        { id: 1, name: "Trimester 1" },
        { id: 2, name: "Trimester 2" },
        { id: 3, name: "Trimester 3" },
    ];

    const sampleData = [
        { id: 1, name: "John Doe", age: 30 },
        { id: 2, name: "Jane Smith", age: 25 },
        { id: 3, name: "Alice Johnson", age: 28 },
        { id: 4, name: "Bob Brown", age: 35 },
        { id: 5, name: "Charlie Davis", age: 40 },
        { id: 6, name: "Diana Prince", age: 32 },
    ];
    
    const [selectedSampleCalendarYear, setSelectedSampleCalendarYear] = useState<string[]>([sampleCalendarYears[sampleCalendarYears.length - 1].year]);
    const [selectedSampleTrimesterOptions, setSelectedSampleTrimesterOptions] = useState<string[]>([sampleTrimesterOptions[sampleTrimesterOptions.length - 1].name]);


    useEffect(() => {
        const setup = async () => {
            const userRoles = await getRoles();
            if (!userRoles) {
                console.error("Failed to fetch roles");
                return;
            }
            setRoles(userRoles);

            // update later
            // Defaults to financial report type
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
                                <div className="flex justify-between">
                                    <div className="w-1/5">
                                        {/* CAN YOU CREATE A SELECT DROPDOWN FOR THE CALENDAR YEAR AND TRIMESTER? */}
                                        <MultiSelectDropdown
                                            options={sampleCalendarYears.map((year) => year.year)}
                                            selectedOptions={selectedSampleCalendarYear}
                                            setSelectedOptions={setSelectedSampleCalendarYear}
                                            placeholder="Select Calendar Year"
                                        />

                                        <MultiSelectDropdown
                                            options={sampleTrimesterOptions.map((trimester) => trimester.name)}
                                            selectedOptions={selectedSampleTrimesterOptions}
                                            setSelectedOptions={setSelectedSampleTrimesterOptions}
                                            placeholder="Select Trimester"
                                        />
                                    </div>
                                </div>

                                {/* Table Component */}
                                {/* {primaryKeys && (
                                    <div className="w-full flex-grow overflow-y-auto">
                                        <TableComponent
                                            entries={sampleData}
                                            roles={roles}
                                            selectedRow={selectedRow}
                                            handleRowSelection={(row) => setSelectedRow(row)}
                                            primaryKeys={primaryKeys}
                                            adminTable={true}
                                            showImages={false}
                                        />
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
