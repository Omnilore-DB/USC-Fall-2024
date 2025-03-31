"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAccessibleViews, Report } from "@/app/schemas/schema";
import { allReports } from "@/app/schemas";
import { supabase } from "@/app/supabase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Company from "@/components/ui/company";
import { FaCalendarAlt } from "react-icons/fa";

export default function MemberSearchComponent() {
  const [entries, setEntries] = useState<Record<string, any>[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [reports, setReports] = useState<Record<string, Report>>({});
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [fromDate, setFromDate] = useState<Date>(new Date("1990-01-02"));
  const [toDate, setToDate] = useState<Date>(new Date());

  const visibleColumns = [
    "full_name",
    "email",
    "phone",
    "date",
    "amount",
    "payment_platform",
    "fee",
  ];

  useEffect(() => {
    const setup = async () => {
      const roles = await getRoles();
      if (!roles) return;
      setRoles(roles);

      const reports: Record<string, Report> = {};
      for (const [, reportList] of Object.entries(allReports)) {
        const accessible = await getAccessibleViews(reportList);
        for (const report of accessible) {
          reports[report.name] = report as Report;
        }
      }
      reports["Donations"] = { name: "Donations" } as Report;
      reports["Forum"] = { name: "Forum" } as Report;
      setReports(reports);
    };
    setup().catch(console.error);
  }, []);

  const handleReportChange = (reportName: string) => {
    setEntries([]);
    setSelectedYear(null);
    setSelectedReport(reports[reportName] || ({ name: reportName } as Report));
  };

  const fetchEntries = async () => {
    if (!selectedReport) {
      alert("Please select a report before previewing.");
      return;
    }

    let data;

    const reportType = selectedReport.name.toUpperCase();
    const validTypes = ["MEMBERSHIP", "DONATION", "FORUM"];

    if (validTypes.includes(reportType)) {
      let filter = supabase
        .from("products")
        .select("sku")
        .eq("type", reportType);

      if (selectedYear !== null) {
        filter = filter.eq("year", selectedYear.toString());
      }

      const { data: productSkus, error: skuError } = await filter;
      if (skuError) {
        console.error("Error fetching SKUs:", skuError);
        return;
      }

      console.log("Products Returned:", productSkus);

      const validSKUs = productSkus?.map((p) => p.sku?.toUpperCase()) || [];
      console.log("Filtered Product SKUs:", validSKUs);

      const { data: response, error: txnError } = await supabase
        .from("transactions")
        .select("date, amount, payment_platform, fee, skus, raw_form_data")
        .gte("date", fromDate.toISOString())
        .lte("date", toDate.toISOString());

      if (txnError) {
        console.error("Error fetching transactions:", txnError);
        return;
      }

      console.log("Raw Transactions:", response);

      data = response?.filter(
        (entry) =>
          Array.isArray(entry.skus) &&
          entry.skus.some((sku) => validSKUs.includes(sku?.toUpperCase())),
      );
    } else if (selectedReport.query_function) {
      data = await selectedReport.query_function();
    } else {
      return;
    }

    setEntries(data || []);
  };

  const showYearButtons = ["MEMBERSHIP", "DONATION"].includes(
    selectedReport?.name.toUpperCase() || "",
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between p-4">
        <Company />
      </header>
      <main className="flex flex-row">
        <Sidebar />
        <div className="flex w-full flex-col items-center">
          <h1 className="mb-6 text-2xl font-bold">Reports</h1>

          <Select
            onValueChange={handleReportChange}
            defaultValue={selectedReport?.name || ""}
          >
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

          {showYearButtons && (
            <div className="mt-4 flex space-x-4">
              {[2023, 2024, 2025].map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === year ? "default" : "outline"}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </Button>
              ))}
              <Button
                variant={selectedYear === null ? "default" : "outline"}
                onClick={() => setSelectedYear(null)}
              >
                Custom Range
              </Button>
            </div>
          )}

          {selectedReport?.name && (
            <div className="mt-4 flex space-x-4">
              <div className="relative">
                <label>From:</label>
                <div className="flex items-center rounded-md border border-gray-300 p-2">
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
                <div className="flex items-center rounded-md border border-gray-300 p-2">
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
          )}

          <div className="mt-6 flex justify-center space-x-4">
            <Button
              onClick={fetchEntries}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Preview
            </Button>
          </div>

          {entries.length > 0 ? (
            <div className="mt-6 w-4/5 rounded-lg border">
              <Table className="w-full border-collapse rounded-lg border border-gray-300 shadow-md">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    {visibleColumns.map((key) => (
                      <TableHead
                        key={key}
                        className="border-b border-gray-300 px-4 py-2 text-center font-semibold"
                      >
                        {key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-gray-200 transition duration-200 hover:bg-gray-100"
                    >
                      {visibleColumns.map((key) => (
                        <TableCell key={key} className="px-4 py-2 text-center">
                          {key === "date" && entry[key]
                            ? format(new Date(entry[key]), "MM/dd/yyyy hh:mm a")
                            : key === "fee" && entry[key] !== undefined
                              ? parseFloat(entry[key]).toFixed(2)
                              : ["full_name", "email", "phone"].includes(key)
                                ? (() => {
                                    try {
                                      const parsed = entry.raw_form_data?.[0];
                                      if (!parsed) return "-";
                                      if (key === "full_name") {
                                        const name = parsed["Name"] || "";
                                        return name
                                          .toLowerCase()
                                          .split(" ")
                                          .map(
                                            (word: string) =>
                                              word.charAt(0).toUpperCase() +
                                              word.slice(1),
                                          )
                                          .join(" ");
                                      } else if (key === "email") {
                                        return (
                                          parsed["Email"]
                                            ?.trim()
                                            .toLowerCase() || "-"
                                        );
                                      } else if (key === "phone") {
                                        return parsed["Phone"]?.trim() || "-";
                                      }
                                    } catch {
                                      return "-";
                                    }
                                  })()
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

// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { format } from "date-fns";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Sidebar } from "@/components/sidebar";
// import { getRoles } from "@/app/supabase";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { getAccessibleViews, Report } from "@/app/schemas/schema";
// import { allReports } from "@/app/schemas";
// import { supabase } from "@/app/supabase";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import Company from "@/components/ui/company";
// import { FaCalendarAlt } from "react-icons/fa";

// export default function MemberSearchComponent() {
//   const [entries, setEntries] = useState<Record<string, any>[]>([]);
//   const [roles, setRoles] = useState<string[]>([]);
//   const [reports, setReports] = useState<Record<string, Report>>({});
//   const [selectedReport, setSelectedReport] = useState<Report | null>(null);
//   const [selectedYear, setSelectedYear] = useState<number | null>(null);
//   const [fromDate, setFromDate] = useState<Date>(new Date("1990-01-02"));
//   const [toDate, setToDate] = useState<Date>(new Date());

//   const visibleColumns = ["full_name", "email", "phone", "date", "amount", "payment_platform", "fee"];

//   const fallbackSKUs = {
//     MEMBERSHIP: [
//       "SQ0103148", "SQ0737060", "SQ1845348", "SQ2612456", "SQ2684442",
//       "SQ3331644", "SQ4373711", "SQ4983776", "SQ5521712", "SQ6547542",
//       "SQ6550241", "SQ6576347", "SQ6846981", "SQ7606316", "SQ7817608",
//       "SQ8630526", "SQ8887606", "SQ9297863", "SQMAE25005", "SQMFE2501",
//       "SQMFU25002", "SQMLE25003", "SQMLU25004", "SQ-TEST"
//     ],
//     DONATION: [
//       "SQDONATION", "SQ8837136", "SQ5333658", "SQ3744653", "SQ1292366",
//       "SQ1209149", "SQ0145403"
//     ],
//     FORUM: []
//   };

//   useEffect(() => {
//     const setup = async () => {
//       const roles = await getRoles();
//       if (!roles) return;
//       setRoles(roles);

//       const reports: Record<string, Report> = {};
//       for (const [, reportList] of Object.entries(allReports)) {
//         const accessible = await getAccessibleViews(reportList);
//         for (const report of accessible) {
//           reports[report.name] = report as Report;
//         }
//       }
//       reports["Donations"] = { name: "Donations" } as Report;
//       reports["Forum"] = { name: "Forum" } as Report;
//       setReports(reports);
//     };
//     setup().catch(console.error);
//   }, []);

//   const handleReportChange = (reportName: string) => {
//     setEntries([]);
//     setSelectedYear(null);
//     setSelectedReport(reports[reportName] || { name: reportName } as Report);
//   };

//   const fetchEntries = async () => {
//     if (!selectedReport) {
//       alert("Please select a report before previewing.");
//       return;
//     }

//     let data;

//     const reportType = selectedReport.name.toUpperCase();
//     const validTypes = ["MEMBERSHIP", "DONATION", "FORUM"];

//     let validSKUs: string[] = [];

//     if (validTypes.includes(reportType)) {
//       if (selectedYear !== null) {
//         const { data: productSkus, error: skuError } = await supabase
//           .from("products")
//           .select("sku")
//           .ilike("type", reportType.toLowerCase())
//           .eq("year", selectedYear.toString());

//         if (skuError) {
//           console.error("Error fetching SKUs:", skuError);
//           return;
//         }

//         validSKUs = (productSkus?.map((p) => p.sku?.toUpperCase()) || []);
//       } else {
//         validSKUs = fallbackSKUs[reportType] || [];
//       }

//       console.log("Final SKUs in use:", validSKUs);

//       if (validSKUs.length === 0) {
//         console.warn("No SKUs found for selected type/year");
//         setEntries([]);
//         return;
//       }

//       const { data: response, error: txnError } = await supabase
//         .from("transactions")
//         .select("date, amount, payment_platform, fee, skus, raw_form_data")
//         .gte("date", fromDate.toISOString())
//         .lte("date", toDate.toISOString());

//       if (txnError) {
//         console.error("Error fetching transactions:", txnError);
//         return;
//       }

//       data = response?.filter(
//         (entry) => Array.isArray(entry.skus) && entry.skus.some((sku) => validSKUs.includes(sku?.toUpperCase()))
//       );
//     } else if (selectedReport.query_function) {
//       data = await selectedReport.query_function();
//     } else {
//       return;
//     }

//     setEntries(data || []);
//   };

//   const showYearButtons = ["MEMBERSHIP", "DONATION"].includes(selectedReport?.name.toUpperCase() || "");

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       <header className="p-4 flex justify-between items-center">
//         <Company />
//       </header>
//       <main className="flex flex-row">
//         <Sidebar />
//         <div className="flex flex-col items-center w-full">
//           <h1 className="text-2xl font-bold mb-6">Reports</h1>

//           <Select onValueChange={handleReportChange} defaultValue={selectedReport?.name || ""}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select Report type" />
//             </SelectTrigger>
//             <SelectContent>
//               {Object.keys(reports).map((type) => (
//                 <SelectItem key={type} value={type}>
//                   {type}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {showYearButtons && (
//             <div className="flex space-x-4 mt-4">
//               {[2023, 2024, 2025].map((year) => (
//                 <Button
//                   key={year}
//                   variant={selectedYear === year ? "default" : "outline"}
//                   onClick={() => setSelectedYear(year)}
//                 >
//                   {year}
//                 </Button>
//               ))}
//               <Button
//                 variant={selectedYear === null ? "default" : "outline"}
//                 onClick={() => setSelectedYear(null)}
//               >
//                 Custom Range
//               </Button>
//             </div>
//           )}

//           <div className="mt-4 flex space-x-4">
//             <div className="relative">
//               <label>From:</label>
//               <div className="flex items-center border border-gray-300 rounded-md p-2">
//                 <DatePicker
//                   selected={fromDate}
//                   onChange={(date: Date | null) => date && setFromDate(date)}
//                   className="w-full border-none focus:ring-0"
//                   id="fromDatePicker"
//                 />
//                 <FaCalendarAlt className="ml-2 text-gray-500" />
//               </div>
//             </div>
//             <div className="relative">
//               <label>To:</label>
//               <div className="flex items-center border border-gray-300 rounded-md p-2">
//                 <DatePicker
//                   selected={toDate}
//                   onChange={(date: Date | null) => date && setToDate(date)}
//                   className="w-full border-none focus:ring-0"
//                   id="toDatePicker"
//                 />
//                 <FaCalendarAlt className="ml-2 text-gray-500" />
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 flex justify-center space-x-4">
//             <Button
//               onClick={fetchEntries}
//               className="bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               Preview
//             </Button>
//           </div>

//           {entries.length > 0 ? (
//             <div className="mt-6 border rounded-lg w-4/5">
//               <Table className="w-full border-collapse border border-gray-300 rounded-lg shadow-md">
//                 <TableHeader className="bg-gray-100">
//                   <TableRow>
//                     {visibleColumns.map((key) => (
//                       <TableHead key={key} className="px-4 py-2 text-center font-semibold border-b border-gray-300">
//                         {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {entries.map((entry, index) => (
//                     <TableRow key={index} className="hover:bg-gray-100 transition duration-200 border-b border-gray-200">
//                       {visibleColumns.map((key) => (
//                         <TableCell key={key} className="px-4 py-2 text-center">
//                           {key === "date" && entry[key]
//                             ? format(new Date(entry[key]), "MM/dd/yyyy hh:mm a")
//                             : key === "fee" && entry[key] !== undefined
//                             ? parseFloat(entry[key]).toFixed(2)
//                             : ["full_name", "email", "phone"].includes(key) ? (
//                                 (() => {
//                                   try {
//                                     const parsed = entry.raw_form_data?.[0];
//                                     if (!parsed) return "-";
//                                     if (key === "full_name") {
//                                       const name = parsed["Name"] || "";
//                                       return name
//                                         .toLowerCase()
//                                         .split(" ")
//                                         .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
//                                         .join(" ");
//                                     } else if (key === "email") {
//                                       return parsed["Email"]?.trim().toLowerCase() || "-";
//                                     } else if (key === "phone") {
//                                       return parsed["Phone"]?.trim() || "-";
//                                     }
//                                   } catch {
//                                     return "-";
//                                   }
//                                 })()
//                               ) : (
//                                 entry[key]?.toString() || "-"
//                               )}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           ) : (
//             <p className="mt-4">No entries found.</p>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }
