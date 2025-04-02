"use client";

import { supabase } from "@/app/supabase";
import { useState, useEffect } from "react";
import { getRoles } from "@/app/supabase";
import TableComponent from "@/components/ui/TableComponent";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";




export default function MembershipReports() {
    const [members, setMembers] = useState<any[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(null);
    const [customRange, setCustomRange] = useState(false);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [availableYears, setAvailableYears] = useState<string[]>([]);
    const [selectedYears, setSelectedYears] = useState<string[]>([]); 


    const sampleCalendarYears = [
        { id: 1, year: "2022" },
        { id: 2, year: "2023" },
        { id: 3, year: "2024" },
        { id: 4, year: "2025" },
    ];

    const formatAcademicYear = (shortYear: string): string => {
        const [start, end] = shortYear.split("-").map((y) => parseInt(y, 10));
        const fullStart = start < 50 ? 2000 + start : 1900 + start;
        const fullEnd = end < 50 ? 2000 + end : 1900 + end;
        return `${fullStart}–${fullEnd}`;
    };

    const [selectedSampleCalendarYear, setselectedSampleCalendarYear] = useState<string[]>([sampleCalendarYears[sampleCalendarYears.length - 1].year]);

    // added function
    const fetchMembershipMembers = async () => {
        if (selectedYears.length === 0) {
            alert("Please select at least one academic year");
            return;
          }
        const { data: products, error: productError } = await supabase
            .from("products")
            .select("sku")
            .eq("type", "MEMBERSHIP")
            .in("year", selectedYears);

        if (productError) {
            console.error("Failed to fetch membership SKUs", productError);
            return;
        }
        const validSkus = products
            .map((p) => p.sku)
            .filter((sku) => sku !== "SQ-TEST");
        if (validSkus.length === 0) {
            setMembers([]); // no valid memberships for this year
            return;
            }
        // get members
        const { data, error } = await supabase
            .from("members")
            .select(`
            *,
            members_to_transactions(sku)
            `)
            .in("members_to_transactions.sku", validSkus);

        if (error) {
            console.error("Failed to fetch members", error);
            return;
        }

        const filtered = data.filter((member: any) =>
            member.members_to_transactions.length > 0
        );

        setMembers(filtered);
      };
    

    useEffect(() => {
        const setup = async () => {
            const userRoles = await getRoles();
            if (!userRoles) {
                console.error("Failed to fetch roles");
                return;
            }
            setRoles(userRoles);
            const { data, error } = await supabase
                .from("products")
                .select("year")
                .eq("type", "MEMBERSHIP");

                if (error) {
                console.error("Failed to fetch years", error);
                return;
                }

            const uniqueYears = Array.from(
                new Set(data.map((p) => p.year).filter((y): y is string => y !== null))
                ).sort();
            setAvailableYears(uniqueYears);
            setSelectedYears([uniqueYears[uniqueYears.length - 1]]); // default to latest
            // await fetchMembershipMembers();
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
                                                        options={availableYears.map((year) => formatAcademicYear(year))}
                                                        selectedOptions={selectedYears.map((y) => formatAcademicYear(y))}
                                                        setSelectedOptions={(formattedSelected) => {
                                                            // reverse map the formatted label back to the raw shortYear like '24-25'
                                                            const rawSelected = availableYears.filter((y) =>
                                                              formattedSelected.includes(formatAcademicYear(y))
                                                            );
                                                            setSelectedYears(rawSelected);
                                                          }}
                                                        
                                                        placeholder="Select Academic Year(s)"
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
                                            <button onClick={fetchMembershipMembers} className="w-full bg-blue-500 h-10 rounded-lg font-semibold text-white">
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
                                        entries={members}
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
