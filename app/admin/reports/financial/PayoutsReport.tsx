"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { supabase } from "@/app/supabase";

const PayoutsReport: React.FC = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tableData, setTableData] = useState<any[][]>([]);

  const fetchTransactions = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates.");
      return;
    }

    console.log(`Fetching transactions from ${fromDate} to ${toDate}`);

    const { data, error } = await supabase
      .from("transactions")
      .select("date, amount, payment_platform")
      .gte("date", fromDate)
      .lte("date", toDate);

    if (error) {
      console.error("Error fetching transactions:", error);
      alert("Failed to fetch data");
      return;
    }

    console.log("Fetched transactions:", data);
    const report = generateFinancialReport(data);
    setTableData(report);
  };

  const generateFinancialReport = (
    transactions: {
      date: string;
      amount: number;
      payment_platform: "STRIPE" | "PAYPAL" | "MAIL";
    }[],
  ) => {
    const platforms = ["PAYPAL", "STRIPE"];
    const monthlySums = {
      PAYPAL: Array(12).fill(0) as number[],
      STRIPE: Array(12).fill(0) as number[],
    };
    const payoutDates = {
      PAYPAL: Array(12).fill(null) as (Date | null)[],
      STRIPE: Array(12).fill(null) as (Date | null)[],
    };
    const bankConfirmation = {
      PAYPAL: Array(12).fill(false) as boolean[],
      STRIPE: Array(12).fill(false) as boolean[],
    };

    transactions.forEach((tx) => {
      const platform = tx.payment_platform?.toString().toUpperCase();
      if (!platforms.includes(platform)) return;

      const dt = new Date(tx.date);
      if (isNaN(dt.getTime())) return;

      const month = dt.getMonth();
      monthlySums[platform as keyof typeof monthlySums][month] += Number(
        tx.amount,
      );
      payoutDates[platform as keyof typeof payoutDates][month] = dt;
      bankConfirmation[platform as keyof typeof bankConfirmation][month] = true;
    });

    const monthLabels = [
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
    const firstValidDate = transactions.find((tx) => !!tx.date);
    const displayYear = firstValidDate
      ? new Date(firstValidDate.date).getFullYear()
      : new Date().getFullYear();
    const yearRow = [displayYear.toString()].concat(Array(12).fill(""), "");

    const headerRow = [""].concat(monthLabels, "YTD Total");

    // Initialize rows without platform prefix
    const paypalDatesRow = ["Date Initiated"];
    const paypalConfirmRow = ["Bank Confirmation"];
    const paypalAmountRow = ["Payout"];
    const stripeDatesRow = ["Date Initiated"];
    const stripeConfirmRow = ["Bank Confirmation"];
    const stripeAmountRow = ["Payout"];
    const totalRow = ["Total Payouts"];

    for (let i = 0; i < 12; i++) {
      paypalDatesRow.push(
        payoutDates.PAYPAL[i]
          ? new Date(payoutDates.PAYPAL[i]!).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            })
          : "",
      );

      paypalConfirmRow.push(bankConfirmation.PAYPAL[i] ? "✓" : "");
      paypalAmountRow.push(
        monthlySums.PAYPAL[i] ? `$${monthlySums.PAYPAL[i].toFixed(2)}` : "",
      );

      stripeDatesRow.push(
        payoutDates.STRIPE[i]
          ? new Date(payoutDates.STRIPE[i]!).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            })
          : "",
      );

      stripeConfirmRow.push(bankConfirmation.STRIPE[i] ? "✓" : "");
      stripeAmountRow.push(
        monthlySums.STRIPE[i] ? `$${monthlySums.STRIPE[i].toFixed(2)}` : "",
      );

      const total = monthlySums.PAYPAL[i] + monthlySums.STRIPE[i];
      totalRow.push(total ? `$${total.toFixed(2)}` : "");
    }

    const paypalYTD = monthlySums.PAYPAL.reduce((a, b) => a + b, 0);
    const stripeYTD = monthlySums.STRIPE.reduce((a, b) => a + b, 0);
    const totalYTD = paypalYTD + stripeYTD;

    // Push YTD totals
    const lastPaypalDate = payoutDates.PAYPAL.filter(Boolean).at(-1);

    paypalDatesRow.push(
      lastPaypalDate
        ? new Date(lastPaypalDate).toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
          })
        : "",
    );

    paypalConfirmRow.push(paypalYTD > 0 ? "✓" : "");
    paypalAmountRow.push(`$${paypalYTD.toFixed(2)}`);

    const lastStripeDate = payoutDates.STRIPE.filter(Boolean).at(-1);

    stripeDatesRow.push(
      lastStripeDate
        ? new Date(lastStripeDate).toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
          })
        : "",
    );

    stripeConfirmRow.push(stripeYTD > 0 ? "✓" : "");
    stripeAmountRow.push(`$${stripeYTD.toFixed(2)}`);

    totalRow.push(`$${totalYTD.toFixed(2)}`);

    const commentsRow = ["Comments:"].concat(Array(12).fill(""), "");

    return [
      yearRow,
      headerRow,
      ["PayPal"],
      paypalDatesRow,
      paypalConfirmRow,
      paypalAmountRow,
      ["Stripe"],
      stripeDatesRow,
      stripeConfirmRow,
      stripeAmountRow,
      totalRow,
      ["Date"],
      commentsRow,
    ];
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payout Report");
    XLSX.writeFile(workbook, "PayoutsReport.xlsx");
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Payouts Report</h1>
      <h2 className="text-md mb-4 text-gray-600">
        Data Source: db.omnilore.org
      </h2>

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
            onClick={fetchTransactions}
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
          <thead>
            {tableData.slice(0, 2).map((row, rowIdx) => (
              <tr key={rowIdx} className="bg-green-200 text-center font-bold">
                {row.map((cell, cellIdx) => (
                  <th
                    key={cellIdx}
                    className="whitespace-nowrap border px-4 py-2"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {tableData.slice(2).map((row, rowIdx) => {
              const isSectionHeader = row.length === 1;
              const isTotalsRow = row[0]
                ?.toString()
                .toLowerCase()
                .includes("total");
              const isCommentsRow = row[0]
                ?.toString()
                .toLowerCase()
                .includes("comments");
              const isDateRow =
                row[0]?.toString().toLowerCase().includes("date") &&
                row.length === 13;

              const bgColor = isSectionHeader
                ? "bg-green-100 font-bold"
                : isTotalsRow
                  ? "bg-green-200 font-semibold"
                  : isCommentsRow
                    ? "bg-gray-100 italic"
                    : "";

              return (
                <tr key={rowIdx} className={bgColor}>
                  {row.map((cell, cellIdx) => {
                    const cellStr = cell?.toString() || "";
                    const alignRight =
                      cellStr.includes("$") || cellStr.match(/^\d+\.\d{2}$/);
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

export default PayoutsReport;
