"use client";

import { supabase } from "@/app/supabase";
import { useState, useEffect } from "react";
import { getRoles } from "@/app/supabase";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";

export default function MembershipReports() {
  const [members, setMembers] = useState<any[]>([]);
  const [customRange, setCustomRange] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const [memberTransactions, setMemberTransactions] = useState<any[]>([]);

  const fetchMemberTransactions = async (memberId: number) => {
    try {
      // First get the member_to_transactions records
      const { data: memberTransactions, error: mttError } = await supabase
        .from("members_to_transactions")
        .select(`
          transaction_id,
          amount,
          sku
        `)
        .eq("member_id", memberId);

      if (mttError) {
        console.error("Failed to fetch member transactions", mttError);
        return [];
      }

      if (!memberTransactions || memberTransactions.length === 0) {
        return [];
      }

      // Get the transaction IDs
      const transactionIds = memberTransactions.map(mt => mt.transaction_id);

      // Fetch the actual transactions
      const { data: transactions, error: txError } = await supabase
        .from("transactions")
        .select(`
          id,
          date,
          payment_platform,
          fulfillment_status,
          refunded_amount,
          amount,
          created_at
        `)
        .in("id", transactionIds)
        .order("date", { ascending: false });

      if (txError) {
        console.error("Failed to fetch transactions", txError);
        return [];
      }

      // Fetch product information for the SKUs
      const skus = [...new Set(memberTransactions.map(mt => mt.sku))];
      const { data: products, error: productError } = await supabase
        .from("products")
        .select("sku, descriptor, type")
        .in("sku", skus);

      if (productError) {
        console.error("Failed to fetch products", productError);
      }

      const productMap = products ? Object.fromEntries(
        products.map(p => [p.sku, p])
      ) : {};

      // Combine the data - SIMPLIFIED STATUS LOGIC (no Date operations)
      const processedTransactions = memberTransactions.map(mt => {
        const transaction = transactions.find(t => t.id === mt.transaction_id);
        const product = productMap[mt.sku];
        
        if (!transaction) return null;

        // SIMPLIFIED STATUS LOGIC - No time-dependent operations
        let display_status = "Completed";

        // Handle refunds first
        if (transaction.refunded_amount > 0) {
          if (transaction.refunded_amount === transaction.amount) {
            display_status = "Fully Refunded";
          } else {
            display_status = "Partially Refunded";
          }
        } 
        // Use the ACTUAL fulfillment_status from the database
        else if (transaction.fulfillment_status === "CANCELED") {
          display_status = "Canceled";
        }
        else if (transaction.fulfillment_status === "PENDING") {
          display_status = "Pending";
        }
        else if (transaction.fulfillment_status === "FULFILLED") {
          display_status = "Completed";
        }
        // For any unknown status, show the raw status
        else {
          display_status = transaction.fulfillment_status || "Unknown";
        }
        
        return {
          transaction_id: mt.transaction_id,
          amount: mt.amount,
          sku: mt.sku,
          date: transaction.date,
          payment_platform: transaction.payment_platform,
          fulfillment_status: transaction.fulfillment_status,
          refunded_amount: transaction.refunded_amount,
          total_amount: transaction.amount,
          created_at: transaction.created_at,
          product_descriptor: product?.descriptor || "Unknown",
          product_type: product?.type || "Unknown",
          display_status: display_status
        };
      }).filter(Boolean);

      return processedTransactions;
    } catch (error) {
      console.error("Error fetching transactions", error);
      return [];
    }
  };

  // View transactions for a member
  const handleViewTransactions = async (member: any) => {
    setSelectedMember(member);
    const transactions = await fetchMemberTransactions(member.id);
    setMemberTransactions(transactions);
    setShowTransactions(true);
  };

  const exportToCSV = () => {
    if (members.length === 0) {
      alert("No data to export");
      return;
    }
    
    // Enhanced headers with new fields
    const headers = [
      "Name",
      "Address", 
      "Phone",
      "Email",
      "Emergency Contact",
      "Emergency Phone",
      "Status",
      "Expiration",
      "Gender",
      "Member Type",
      "Delivery Method"
    ];
    
    const rows = members.map((m) => [
      m.name ?? "",
      m.address ?? "",
      m.phone ?? "",
      m.email ?? "",
      m.emergency_contact ?? "",
      m.emergency_contact_phone ?? "",
      m.member_status ?? "",
      m.expiration_date ?? "",
      m.gender ?? "",
      m.type ?? "",
      m.delivery_method ?? "Email" // Default to Email
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map((r) =>
        r.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\r\n");

    let filename = "";
    if (customRange && startDate && endDate) {
      filename = `membership_report_${startDate}_to_${endDate}.csv`;
    } else {
      const yearsString =
        selectedYears.length > 0
          ? selectedYears.map(formatAcademicYear).join("_")
          : "all";
      filename = `membership_report_${yearsString}.csv`;
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

  const formatAcademicYear = (shortYear: string): string => {
    if (!shortYear || !shortYear.includes("-")) return shortYear;
    const [start, end] = shortYear.split("-").map((y) => parseInt(y, 10));
    const fullStart = start < 50 ? 2000 + start : 1900 + start;
    const fullEnd = end < 50 ? 2000 + end : 1900 + end;
    return `${fullStart}–${fullEnd}`;
  };

  const formatPhoneNumber = (phone: string | null): string => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) return phone;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const fetchMembershipMembers = async () => {
    if (customRange && (!startDate || !endDate)) {
      alert("Please select both start and end dates");
      return;
    }

    const { data: products, error: productError } = await supabase
      .from("products")
      .select("sku, status")
      .eq("type", "MEMBERSHIP")
      .in("year", selectedYears);

    if (productError) {
      console.error("Failed to fetch membership SKUs", productError);
      return;
    }
    
    const skuStatusMap = Object.fromEntries(
      products.map((p) => [p.sku, p.status ?? ""]),
    );
    const validSkus = products
      .map((p) => p.sku)
      .filter((sku) => sku !== "SQ-TEST");

    if (validSkus.length === 0) {
      setMembers([]);
      return;
    }

    const { data: mtt, error: mttError } = await supabase
      .from("members_to_transactions")
      .select("member_id, transaction_id, sku")
      .in("sku", validSkus);

    if (mttError) {
      console.error("Failed to fetch members_to_transactions", mttError);
      return;
    }

    let filteredMemberIds: (string | number)[] = [];

    if (customRange) {
      const { data: transactions, error: txError } = await supabase
        .from("transactions")
        .select("id, date");

      if (txError) {
        console.error("Failed to fetch transactions", txError);
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      const validTxIds = transactions
        .filter((tx) => {
          const txDate = new Date(tx.date);
          return txDate >= start && txDate <= end;
        })
        .map((tx) => tx.id);

      filteredMemberIds = mtt
        .filter((row) => validTxIds.includes(row.transaction_id))
        .map((row) => row.member_id);
    } else {
      filteredMemberIds = mtt.map((row) => row.member_id);
    }

    if (filteredMemberIds.length === 0) {
      setMembers([]);
      return;
    }

    // Enhanced member query with additional fields
    const { data: membersData, error: membersError } = await supabase
      .from("members")
      .select(`
        id, first_name, last_name, street_address, city, state, zip_code, 
        phone, email, emergency_contact, emergency_contact_phone, 
        member_status, expiration_date, gender, type
      `)
      .in("id", filteredMemberIds.map(Number));

    if (membersError) {
      console.error("Failed to fetch members", membersError);
      return;
    }

    const formatted = mtt
      .map((row) => {
        const m = membersData.find((mem) => mem.id === row.member_id);
        const addressParts = [
          m?.street_address,
          m?.city,
          [m?.state, m?.zip_code].filter(Boolean).join(" "),
        ].filter(Boolean);
        return {
          id: m?.id,
          first_name: m?.first_name ?? "",
          last_name: m?.last_name ?? "",
          name: `${m?.first_name} ${m?.last_name}`,
          address: addressParts.join(", "),
          phone: formatPhoneNumber(m?.phone ?? ""),
          email: m?.email ?? "",
          emergency_contact: m?.emergency_contact,
          emergency_contact_phone: formatPhoneNumber(
            m?.emergency_contact_phone ?? "",
          ),
          member_status: skuStatusMap[row.sku] ?? "",
          expiration_date: m?.expiration_date,
          gender: m?.gender ?? "",
          type: m?.type ?? "",
          delivery_method: "Email" // Default value - you may want to get this from another source
        };
      })
      .sort((a, b) => {
        const lastNameCompare = a.last_name.localeCompare(b.last_name);
        if (lastNameCompare !== 0) return lastNameCompare;
        return a.first_name.localeCompare(b.first_name);
      });

    setMembers(formatted);
  };

  useEffect(() => {
    const setup = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("year")
        .eq("type", "MEMBERSHIP");

      if (error) {
        console.error("Failed to fetch years", error);
        return;
      }

      const uniqueYears = Array.from(
        new Set(data.map((p) => p.year).filter((y): y is string => y !== null)),
      ).sort();
      setAvailableYears(uniqueYears);
      setSelectedYears([uniqueYears[uniqueYears.length - 1]]);
    };
    setup().catch(console.error);
  }, []);

  return (
    <div className="flex h-full w-full flex-col bg-gray-100">
      {/* Transactions Modal */}
      {showTransactions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-3/4 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Transactions for {selectedMember?.name}
              </h2>
              <button
                onClick={() => setShowTransactions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {memberTransactions.length === 0 ? (
                <p className="text-gray-500">No transactions found.</p>
              ) : (
                memberTransactions.map((transaction, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>Date:</strong> {transaction.date}
                      </div>
                      <div>
                        <strong>Type:</strong> {transaction.product_type}
                      </div>
                      <div>
                        <strong>Amount:</strong> ${transaction.amount}
                      </div>
                      <div>
                        <strong>Purpose:</strong> {transaction.product_descriptor}
                      </div>
                      <div>
                        <strong>Platform:</strong> {transaction.payment_platform}
                      </div>
                      <div>
                        <strong>Status:</strong> {transaction.display_status}
                      </div>
                      {transaction.refunded_amount > 0 && (
                        <div className="col-span-2">
                          <strong>Refunded:</strong> ${transaction.refunded_amount}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTransactions(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
                    <>
                      <div className="flex w-2/3 flex-col">
                        <div className="flex w-full flex-col">
                          <label className="text-sm font-semibold">
                            Academic Year
                          </label>
                          <MultiSelectDropdown
                            options={availableYears.map((year) =>
                              formatAcademicYear(year),
                            )}
                            selectedOptions={selectedYears.map((y) =>
                              formatAcademicYear(y),
                            )}
                            setSelectedOptions={(formattedSelected) => {
                              const rawSelected = availableYears.filter((y) =>
                                formattedSelected.includes(
                                  formatAcademicYear(y),
                                ),
                              );
                              setSelectedYears(rawSelected);
                            }}
                            placeholder="Select Academic Year(s)"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="flex w-1/3 items-end">
                    <button
                      className="h-10 w-full cursor-pointer rounded-lg bg-gray-200 font-semibold"
                      onClick={() => setCustomRange((prev) => !prev)}
                    >
                      {customRange ? "Academic Year" : "Custom Range"}
                    </button>
                  </div>
                </div>
                <div className="flex w-1/4 flex-row justify-between gap-2">
                  <div className="flex w-1/2 items-end">
                    <button
                      onClick={fetchMembershipMembers}
                      className="h-10 w-full cursor-pointer rounded-lg bg-blue-500 font-semibold text-white"
                    >
                      Generate Report
                    </button>
                  </div>
                  <div className="flex w-1/2 items-end">
                    <button
                      className="h-10 w-full cursor-pointer rounded-lg bg-green-500 font-semibold text-white"
                      onClick={exportToCSV}
                    >
                      Export as CSV
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Table with Additional Columns and View Transactions Button */}
              <div className="w-full grow overflow-y-auto rounded-xl">
                <table className="custom-scrollbar w-full border-collapse rounded-lg bg-white text-left shadow-sm">
                  <thead>
                    <tr>
                      <th className="sticky top-0 z-20 rounded-xl bg-white p-3 font-semibold">
                        Name
                      </th>
                      <th className="sticky top-0 z-20 bg-white p-3 font-semibold">
                        Address
                      </th>
                      <th className="sticky top-0 z-20 bg-white p-3 font-semibold">
                        Phone
                      </th>
                      <th className="sticky top-0 z-20 bg-white p-3 font-semibold">
                        Email
                      </th>
                      <th className="sticky top-0 z-20 bg-white p-3 font-semibold">
                        Emergency Contact
                      </th>
                      <th className="sticky top-0 z-20 bg-white p-3 font-semibold">
                        Emergency Phone
                      </th>
                      <th className="sticky top-0 z-20 bg-white p-3 font-semibold">
                        Status
                      </th>
                      <th className="sticky top-0 z-20 bg-white p-3 font-semibold">
                        Expiration
                      </th>
                      <th className="sticky top-0 z-20 bg-white p-3 font-semibold">
                        Gender
                      </th>
                      <th className="sticky top-0 z-20 bg-white p-3 font-semibold">
                        Member Type
                      </th>
                      <th className="sticky top-0 z-20 bg-white p-3 font-semibold">
                        Delivery Method
                      </th>
                      <th className="sticky top-0 z-20 rounded-xl bg-white p-3 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.length === 0 ? (
                      <tr>
                        <td
                          colSpan={12}
                          className="p-3 text-center text-gray-500"
                        >
                          No members found
                        </td>
                      </tr>
                    ) : (
                      members.map((m, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-3">{m.name}</td>
                          <td className="p-3">{m.address}</td>
                          <td className="p-3">{m.phone}</td>
                          <td className="p-3">{m.email}</td>
                          <td className="p-3">{m.emergency_contact}</td>
                          <td className="p-3">{m.emergency_contact_phone}</td>
                          <td className="p-3">{m.member_status}</td>
                          <td className="p-3">{m.expiration_date}</td>
                          <td className="p-3">{m.gender}</td>
                          <td className="p-3">{m.type}</td>
                          <td className="p-3">{m.delivery_method}</td>
                          <td className="p-3">
                            <button
                              onClick={() => handleViewTransactions(m)}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                            >
                              View Transactions
                            </button>
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
