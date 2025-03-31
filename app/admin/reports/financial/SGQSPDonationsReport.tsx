"use client";

import { useState } from "react";
import { supabase } from "@/app/supabase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const SGQSPDonationsReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [donationsData, setDonationsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Helper function to format the date to "YYYY-MM"
  const formatDateToYearMonth = (dateString: string) => {
    if (!dateString) return ""; // Return empty if date is missing
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based
    return `${year}-${month.toString().padStart(2, "0")}`; // Format as YYYY-MM
  };

  // Helper function to extract the Date part "YYYY-MM-DD"
  const formatDate = (dateString: string) => {
    if (!dateString) return ""; // Return empty if date is missing
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Extracts "YYYY-MM-DD"
  };

  // Fetch donations data
  const handleFetch = async () => {
    if (!fromDate || !toDate) return;

    setLoading(true);
    try {
      // Fetch members_to_transactions data first
      const { data: membersToTransactions, error: mttError } = await supabase
        .from("members_to_transactions")
        .select("member_id, transaction_id");

      if (mttError) throw mttError;

      // Fetch members data
      const { data: members, error: membersError } = await supabase.from(
        "members",
      ).select(`
          id,
          first_name,
          last_name,
          email,
          street_address,
          city,
          zip_code,
          state,
          phone,
          created_at
        `);

      if (membersError) throw membersError;

      // Fetch transactions data
      const { data: transactions, error: transactionsError } = await supabase
        .from("transactions")
        .select(
          `
          id,
          amount,
          date,
          created_at
        `,
        )
        .gte("date", fromDate)
        .lte("date", toDate);

      if (transactionsError) throw transactionsError;

      // Combine data
      const combinedData = membersToTransactions.map((mtt) => {
        const member = members.find((m) => m.id === mtt.member_id);
        const transaction = transactions.find(
          (t) => t.id === mtt.transaction_id,
        );

        // Split street_address into address1 and address2 (address2 for Apt/unit)
        const [address1, ...address2Parts] = (
          member?.street_address || ""
        ).split(",");
        let address2 = address2Parts.join(",").trim();

        // Check for apartment/unit numbers and move them to address2
        const aptRegex = /(apt|unit|#\d+)/i; // Regex to match 'apt', 'unit', or any number like #3
        const aptMatch = address1.match(aptRegex);
        if (aptMatch) {
          // Move unit/apartment number from address1 to address2
          const updatedAddress1 = address1.replace(aptMatch[0], "").trim();
          address2 = aptMatch[0] + (address2 ? ", " + address2 : "");
          return {
            ...member,
            ...transaction,
            address1: updatedAddress1,
            address2: address2,
            country: "United States", // Hardcode country as United States
            created_at: transaction ? transaction.created_at : "", // Ensure created_at is populated
            year_month: transaction
              ? formatDateToYearMonth(transaction.created_at)
              : "", // Ensure Year-Month is derived from created_at
            date: transaction ? formatDate(transaction.created_at) : "", // Get the date part of created_at
          };
        }

        return {
          ...member,
          ...transaction,
          address1,
          address2, // Derived from street_address
          country: "United States", // Hardcode country as United States
          created_at: transaction ? transaction.created_at : "", // Ensure created_at is populated
          year_month: transaction
            ? formatDateToYearMonth(transaction.created_at)
            : "", // Ensure Year-Month is derived from created_at
          date: transaction ? formatDate(transaction.created_at) : "", // Get the date part of created_at
        };
      });

      setDonationsData(combinedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Export data to Excel
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(donationsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SGQSP Donations Report");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "SGQSP_Donations_Report.xlsx");
  };

  return (
    <div style={mainContainerStyle}>
      <h1>SGQSP Donations Report - 2024</h1>

      <div style={inputContainerStyle}>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button onClick={handleFetch} style={generateButtonStyle}>
          Generate Report
        </button>
        <button onClick={handleExport} style={exportButtonStyle}>
          Export to Excel
        </button>
      </div>

      <h2>SGQSP Donations</h2>

      {loading ? (
        <div>Loading SGQSP Donations...</div>
      ) : (
        <DonationsTable data={donationsData} />
      )}
    </div>
  );
};

const DonationsTable = ({ data }: { data: any[] }) => {
  return (
    <div style={tableContainerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Address1</th>
            <th style={thStyle}>Address2</th>
            <th style={thStyle}>City</th>
            <th style={thStyle}>Zip</th>
            <th style={thStyle}>State</th>
            <th style={thStyle}>Country</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Created At</th>
            <th style={thStyle}>Year-Month</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td style={tdStyle}>{row.date}</td>
              <td style={tdStyle}>{formatCurrency(row.amount)}</td>
              <td style={tdStyle}>
                {row.first_name} {row.last_name}
              </td>
              <td style={tdStyle}>{row.email}</td>
              <td style={tdStyle}>{row.address1}</td>
              <td style={tdStyle}>{row.address2}</td>
              <td style={tdStyle}>{row.city}</td>
              <td style={tdStyle}>{row.zip_code}</td>
              <td style={tdStyle}>{row.state}</td>
              <td style={tdStyle}>{row.country}</td>
              <td style={tdStyle}>{row.phone}</td>
              <td style={tdStyle}>{row.created_at}</td>
              <td style={tdStyle}>{row.year_month}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const formatCurrency = (value: any) => {
  if (typeof value !== "number" || isNaN(value)) {
    return "$0.00";
  }
  return `$${value.toFixed(2)}`;
};

// Styles
const mainContainerStyle = { padding: "20px" };
const inputContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
};
const generateButtonStyle = {
  backgroundColor: "green",
  color: "white",
  padding: "5px 10px",
};
const exportButtonStyle = {
  backgroundColor: "royalblue",
  color: "white",
  padding: "5px 10px",
};
const tableContainerStyle = { marginTop: "20px" };
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  border: "1px solid #ddd",
} satisfies React.CSSProperties;
const thStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  backgroundColor: "#f2f2f2",
  fontWeight: "bold",
  textAlign: "center",
} satisfies React.CSSProperties;
const tdStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "center",
} satisfies React.CSSProperties;

export default SGQSPDonationsReport;
