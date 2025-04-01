

'use client';

import { useState } from 'react';
import { supabase } from '@/app/supabase';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import SquarespaceTable from './components/SquarespaceTable';
import PaypalTable from './components/PaypalTable';
import StripeTable from './components/StripeTable';
import ReconciliationTable from './components/ReconciliationTable';
import NotesSection from './components/NotesSection';

const ReceiptsReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [squarespaceData, setSquarespaceData] = useState([]);
  const [paypalData, setPaypalData] = useState([]);
  const [stripeData, setStripeData] = useState([]);
  const [reconciliationData, setReconciliationData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const displayYear = fromDate ? new Date(fromDate).getFullYear().toString() : '----';

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const formatMonth = (date: string) => new Date(date).getMonth();

  const groupByMonth = (data: any[]) => {
    const monthly = Array.from({ length: 12 }, (_, i) => ({
      month: i,
      grossReceipts: 0,
      fees: 0,
      netReceipts: 0,
      percentage: ''
    }));

    data.forEach(tx => {
      const month = formatMonth(tx.date);
      monthly[month].grossReceipts += Number(tx.amount) || 0;
      monthly[month].fees += Number(tx.fee) || 0;
    });

    monthly.forEach((entry) => {
      entry.netReceipts = entry.grossReceipts + entry.fees;
      entry.percentage =
        entry.grossReceipts > 0
          ? `${((entry.fees / entry.grossReceipts) * -100).toFixed(2)}%`
          : '--';
    });

    return monthly;
  };

  const generateReconciliation = (
    squarespace: any[],
    paypalData: any[],
    stripeData: any[]
  ) => {
    return Array.from({ length: 12 }, (_, i) => {
      const sqsp = squarespace.filter((tx) => new Date(tx.date).getMonth() === i);
      const paypal = paypalData.filter((tx) => new Date(tx.date).getMonth() === i);
      const stripe = stripeData.filter((tx) => new Date(tx.date).getMonth() === i);

      const getSum = (arr: any[], field: string) =>
        arr.reduce((sum, tx) => sum + (Number(tx[field]) || 0), 0);

      const sqspSales = getSum(sqsp, 'amount');
      const paypalNet = getSum(paypal, 'amount') + getSum(paypal, 'fee');
      const stripeNet = getSum(stripe, 'amount') + getSum(stripe, 'fee');
      const total = paypalNet + stripeNet;

      return {
        month: i,
        netSalesSQSP: sqspSales,
        netPaypalPayout: paypalNet,
        netStripePayout: stripeNet,
        totalPayout: total,
        crossCheck: sqspSales - total
      };
    });
  };

  const handleFetch = async () => {
    if (!fromDate || !toDate) return;

    setLoading(true);

    const { data: allData, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', fromDate)
      .lte('date', toDate);

    if (error) {
      console.error('Fetch error:', error);
      setLoading(false);
      return;
    }

    const sqsp = allData.filter(
      (tx) => tx.payment_platform?.toLowerCase().trim() === 'squarespace'
    );
    const paypal = allData.filter(
      (tx) => tx.payment_platform?.toLowerCase().trim() === 'paypal'
    );
    const stripe = allData.filter(
      (tx) => tx.payment_platform?.toLowerCase().trim() === 'stripe'
    );
    
    setSquarespaceData(groupByMonth(sqsp));
    setPaypalData(groupByMonth(paypal));
    setStripeData(groupByMonth(stripe));
    setReconciliationData(generateReconciliation(sqsp, paypal, stripe));
    setTransactions(allData);
    setLoading(false);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Receipts ' + displayYear);
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, `Receipts_Report_${displayYear}.xlsx`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Receipts Report</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        <button onClick={handleFetch} style={{ backgroundColor: 'green', color: 'white', padding: '5px 10px' }}>Generate Report</button>
        <button onClick={handleExport} style={{ backgroundColor: 'royalblue', color: 'white', padding: '5px 10px' }}>Export to Excel</button>
      </div>

      <h2>Receipts Report - {displayYear}</h2>

      {loading && <div>Loading Receipts Report...</div>}

{!loading && transactions.length > 0 && (
  <>
    <SquarespaceTable data={squarespaceData} year={displayYear} />
    <PaypalTable data={paypalData} year={displayYear} />
    <StripeTable data={stripeData} year={displayYear} />
    <ReconciliationTable data={reconciliationData} year={displayYear} />
    <NotesSection
      notes={[
        '(1) If TOTAL PAYOUT does not add up to Net Sales SQSP + TOTAL FEES, field will flag cross-check error',
        '(2) Column B can be hidden after confirming formulae',
        "(3) These fields don’t balance since they’re payouts from Payment Processors including donations but the SQSP reports do not.",
        '(4) Donations added to SQSP not shown on PayPal',
      ]}
    />
  </>
)}

    </div>
  );
};

export default ReceiptsReport;
