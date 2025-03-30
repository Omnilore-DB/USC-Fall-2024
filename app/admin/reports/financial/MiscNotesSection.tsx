"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/supabase";
import { CSVLink } from "react-csv"; // For CSV export
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function MiscNotesSection() {
  const [paymentProcessors, setPaymentProcessors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch only payment_platform and fee from transactions table
        const { data: transactions, error: transactionsError } = await supabase
          .from("transactions")
          .select("payment_platform, fee");

        if (transactionsError) throw transactionsError;

        // Filter unique payment platforms to avoid duplicates
        const uniquePaymentProcessors = Array.from(
          new Set(transactions?.map((item) => item.payment_platform)),
        ).map((payment_platform) => {
          return transactions.find(
            (item) => item.payment_platform === payment_platform,
          );
        });

        // Format the data to match the UI
        const formattedData = uniquePaymentProcessors.map((item) => ({
          payment_platform: item.payment_platform,
          fee: item.fee,
          std_processing_charges: getProcessingCharges(item.payment_platform),
          ach_charges: getAchCharges(item.payment_platform),
          payout_freq: getPayoutFrequency(item.payment_platform),
        }));

        setPaymentProcessors(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Hardcoded values for different processors
  const getProcessingCharges = (platform: string) => {
    switch (platform) {
      case "PayPal":
        return "5.4% + 0.39";
      case "Stripe":
        return "2.9% + 0.30";
      case "Zelle":
        return "0.8% capped at $5";
      default:
        return "N/A";
    }
  };

  const getAchCharges = (platform: string) => {
    switch (platform) {
      case "PayPal":
        return "1.99% + 0.49";
      case "Stripe":
        return "N/A";
      case "Zelle":
        return "N/A";
      default:
        return "N/A";
    }
  };

  const getPayoutFrequency = (platform: string) => {
    switch (platform) {
      case "PayPal":
        return "Once a day at 01:00 PT";
      case "Stripe":
        return "Adjustable";
      case "Zelle":
        return "Adjustable";
      default:
        return "Adjustable";
    }
  };

  // Export data for CSV (XLSX version can be used similarly)
  const handleExport = () => {
    const csvData = paymentProcessors.map((item) => ({
      "Payment Processor": item.payment_platform,
      Fees: item.fee,
      "Processing Charges": item.std_processing_charges,
      "ACH Charges": item.ach_charges,
      "Payout Frequency": item.payout_freq,
    }));

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Payment Processor Comparison",
    );
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Payment_Processor_Comparison.xlsx");
  };

  return (
    <div>
      <h3 className="mb-4 text-xl font-semibold">
        Payment Processor Comparison
      </h3>
      <div className="mb-8 overflow-x-auto">
        <table className="w-full table-auto border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Payment Processor</th>
              <th className="border px-4 py-2">Fees</th>
              <th className="border px-4 py-2">Processing Charges</th>
              <th className="border px-4 py-2">ACH Charges</th>
              <th className="border px-4 py-2">Payout Freq.</th>
            </tr>
          </thead>
          <tbody>
            {paymentProcessors.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{item.payment_platform}</td>
                <td className="border px-4 py-2">{item.fee}</td>
                <td className="border px-4 py-2">
                  {item.std_processing_charges}
                </td>
                <td className="border px-4 py-2">{item.ach_charges}</td>
                <td className="border px-4 py-2">{item.payout_freq}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        className="mb-4 rounded-md bg-green-500 px-4 py-2 text-white"
      >
        Export to Excel
      </button>

      <h3 className="mb-4 text-xl font-semibold">Subscription Plans</h3>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Subscription</th>
              <th className="border px-4 py-2">Plan</th>
              <th className="border px-4 py-2">Payor</th>
              <th className="border px-4 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">SQSP</td>
              <td className="border px-4 py-2">Commerce Basic $36/month</td>
              <td className="border px-4 py-2">AO</td>
              <td className="border px-4 py-2">
                Both plans are being paid month-to-month; quoted rates are
                annual rate
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">SuperJack</td>
              <td className="border px-4 py-2">Std $12/month</td>
              <td className="border px-4 py-2">AO</td>
              <td className="border px-4 py-2">
                I will submit receipts for reimbursement once we hand off
                payment to OLIR.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
