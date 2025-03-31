"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

const TreasurerReqs = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tableData, setTableData] = useState<any[][]>([]);

  const fetchData = () => {
    const year = new Date().getFullYear();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const createEmptyRow = (label: string) => {
      const values = Array(12).fill(["$0.00", "$0.00", "$0.00"]).flat();
      return [label].concat(values, "$0.00");
    };

    const yearRow = [""].concat(...months.map(() => ["", "", ""])).concat("");
    const monthHeaderRow = [""]
      .concat(months.flatMap(() => ["Gross", "Fees", "Net"]))
      .concat("YTD Total");

    const sqspHeader = ["Squarespace"];
    const sqspRows = [
      createEmptyRow("Membership Fees"),
      createEmptyRow("Forum Fees"),
      createEmptyRow("Donations"),
      createEmptyRow("TOTAL"),
    ];

    const paypalHeader = ["PayPal"];
    const paypalRows = [
      createEmptyRow("Gross"),
      createEmptyRow("Paypal fees"),
      createEmptyRow("BANK DEPOSIT"),
    ];

    const stripeHeader = ["Stripe"];
    const stripeRows = [
      createEmptyRow("Gross"),
      createEmptyRow("Paypal fees"),
      createEmptyRow("BANK DEPOSIT"),
    ];

    setTableData([
      [year.toString()],
      yearRow,
      monthHeaderRow,
      sqspHeader,
      ...sqspRows,
      paypalHeader,
      ...paypalRows,
      stripeHeader,
      ...stripeRows,
    ]);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Treasurer Report");
    XLSX.writeFile(workbook, "TreasurerReqsReport.xlsx");
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Treasurer Requests Report</h1>
      <div className="mb-6 flex gap-4">
        <div>
          <label className="mb-1 block">From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded border p-2"
          />
        </div>
        <div>
          <label className="mb-1 block">To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded border p-2"
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={fetchData}
            className="mr-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            Generate Report
          </Button>
          <Button
            onClick={exportToExcel}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Export to Excel
          </Button>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border">
        <table className="min-w-full border-collapse border text-sm">
          <tbody>
            {tableData.map((row, rowIdx) => {
              const isSectionHeader = row.length === 1;
              const isTotal = row[0]
                ?.toString()
                .toLowerCase()
                .includes("total");
              const bgColor = isSectionHeader
                ? "bg-green-100 font-bold"
                : isTotal
                  ? "bg-green-200 font-semibold"
                  : "";

              return (
                <tr key={rowIdx} className={bgColor}>
                  {row.map((cell, cellIdx) => {
                    const cellStr = cell?.toString() || "";
                    const alignRight =
                      cellStr.includes("$") || cellStr.match(/^[\d,.]+$/);
                    return (
                      <td
                        key={cellIdx}
                        className={`whitespace-nowrap border px-4 py-2 ${
                          alignRight ? "text-right" : "text-center"
                        }`}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TreasurerReqs;
