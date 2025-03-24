'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button'; 
import * as XLSX from 'xlsx';
import { supabase } from '@/app/supabase';

const PayoutsReport: React.FC = () => {
  const [transactions, setTransactions] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    console.log('Fetching transactions...');

    const { data, error } = await supabase
      .from('transactions')
      .select('date, amount, payment_platform');

    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }

    console.log('Fetched transactions:', data);
    setTransactions(data);

    const report = generateFinancialReport(data);
    setTableData(report);
  };

  const generateFinancialReport = (transactions: any[]) => {
    const platforms = ['PAYPAL', 'STRIPE'];
    const monthlySums = { PAYPAL: Array(12).fill(0), STRIPE: Array(12).fill(0) };
    const payoutDates = { PAYPAL: Array(12).fill(null), STRIPE: Array(12).fill(null) };

    transactions.forEach(tx => {
      const platform = tx.payment_platform?.toUpperCase();
      if (!platforms.includes(platform)) return;

      const dt = new Date(tx.date);
      const month = dt.getMonth(); 
      monthlySums[platform][month] += Number(tx.amount);

      if (!payoutDates[platform][month] || dt > payoutDates[platform][month]) {
        payoutDates[platform][month] = dt;
      }
    });

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const headerRow = [''].concat(monthLabels, 'YTD Total');

    const paypalDatesRow = ['PayPal - Date Initiated'];
    const paypalConfirmRow = ['PayPal - Bank Confirm'];
    const paypalAmountRow = ['PayPal - Payout'];
    const stripeDatesRow = ['Stripe - Date Initiated'];
    const stripeConfirmRow = ['Stripe - Bank Confirm'];
    const stripeAmountRow = ['Stripe - Payout'];
    const totalRow = ['Total Payouts'];

    for (let i = 0; i < 12; i++) {
      const dtPayPal = payoutDates.PAYPAL[i];
      const dtStripe = payoutDates.STRIPE[i];

      paypalDatesRow.push(dtPayPal ? dtPayPal.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '');
      paypalConfirmRow.push(monthlySums.PAYPAL[i] > 0 ? '✓' : '');
      paypalAmountRow.push(monthlySums.PAYPAL[i] !== 0 ? `$${monthlySums.PAYPAL[i].toFixed(2)}` : '');

      stripeDatesRow.push(dtStripe ? dtStripe.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '');
      stripeConfirmRow.push(monthlySums.STRIPE[i] > 0 ? '✓' : '');
      stripeAmountRow.push(monthlySums.STRIPE[i] !== 0 ? `$${monthlySums.STRIPE[i].toFixed(2)}` : '');

      const total = monthlySums.PAYPAL[i] + monthlySums.STRIPE[i];
      totalRow.push(total !== 0 ? `$${total.toFixed(2)}` : '');
    }

    const paypalYTD = monthlySums.PAYPAL.reduce((a, b) => a + b, 0);
    const stripeYTD = monthlySums.STRIPE.reduce((a, b) => a + b, 0);
    const totalYTD = paypalYTD + stripeYTD;

    paypalDatesRow.push('');
    paypalConfirmRow.push(paypalYTD > 0 ? '✓' : '');
    paypalAmountRow.push(`$${paypalYTD.toFixed(2)}`);

    stripeDatesRow.push('');
    stripeConfirmRow.push(stripeYTD > 0 ? '✓' : '');
    stripeAmountRow.push(`$${stripeYTD.toFixed(2)}`);

    totalRow.push(`$${totalYTD.toFixed(2)}`);

    const commentsRow = ['Comments:'].concat(Array(12).fill(''), '');

    return [
      headerRow,
      paypalDatesRow,
      paypalConfirmRow,
      paypalAmountRow,
      stripeDatesRow,
      stripeConfirmRow,
      stripeAmountRow,
      totalRow,
      commentsRow,
    ];
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payout Report');
    XLSX.writeFile(workbook, 'PayoutsReport.xlsx');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Payouts Report</h1>
      <h2 className="text-md text-gray-600 mb-4">Data Source: db.omnilore.org</h2>

      <div className="mb-4">
        <Button onClick={exportToExcel} className="bg-blue-600 hover:bg-blue-700 text-white">
          Export to Excel
        </Button>
      </div>

      <div className="border rounded-lg overflow-auto">
        <table className="min-w-full text-sm border-collapse border">
          <thead>
            <tr>
              {tableData[0]?.map((header, idx) => (
                <th key={idx} className="border px-4 py-2 font-semibold text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.slice(1).map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="border px-4 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutsReport;
