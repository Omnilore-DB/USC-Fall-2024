import React from "react";

interface SquarespaceData {
  month: number;
  grossSales: number;
  refunds: number;
  netSales: number;
}

interface SquarespaceTableProps {
  data: SquarespaceData[];
  year: string;
}

const SquarespaceTable: React.FC<SquarespaceTableProps> = ({ data, year }) => {
  // Prepare values for each row by month index (0–11)
  const grossSales = Array(12).fill(0);
  const refunds = Array(12).fill(0);
  const netSales = Array(12).fill(0);

  data.forEach((entry) => {
    const index = Number(entry.month);
    grossSales[index] = entry.grossSales;
    refunds[index] = entry.refunds;
    netSales[index] = entry.netSales;
  });

  // Calculate YTD totals
  const ytdGross = grossSales.reduce((sum, val) => sum + val, 0);
  const ytdRefunds = refunds.reduce((sum, val) => sum + val, 0);
  const ytdNet = netSales.reduce((sum, val) => sum + val, 0);

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Squarespace - {year}</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>2023</th>
            {Array.from({ length: 12 }).map((_, i) => (
              <th key={i} style={thStyle}>
                {months[i]}
              </th>
            ))}
            <th style={thStyle}>YTD Totals</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdLabelStyle}>Gross Sales</td>
            {grossSales.map((val, i) => (
              <td key={i} style={tdStyle}>
                {formatCurrency(val)}
              </td>
            ))}
            <td style={tdTotalStyle}>{formatCurrency(ytdGross)}</td>
          </tr>
          <tr>
            <td style={tdLabelStyle}>Refunds</td>
            {refunds.map((val, i) => (
              <td key={i} style={tdStyle}>
                {formatCurrency(val)}
              </td>
            ))}
            <td style={tdTotalStyle}>{formatCurrency(ytdRefunds)}</td>
          </tr>
          <tr>
            <td style={tdLabelStyle}>Net Sales</td>
            {netSales.map((val, i) => (
              <td key={i} style={tdStyle}>
                {formatCurrency(val)}
              </td>
            ))}
            <td style={tdTotalStyle}>{formatCurrency(ytdNet)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

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

const formatCurrency = (value: number | undefined | null) => {
  if (typeof value !== "number" || isNaN(value)) {
    return "$0.00";
  }
  return `$${value.toFixed(2)}`;
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#f0f0f0",
  fontWeight: "bold",
  textAlign: "center",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "right",
};

const tdLabelStyle: React.CSSProperties = {
  ...tdStyle,
  fontWeight: "bold",
  textAlign: "left",
};

const tdTotalStyle: React.CSSProperties = {
  ...tdStyle,
  fontWeight: "bold",
};

export default SquarespaceTable;
