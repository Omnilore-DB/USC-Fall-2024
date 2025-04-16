"use client";

import { supabase } from "@/app/supabase";
import { useState, useEffect } from "react";
import { getRoles } from "@/app/supabase";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";

export default function MembershipReports() {
  const [members, setMembers] = useState<any[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [customRange, setCustomRange] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  const exportToCSV = () => {
    if (members.length === 0) {
      alert("No data to export");
      return;
    }
    const headers = [
      "Name",
      "Address",
      "Phone",
      "Email",
      "Emergency Contact",
      "Emergency Phone",
      "Status",
      "Expiration"
    ];
    const rows = members.map(m => [
      m.name ?? "",
      m.address ?? "",
      m.phone ?? "",
      m.email ?? "",
      m.emergency_contact ?? "",
      m.emergency_contact_phone ?? "",
      m.member_status ?? "",
      m.expiration_date ?? ""
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(","))
    ].join("\r\n");
  
    // Format academic years for filename
    const yearsString =
      selectedYears.length > 0
        ? selectedYears.map(formatAcademicYear).join("_")
        : "all";
    const filename = `membership_report_${yearsString}.csv`;
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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
    const [start, end] = shortYear.split("-").map((y) => parseInt(y, 10));
    const fullStart = start < 50 ? 2000 + start : 1900 + start;
    const fullEnd = end < 50 ? 2000 + end : 1900 + end;
    return `${fullStart}–${fullEnd}`;
  };

  const fetchMembershipMembers = async () => {
    if (customRange && (!startDate || !endDate)) {
      alert("Please select both start and end dates");
      return;
    }
    console.log("Custom Range is", customRange);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("sku")
      .eq("type", "MEMBERSHIP")
      .in("year", selectedYears);

    if (productError) {
      console.error("Failed to fetch membership SKUs", productError);
      return;
    }

    const validSkus = products.map((p) => p.sku).filter((sku) => sku !== "SQ-TEST");
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
        console.log("Valid transaction IDs:", validTxIds);

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

    const { data: membersData, error: membersError } = await supabase
      .from("members")
      .select(
        "first_name, last_name, street_address, city, state, zip_code, phone, email, emergency_contact, emergency_contact_phone, member_status, expiration_date"
      )
      .in("id", filteredMemberIds.map(Number))


    if (membersError) {
      console.error("Failed to fetch members", membersError);
      return;
    }

    const formatted = membersData.map((m) => ({
      name: `${m.first_name} ${m.last_name}`,
      address: `${m.street_address}, ${m.city}, ${m.state} ${m.zip_code}`,
      phone: m.phone,
      email: m.email,
      emergency_contact: m.emergency_contact,
      emergency_contact_phone: m.emergency_contact_phone,
      member_status: m.member_status,
      expiration_date: m.expiration_date,
    }));

    setMembers(formatted);
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
      setSelectedYears([uniqueYears[uniqueYears.length - 1]]);
    };
    setup().catch(console.error);
  }, []);

  return (
    <div className="flex h-full w-full flex-col bg-gray-100">
      <div className="flex w-full flex-grow flex-col items-center justify-center overflow-y-auto">
        {roles === null ? (
          <div>Don't have the necessary permission</div>
        ) : (
          <div className="flex h-[95%] w-[98%] flex-col items-center gap-4">
            <div className="flex w-full flex-row gap-2">
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
                  <label className="text-sm font-semibold">Academic Year</label>
                  <MultiSelectDropdown
                    options={availableYears.map((year) => formatAcademicYear(year))}
                    selectedOptions={selectedYears.map((y) => formatAcademicYear(y))}
                    setSelectedOptions={(formattedSelected) => {
                      const rawSelected = availableYears.filter((y) =>
                        formattedSelected.includes(formatAcademicYear(y))
                      );
                      setSelectedYears(rawSelected);
                    }}
                    placeholder="Select Academic Year(s)"
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

            <div className="flex w-full flex-row justify-end gap-2">
              <button
                onClick={fetchMembershipMembers}
                className="bg-blue-500 h-10 px-4 rounded-lg font-semibold text-white"
              >
                Generate Report
              </button>
              <button className="bg-green-500 h-10 px-4 rounded-lg font-semibold text-white" onClick={exportToCSV}>
                Export as CSV
              </button>
            </div>

            <div className="w-full flex-grow overflow-y-auto">
              <table className="w-full text-left border-collapse bg-white rounded-lg shadow">
                <thead>
                  <tr>
                    <th className="p-3 font-semibold">Name</th>
                    <th className="p-3 font-semibold">Address</th>
                    <th className="p-3 font-semibold">Phone</th>
                    <th className="p-3 font-semibold">Email</th>
                    <th className="p-3 font-semibold">Emergency Contact</th>
                    <th className="p-3 font-semibold">Emergency Phone</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold">Expiration</th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-3 text-center text-gray-500">
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
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}