

'use client';
import React from 'react';

type PaypalData = {
  month: number;
  grossReceipts: number;
  fees: number;
  netReceipts: number;
  percentage: number;
};

type PaypalTableProps = {
  data: PaypalData[];
  year: number;
};

const months = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

const thStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '6px',
  backgroundColor: '#f9f9f9',
  textAlign: 'center',
};

const tdStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '6px',
  textAlign: 'center',
};

const formatCurrency = (value: number) =>
  `$${(value ?? 0).toFixed(2)}`;

const formatPercentage = (value: number) =>
  isNaN(value) ? '--' : `${value.toFixed(2)}%`;

const PaypalTable: React.FC<PaypalTableProps> = ({ data, year }) => {
  const ytd = data.reduce(
    (acc, cur) => {
      acc.grossReceipts += cur.grossReceipts || 0;
      acc.fees += cur.fees || 0;
      acc.netReceipts += cur.netReceipts || 0;
      return acc;
    },
    { grossReceipts: 0, fees: 0, netReceipts: 0 }
  );

  const ytdPercentage =
    ytd.grossReceipts !== 0
      ? (ytd.fees / ytd.grossReceipts) * 100
      : NaN;

  return (
    <div style={{ marginTop: '40px' }}>
      <h2>PayPal – {year}</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>{year}</th>
            {months.map((month) => (
              <th key={month} style={thStyle}>
                {month}
              </th>
            ))}
            <th style={thStyle}>YTD Totals</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>Gross Receipts</td>
            {data.map((item) => (
              <td key={item.month} style={tdStyle}>
                {formatCurrency(item.grossReceipts)}
              </td>
            ))}
            <td style={tdStyle}>{formatCurrency(ytd.grossReceipts)}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Fees</td>
            {data.map((item) => (
              <td key={item.month} style={tdStyle}>
                -{formatCurrency(Math.abs(item.fees))}
              </td>
            ))}
            <td style={tdStyle}>-{formatCurrency(Math.abs(ytd.fees))}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Net Receipts</td>
            {data.map((item) => (
              <td key={item.month} style={tdStyle}>
                {formatCurrency(item.netReceipts)}
              </td>
            ))}
            <td style={tdStyle}>{formatCurrency(ytd.netReceipts)}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Percentage</td>
            {data.map((item) => (
              <td key={item.month} style={tdStyle}>
                {formatPercentage(item.percentage)}
              </td>
            ))}
            <td style={tdStyle}>{formatPercentage(ytdPercentage)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PaypalTable;
