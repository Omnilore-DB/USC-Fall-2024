import React from "react";

interface StripeData {
  month: number;
  grossReceipts: number;
  fees: number;
  netReceipts: number;
  percentage: string;
}

interface StripeTableProps {
  data: StripeData[];
  year: string;
}

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

const StripeTable: React.FC<StripeTableProps> = ({ data, year }) => {
  const totals = data.reduce(
    (acc, row) => {
      acc.gross += row.grossReceipts;
      acc.fees += row.fees;
      acc.net += row.netReceipts;
      return acc;
    },
    { gross: 0, fees: 0, net: 0 },
  );

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Stripe</h2>
      <h4>{year}</h4>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Month</th>
            {months.map((m, i) => (
              <th style={thStyle} key={i}>
                {m}
              </th>
            ))}
            <th style={thStyle}>YTD Totals</th>
          </tr>
        </thead>
        <tbody>
          {["grossReceipts", "fees", "netReceipts", "percentage"].map(
            (field, idx) => (
              <tr key={idx}>
                <td style={rowHeaderStyle}>
                  {field === "grossReceipts"
                    ? "Gross Receipts"
                    : field === "fees"
                      ? "Fees"
                      : field === "netReceipts"
                        ? "Net Receipts"
                        : "Percentage"}
                </td>
                {data.map((row, i) => (
                  <td style={tdStyle} key={i}>
                    {field === "percentage"
                      ? row.percentage
                      : formatCurrency(
                          row[field as keyof StripeData] as number,
                        )}
                  </td>
                ))}
                <td style={tdStyle}>
                  {field === "percentage"
                    ? "--"
                    : formatCurrency(
                        field === "grossReceipts"
                          ? totals.gross
                          : field === "fees"
                            ? totals.fees
                            : totals.net,
                      )}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};

const formatCurrency = (value: number | undefined | null) => {
  if (typeof value !== "number" || isNaN(value)) {
    return "$0.00";
  }
  return `$${value.toFixed(2)}`;
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
};

const thStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "6px",
  backgroundColor: "#eaf3e6",
  fontWeight: "bold",
  textAlign: "center",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "6px",
  textAlign: "right",
};

const rowHeaderStyle: React.CSSProperties = {
  ...tdStyle,
  fontWeight: "bold",
  textAlign: "left",
};

export default StripeTable;
