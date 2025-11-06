"use client";

import { supabase } from "@/app/supabase";
import { useState, useEffect } from "react";
import { getRoles } from "@/app/supabase";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import * as XLSX from "xlsx";
import { usePartnerNavigation } from "@/hooks/use-partner-navigation";
import { cn } from "@/lib/utils";

export default function TransactionsReports() {
  const [customRange, setCustomRange] = useState(false);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [allTransactions, setAllTransactions] = useState<
    {
      transaction_email: string;
      date: string;
      amount: number;
      name: string;
      type: string;
      squarespace_id: string;
      member_id?: number | null;
      partner_id?: number | null;
      partner_name?: string;
    }[]
  >([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const { registerRow, focusPartner, highlightedId } = usePartnerNavigation();

  const exportToXLSX = () => {
    if (allTransactions.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = ["Name", "Email", "Squarespace ID", "Date", "Amount", "Type"];
    const rows = allTransactions.map((t) => [
      t.name ?? "",
      t.transaction_email ?? "",
      t.squarespace_id ?? "",
      new Date(t.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      parseFloat(t.amount.toFixed(2)),
      t.type ?? "",
    ]);
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    
    // Auto-size columns
    const columnWidths = [
      { wch: 20 }, // Name
      { wch: 30 }, // Email
      { wch: 15 }, // Squarespace ID
      { wch: 12 }, // Date
      { wch: 10 }, // Amount
      { wch: 12 }, // Type
    ];
    worksheet['!cols'] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const yearsString =
      selectedYears.length > 0 ? selectedYears.join("_") : "all";
    let filename = "";

    if (customRange && startDate && endDate) {
      filename = `transactions_report_${startDate}_to_${endDate}.xlsx`;
    } else {
      filename = `transactions_report_${yearsString}.xlsx`;
    }

    // Export file
    XLSX.writeFile(workbook, filename);
  };

  const fetchAllTransactions = async () => {
    if (customRange && (!startDate || !endDate)) {
      alert("Please select both start and end dates");
      return;
    }

    if (!customRange && selectedYears.length === 0) {
      alert("Please select at least one calendar year");
      return;
    }

    try {
      // Get all products (donations, forums, memberships)
      const { data: products, error: productError } = await supabase
        .from("products")
        .select("sku, type")
        .in("type", ["DONATION", "FORUM", "MEMBERSHIP"]);

      if (productError) {
        console.error("Error fetching products", productError);
        return;
      }

      const allSkus = products
        .map((p) => p.sku)
        .filter((sku) => sku !== "SQ-TEST");
      
      if (allSkus.length === 0) {
        setAllTransactions([]);
        return;
      }

      const skuTypeMap = Object.fromEntries(
        products.map((p) => [p.sku, p.type])
      );

      const { data: mtt, error: mttError } = await supabase
        .from("members_to_transactions")
        .select("transaction_id, member_id, sku")
        .in("sku", allSkus);

      if (mttError) {
        console.error("Error fetching members_to_transactions", mttError);
        return;
      }

      const transactionIds = mtt.map((t) => t.transaction_id).filter(Boolean);
      const memberIds = mtt.map((t) => t.member_id).filter(Boolean);

      if (transactionIds.length === 0) {
        setAllTransactions([]);
        return;
      }

      // Get all transactions
      const { data: transactions, error: txError } = await supabase
        .from("transactions")
        .select("id, transaction_email, date, amount, sqsp_id, payment_platform, parsed_form_data")
        .in("id", transactionIds);

      if (txError) {
        console.error("Error fetching transactions", txError);
        return;
      }

      // Get all member info
    const { data: memberInfo, error: memberError } = await supabase
      .from("members")
      .select("id, first_name, last_name, type, partner_id")
      .in("id", memberIds);

      if (memberError) {
        console.error("Error fetching member info", memberError);
        return;
      }

      const membersById = new Map(memberInfo.map((m) => [m.id, m]));

      const memberMap = Object.fromEntries(
        memberInfo.map((m) => {
          const partner = m.partner_id
            ? membersById.get(m.partner_id)
            : undefined;

          return [
            m.id,
            {
              name: `${m.first_name} ${m.last_name}`,
              type: m.type,
              partner_id: m.partner_id,
              partner_name: partner
                ? `${partner.first_name ?? ""} ${partner.last_name ?? ""}`.trim()
                : "",
            },
          ];
        }),
      );

      const cutoff = new Date("2023-07-01");

      const filtered = transactions
        .filter((t) => {
          const txDate = new Date(t.date);
          if (txDate < cutoff) return false;
          if (customRange) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            return txDate >= start && txDate <= end;
          } else {
            const txYear = txDate.getFullYear().toString();
            return selectedYears.includes(txYear);
          }
        })
        .flatMap((t) => {
          const memberEntry = mtt.find((m) => m.transaction_id === t.id);
          const member = memberMap[memberEntry?.member_id ?? ""];
          
          // Determine transaction type based on SKU
          let transactionType = "UNKNOWN";
          if (memberEntry?.sku) {
            const productType = skuTypeMap[memberEntry.sku];
            if (productType === "DONATION") {
              transactionType = "DONATION";
            } else if (productType === "FORUM") {
              transactionType = "FORUM";
            } else if (productType === "MEMBERSHIP") {
              transactionType = "MEMBERSHIP";
            }
          }

          // Determine squarespace_id or payment method display
          const squarespaceIdDisplay = t.payment_platform === "MAIL" 
            ? "Mail" 
            : t.sqsp_id?.toString() ?? "";

          // For FORUM transactions, check if we should split by parsed_form_data
          if (transactionType === "FORUM" && t.parsed_form_data && Array.isArray(t.parsed_form_data)) {
            // Split forum transactions into individual entries
            return t.parsed_form_data.map((participant: any) => {
              const participantName = participant.first_name && participant.last_name 
                ? `${participant.first_name} ${participant.last_name}`
                : member?.name ?? "Unknown";
              
              // Use individual amount if available, otherwise split total amount
              const individualAmount = participant.amount || (t.amount / t.parsed_form_data.length);

              return {
                transaction_email: t.transaction_email,
                date: t.date,
                squarespace_id: squarespaceIdDisplay,
                amount: individualAmount,
                name: participantName,
                type: transactionType,
                member_id: memberEntry?.member_id ?? null,
                partner_id: member?.partner_id ?? null,
                partner_name: member?.partner_name ?? "",
              };
            });
          }

          // For non-forum transactions or forum transactions without parsed_form_data, return single entry
          return [{
            transaction_email: t.transaction_email,
            date: t.date,
            squarespace_id: squarespaceIdDisplay,
            amount: t.amount,
            name: member?.name ?? "Unknown",
            type: transactionType,
            member_id: memberEntry?.member_id ?? null,
            partner_id: member?.partner_id ?? null,
            partner_name: member?.partner_name ?? "",
          }];
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setAllTransactions(filtered);
    } catch (error) {
      console.error("Error in fetchAllTransactions:", error);
    }
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = 2023; y <= currentYear; y++) {
      years.push(y.toString());
    }
    setAvailableYears(years);
  }, []);

  return (
    <div className="flex h-full w-full flex-col bg-gray-100">
      <div className="flex w-full grow flex-col items-center justify-center overflow-y-auto">
        <div className="flex h-[95%] w-[98%] flex-row items-center gap-4">
          <div className="flex h-full w-full flex-col items-center">
            <div className="flex h-full w-full flex-col gap-3">
              <div className="flex w-full flex-row items-end justify-between">
                <div className="flex w-3/5 flex-row justify-between gap-2">
                  {customRange ? (
                    <>
                      <div className="flex w-1/3 flex-col">
                        <label className="text-sm font-semibold">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="h-10 w-full cursor-pointer rounded-lg border-gray-200 bg-white p-2"
                        />
                      </div>
                      <div className="flex w-1/3 flex-col">
                        <label className="text-sm font-semibold">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="h-10 w-full cursor-pointer rounded-lg border-gray-200 bg-white p-2"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex w-2/3 flex-col">
                      <label className="text-sm font-semibold">
                        Calendar Year(s)
                      </label>
                      <MultiSelectDropdown
                        options={availableYears}
                        selectedOptions={selectedYears}
                        setSelectedOptions={setSelectedYears}
                        placeholder="Select Calendar Year(s)"
                      />
                    </div>
                  )}
                  <div className="flex w-1/3 items-end">
                    <button
                      className="h-10 w-full cursor-pointer rounded-lg bg-gray-200 font-semibold"
                      onClick={() => setCustomRange((prev) => !prev)}
                    >
                      {customRange ? "Calendar Year" : "Custom Range"}
                    </button>
                  </div>
                </div>
                <div className="flex w-1/4 flex-row justify-between gap-2">
                  <div className="flex w-1/2 items-end">
                    <button
                      onClick={fetchAllTransactions}
                      className="h-10 w-full cursor-pointer rounded-lg bg-blue-500 font-semibold text-white"
                    >
                      Generate Report
                    </button>
                  </div>
                  <div className="flex w-1/2 items-end">
                    <button
                      className="h-10 w-full cursor-pointer rounded-lg bg-green-500 font-semibold text-white"
                      onClick={exportToXLSX}
                    >
                      Export as XLSX
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full grow overflow-y-auto">
                <table className="w-full border-collapse rounded-xl bg-white text-left shadow-sm">
                  <thead>
                    <tr>
                      <th className="sticky top-0 z-20 rounded-xl bg-white p-3 font-semibold">
                        Name
                      </th>
                      <th className="sticky top-0 z-20 bg-white p-3 font-semibold">
                        Email
                      </th>
                      <th className="sticky top-0 z-20 bg-white p-3 font-semibold">
                        Squarespace ID
                      </th>
                      <th className="sticky top-0 z-20 bg-white p-3 font-semibold">
                        Date
                      </th>
                      <th className="sticky top-0 z-20 bg-white p-3 font-semibold">
                        Amount
                      </th>
                      <th className="sticky top-0 z-20 bg-white p-3 font-semibold">
                        Type
                      </th>
                      <th className="sticky top-0 z-20 rounded-xl bg-white p-3 font-semibold">
                        Partner
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTransactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-3 text-center text-gray-500"
                        >
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      allTransactions.map((t, i) => (
                        <tr
                          key={i}
                          ref={registerRow(t.member_id ?? null)}
                          className={cn(
                            "border-t transition-colors",
                            highlightedId === t.member_id ? "bg-yellow-200" : "",
                          )}
                        >
                          <td className="p-3">{t.name}</td>
                          <td className="p-3">{t.transaction_email}</td>
                          <td className="p-3">{t.squarespace_id}</td>
                          <td className="p-3">
                            {new Date(t.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="p-3">${t.amount.toFixed(2)}</td>
                          <td className="p-3">
                            <span
                              className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                                t.type === "DONATION"
                                  ? "bg-green-100 text-green-800"
                                  : t.type === "FORUM"
                                  ? "bg-purple-100 text-purple-800"
                                  : t.type === "MEMBERSHIP"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {t.type}
                            </span>
                          </td>
                          <td className="p-3">
                            {t.partner_id ? (
                              <button
                                onClick={() =>
                                  focusPartner({
                                    partnerId: t.partner_id ?? null,
                                    partnerName: t.partner_name,
                                  })
                                }
                                className="text-blue-600 underline-offset-2 hover:underline"
                              >
                                {t.partner_name || "View Partner"}
                              </button>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
