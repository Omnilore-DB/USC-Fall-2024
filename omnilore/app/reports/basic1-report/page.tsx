'use client';

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ Import autotable correctly
import { supabase } from '@/app/supabase';

const Basic1FinancialReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportData, setReportData] = useState([]);

  const handleFromDateChange = (e) => setFromDate(e.target.value);
  const handleToDateChange = (e) => setToDate(e.target.value);

  const fetchReportData = async () => {
    if (!fromDate || !toDate) {
      alert('Please select both dates');
      return;
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', fromDate)
      .lte('date', toDate);

    if (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data');
    } else {
      console.log('Fetched data:', data);
      setReportData(data);
    }
  };

  // Calculate total amount
  const totalAmount = reportData.reduce((sum, item) => sum + Number(item.amount), 0);

  // Format date (YYYY-MM-DD -> MM/DD/YYYY)
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // ✅ Export to PDF function
  const exportPDF = () => {
    if (!reportData.length) {
      alert('No data to export');
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Basic1 Financial Report', 14, 22);

    doc.setFontSize(12);
    doc.text(`From: ${fromDate} To: ${toDate}`, 14, 30);
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 14, 36);

    const columns = [
      { header: 'Transaction ID', dataKey: 'sqsp_transaction_id' },
      { header: 'Email', dataKey: 'transaction_email' },
      { header: 'Amount', dataKey: 'amount' },
      { header: 'Date', dataKey: 'date' },
      { header: 'Payment Platform', dataKey: 'payment_platform' },
    ];

    const rows = reportData.map((item) => ({
      sqsp_transaction_id: item.sqsp_transaction_id,
      transaction_email: item.transaction_email,
      amount: `$${item.amount}`,
      date: formatDate(item.date),
      payment_platform: item.payment_platform,
    }));

    autoTable(doc, {
      columns,
      body: rows,
      startY: 45,
    });

    doc.save(`Basic1_Financial_Report_${fromDate}_to_${toDate}.pdf`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Basic1 Financial Report</h1>

      <div className="flex gap-4 mb-6">
        <div>
          <label className="block mb-1">From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            className="border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            className="border rounded p-2"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={fetchReportData}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Generate Report
          </button>

          <button
            onClick={exportPDF}
            className="bg-green-500 text-white p-2 rounded ml-2"
          >
            Export PDF
          </button>
        </div>
      </div>

      {reportData.length > 0 && (
        <>
          <div className="mb-4 font-semibold">
            Total Amount: ${totalAmount.toFixed(2)}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Transaction ID</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Amount</th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Payment Platform</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item) => (
                  <tr key={item.sqsp_transaction_id}>
                    <td className="border border-gray-300 px-4 py-2">{item.sqsp_transaction_id}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.transaction_email}</td>
                    <td className="border border-gray-300 px-4 py-2">${item.amount}</td>
                    <td className="border border-gray-300 px-4 py-2">{formatDate(item.date)}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.payment_platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {reportData.length === 0 && (
        <p className="text-gray-500">No data to display. Please select a date range and generate the report.</p>
      )}
    </div>
  );
};

export default Basic1FinancialReport;
