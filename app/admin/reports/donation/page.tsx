"use client";

import { supabase } from "@/app/supabase";
import { useState, useEffect } from "react";
import { getRoles } from "@/app/supabase";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";

export default function DonationReports() {
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(null);
  const [customRange, setCustomRange] = useState(false);
  const [availableYears] = useState(["2022", "2023", "2024", "2025"]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [donationTransactions, setDonationTransactions] = useState<
    { transaction_email: string; date: string; amount: number; name: string; type: string }[]
  >([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const exportToCSV = () => {
    if (donationTransactions.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = ["Name", "Email", "Type", "Date", "Amount"];
    const rows = donationTransactions.map((t) => [
      t.name ?? "",
      t.transaction_email ?? "",
      t.type ?? "",
      new Date(t.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      t.amount.toFixed(2),
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) =>
        r.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\r\n");

    const yearsString = selectedYears.length > 0 ? selectedYears.join("_") : "all";
    let filename = "";

    if (customRange && startDate && endDate) {
      filename = `donation_report_${startDate}_to_${endDate}.csv`;
    } else {
      filename = `donation_report_${yearsString}.csv`;
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const fetchDonationTransactions = async () => {
    if (customRange && (!startDate || !endDate)) {
      alert("Please select both start and end dates");
      return;
    }

    if (!customRange && selectedYears.length === 0) {
      alert("Please select at least one calendar year");
      return;
    }

    const { data: products, error: productError } = await supabase
      .from("products")
      .select("sku")
      .eq("type", "DONATION");

    if (productError) {
      console.error("Error fetching donation SKUs", productError);
      return;
    }

    const donationSkus = products.map((p) => p.sku).filter((sku) => sku !== "SQ-TEST");
    if (donationSkus.length === 0) {
      setDonationTransactions([]);
      return;
    }

    const { data: mtt, error: mttError } = await supabase
      .from("members_to_transactions")
      .select("transaction_id, member_id")
      .in("sku", donationSkus);

    if (mttError) {
      console.error("Error fetching members_to_transactions", mttError);
      return;
    }

    const transactionIds = mtt.map((t) => t.transaction_id).filter(Boolean);
    const memberIds = mtt.map((t) => t.member_id).filter(Boolean);

    if (transactionIds.length === 0) {
      setDonationTransactions([]);
      return;
    }

    const { data: transactions, error: txError } = await supabase
      .from("transactions")
      .select("id, transaction_email, date, amount")
      .in("id", transactionIds);

    if (txError) {
      console.error("Error fetching transactions", txError);
      return;
    }

    const { data: memberInfo, error: memberError } = await supabase
      .from("members")
      .select("id, first_name, last_name, type")
      .in("id", memberIds);

    if (memberError) {
      console.error("Error fetching member info", memberError);
      return;
    }

    const memberMap = Object.fromEntries(
      memberInfo.map((m) => [
        m.id,
        {
          name: `${m.first_name} ${m.last_name}`,
          type: m.type,
        },
      ])
    );

    const filtered = transactions
      .filter((t) => {
        const txDate = new Date(t.date);
        if (customRange) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          return txDate >= start && txDate <= end;
        } else {
          const txYear = txDate.getFullYear().toString();
          return selectedYears.includes(txYear);
        }
      })
      .map((t) => {
        const memberEntry = mtt.find((m) => m.transaction_id === t.id);
        const member = memberMap[memberEntry?.member_id ?? ""];

        return {
          transaction_email: t.transaction_email,
          date: t.date,
          amount: t.amount,
          name: member?.name ?? "Unknown",
          type: member?.type ?? "UNKNOWN",
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setDonationTransactions(filtered);
  };

  useEffect(() => {
    const setup = async () => {
      const userRoles = await getRoles();
      if (!userRoles) {
        console.error("Failed to fetch roles");
        return;
      }
      setRoles(userRoles);
    };
    setup();
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
                      <div className="w-2/3 flex flex-col">
                        <label className="text-sm font-semibold">Calendar Year(s)</label>
                        <MultiSelectDropdown
                          options={availableYears}
                          selectedOptions={selectedYears}
                          setSelectedOptions={setSelectedYears}
                          placeholder="Select Calendar Year(s)"
                        />
                      </div>
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
                      <button
                        onClick={fetchDonationTransactions}
                        className="w-full bg-blue-500 h-10 rounded-lg font-semibold text-white"
                      >
                        Generate Report
                      </button>
                    </div>
                    <div className="flex items-end w-1/2">
                      <button
                        className="w-full bg-green-500 h-10 rounded-lg font-semibold text-white"
                        onClick={exportToCSV}
                      >
                        Export as CSV
                      </button>
                    </div>
                  </div>
                </div>

                <div className="w-full flex-grow overflow-y-auto">
                  <table className="w-full text-left border-collapse bg-white rounded-lg shadow">
                    <thead>
                      <tr>
                        <th className="p-3 font-semibold">Name</th>
                        <th className="p-3 font-semibold">Email</th>
                        <th className="p-3 font-semibold">Type</th>
                        <th className="p-3 font-semibold">Date</th>
                        <th className="p-3 font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donationTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-3 text-center text-gray-500">
                            No donations found
                          </td>
                        </tr>
                      ) : (
                        donationTransactions.map((t, i) => (
                          <tr key={i} className="border-t">
                            <td className="p-3">{t.name}</td>
                            <td className="p-3">{t.transaction_email}</td>
                            <td className="p-3">{t.type}</td>
                            <td className="p-3">
                              {new Date(t.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="p-3">${t.amount.toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
