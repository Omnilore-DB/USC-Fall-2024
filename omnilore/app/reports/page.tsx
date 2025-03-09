"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns"; // Make sure to install date-fns
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Sidebar } from "@/components/sidebar";
import { getRoles } from "@/app/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAccessibleViews, Report } from "@/app/schemas/schema";
import { allReports } from "@/app/schemas";
import * as XLSX from "xlsx";
import { supabase } from "@/app/supabase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Company from "@/components/ui/company";
import { FaCalendarAlt } from "react-icons/fa";

export default function MemberSearchComponent() {
    const [entries, setEntries] = useState<Record<string, any>[]>([]);
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [roles, setRoles] = useState<string[]>([]);
    const [reports, setReports] = useState<Record<string, Report>>({});
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [fromDate, setFromDate] = useState<Date>(new Date("1990-01-02"));
    const [toDate, setToDate] = useState<Date>(new Date());
    const visibleColumns = ["date", "amount", "user_names", "payment_platform", "fee"];
    const donationSKUs = ["SQDONATION", "SQ8837136", "SQ5333658", "SQ3744653", "SQ1292366", "SQ1209149", "SQ0145403"];
    
    useEffect(() => {
        const setup = async () => {
            console.log("Fetching roles...");
            const roles = await getRoles();
            if (!roles) {
                console.error("Failed to fetch roles");
                return;
            }
            setRoles(roles);

            const reports: Record<string, Report> = {};
            for (const [_, reportList] of Object.entries(allReports)) {
                const accessible = await getAccessibleViews(reportList);
                for (const report of accessible) {
                    reports[report.name] = report as Report;
                }
            }
            setReports(reports);
            console.log("Fetched roles and reports:", { roles, reports });
        };
        setup().catch(console.error);
    }, []);

    const handleReportChange = (reportName: string) => {
        console.log("Report selected:", reportName);
        setEntries([]);
        setSelectedReport(reports[reportName]);
    };

    const fetchEntries = async () => {
        if (!selectedReport) {
            alert("Please select a report before previewing.");
            console.warn("No report selected.");
            return;
        }
        if (!selectedReport.query_function) {
            console.error("Error: selectedReport.query_function is undefined!");
            return;
        }

        console.log("Fetching entries for:", selectedReport.name);

        let data;
        if (selectedReport.name === "Membership") {
            console.log("Fetching with date range:", fromDate, toDate);
            const { data: response, error } = await supabase
                .from("transactions") // Ensure this is the correct table
                .select("*")
                .gte("date", fromDate.toISOString())
                .lte("date", toDate.toISOString());

            if (error) {
                console.error("Supabase Error:", error);
                return;
            }
            data = response;
        } else {
            data = await selectedReport.query_function();
        }

        console.log("Fetched Entries:", data);
        setEntries(data || []);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <header className="p-4 flex justify-between items-center">
                <Company />
            </header>
            <main className="flex flex-row">
                <Sidebar />
                <div className="flex flex-col items-center space-x-10 w-full justify-center">
                    <h1 className="text-2xl font-bold mb-6">Reports</h1>

                    <Select onValueChange={handleReportChange} defaultValue={selectedReport ? selectedReport.name : ""}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Report type" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(reports).map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {selectedReport && selectedReport.name === "Membership" && (
                        <div className="mt-4 flex flex-col space-y-4">
                            <div className="text-lg font-semibold">Filter orders:</div>
                            <div className="flex space-x-4">
                                <div className="relative">
                                    <label>From:</label>
                                    <div
                                        className="flex items-center border border-gray-300 rounded-md p-2"
                                        onClick={() => document.getElementById("fromDatePicker")?.focus()}
                                    >
                                        <DatePicker
                                            selected={fromDate}
                                            onChange={(date: Date | null) => date && setFromDate(date)}
                                            className="w-full border-none focus:ring-0"
                                            id="fromDatePicker"
                                        />
                                        <FaCalendarAlt className="ml-2 text-gray-500" />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label>To:</label>
                                    <div
                                        className="flex items-center border border-gray-300 rounded-md p-2"
                                        onClick={() => document.getElementById("toDatePicker")?.focus()}
                                    >
                                        <DatePicker
                                            selected={toDate}
                                            onChange={(date: Date | null) => date && setToDate(date)}
                                            className="w-full border-none focus:ring-0"
                                            id="toDatePicker"
                                        />
                                        <FaCalendarAlt className="ml-2 text-gray-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-center space-x-4">
                        <Button
                            onClick={fetchEntries}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Preview
                        </Button>
                    </div>

                    <div className="h-6"></div>

                    {entries.length > 0 ? (
                        <div className="border rounded-lg w-4/5">

                        

                        <Table className="w-full border-collapse border border-gray-300 rounded-lg shadow-md">
                            <TableHeader className="bg-gray-100">
                                <TableRow>
                                    {visibleColumns.map((key) => (
                                        <TableHead key={key} className="px-4 py-2 text-center font-semibold border-b border-gray-300">
                                            {key
                                                .replace(/_/g, " ") // Replace underscores with spaces
                                                .replace(/\b\w/g, (char) => char.toUpperCase())} {/* Capitalize first letter */}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entries.map((entry, index) => (
                                    <TableRow 
                                        key={index} 
                                        className="hover:bg-gray-100 transition duration-200 border-b border-gray-200"
                                    >
                                        {visibleColumns.map((key) => (
                                            <TableCell key={key} className="px-4 py-2 text-center">
                                                {key === "date" && entry[key] // Format date
                                                    ? format(new Date(entry[key]), "MM/dd/yyyy hh:mm a") 
                                                    : entry[key]?.toString() || "-"}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>



                        </div>
                    ) : (
                        <p className="mt-4">No entries found.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
