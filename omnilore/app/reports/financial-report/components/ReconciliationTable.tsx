import React from 'react';

interface ReconciliationData {
  month: number;
  netSalesSQSP: number;
  netPaypalPayout: number;
  netStripePayout: number;
  totalPayout: number;
  crossCheck: number;
}

interface ReconciliationTableProps {
  data: ReconciliationData[];
  year: string;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ReconciliationTable: React.FC<ReconciliationTableProps> = ({ data, year }) => {
  const totals = data.reduce(
    (acc, row) => {
      acc.sqsp += row.netSalesSQSP;
      acc.paypal += row.netPaypalPayout;
      acc.stripe += row.netStripePayout;
      acc.total += row.totalPayout;
      acc.cross += row.crossCheck;
      return acc;
    },
    { sqsp: 0, paypal: 0, stripe: 0, total: 0, cross: 0 }
  );

  return (
    <div style={{ marginTop: '40px' }}>
      <h2>Reconciliation</h2>
      <h4>{year}</h4>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Month</th>
            {months.map((m, i) => (
              <th style={thStyle} key={i}>{m}</th>
            ))}
            <th style={thStyle}>YTD Totals</th>
          </tr>
        </thead>
        <tbody>
          {['netSalesSQSP', 'netPaypalPayout', 'netStripePayout', 'totalPayout', 'crossCheck'].map((field, idx) => (
            <tr key={idx}>
              <td style={rowHeaderStyle}>
                {{
                  netSalesSQSP: 'Net Sales SQSP',
                  netPaypalPayout: 'Net PayPal Payout',
                  netStripePayout: 'Net Stripe Payout',
                  totalPayout: 'Total Payout',
                  crossCheck: 'Cross Check Net Sales - Fees',
                }[field as keyof ReconciliationData]}
              </td>
              {data.map((row, i) => (
                <td style={tdStyle} key={i}>
                  {formatCurrency(row[field as keyof ReconciliationData] as number)}
                </td>
              ))}
              <td style={tdStyle}>
                {formatCurrency(
                  field === 'netSalesSQSP' ? totals.sqsp
                  : field === 'netPaypalPayout' ? totals.paypal
                  : field === 'netStripePayout' ? totals.stripe
                  : field === 'totalPayout' ? totals.total
                  : totals.cross
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const formatCurrency = (value: number | undefined | null) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '$0.00';
  }
  return `$${value.toFixed(2)}`;
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '10px',
};

const thStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '6px',
  backgroundColor: '#eaf3e6',
  fontWeight: 'bold',
  textAlign: 'center',
};

const tdStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '6px',
  textAlign: 'right',
};

const rowHeaderStyle: React.CSSProperties = {
  ...tdStyle,
  fontWeight: 'bold',
  textAlign: 'left',
};

export default ReconciliationTable;
