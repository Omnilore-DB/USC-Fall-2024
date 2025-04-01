"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://chhlncecdckfxxdcdzvz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoaGxuY2VjZGNrZnh4ZGNkenZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY0NDg0MDIsImV4cCI6MjA0MjAyNDQwMn0.T2xvdaxJjyrtOX9_d2i3TqT4NnIMAvPWekwcyfQo7gI"
);

const TreasurerReqs = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [grossData, setGrossData] = useState<Record<string, number>>({});
  const [feeData, setFeeData] = useState<Record<string, number>>({});


  const format = (v: number) =>
    v.toLocaleString("en-US", { style: "currency", currency: "USD" });
  

  const getYTDTotal = (obj: Record<string, number>, category?: string) => {
    const year = new Date(fromDate).getUTCFullYear();
    return allMonths.reduce((sum, _, i) => {
      const key = category ? `${category}-${year}-${i + 1}` : `${year}-${i + 1}`;
      return sum + (obj[key] ?? 0);
    }, 0);
  };
  

  const allMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const categories = ["MEMBERSHIP", "FORUM", "DONATION"];

  const [donors, setDonors] = useState<any[]>([]);

  const [paypalGross, setPaypalGross] = useState<Record<string, number>>({});
  const [paypalFee, setPaypalFee] = useState<Record<string, number>>({});
  const [paypalNet, setPaypalNet] = useState<Record<string, number>>({});

  const [stripeGross, setStripeGross] = useState<Record<string, number>>({});
  const [stripeFee, setStripeFee] = useState<Record<string, number>>({});
  const [stripeNet, setStripeNet] = useState<Record<string, number>>({});
  
  const handleGenerateReport = async () => {
    if (!fromDate || !toDate) return;
    setShowReport(true);
  
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const grossResults: Record<string, number> = {};
    const feeResults: Record<string, number> = {};
  
    const fetchDonors = async () => {
      const { data, error } = await supabase.rpc("get_all_donors");
      if (error) {
        console.error("Error fetching donors:", error.message);
      } else {
        console.log(" Donors fetched:", data);
        setDonors(data);
      }
    };
    


    for (const category of categories) {
      const current = new Date(start);
      while (current <= end) {
        const year = current.getUTCFullYear();
        const month = current.getUTCMonth() + 1;
        const key = `${category}-${year}-${month}`;
  
        const grossRes = await supabase.rpc("get_total_gross_by_type", {
          p_type: category,
          p_year: year,
          p_month: month,
        });
  
        const feeRes = await supabase.rpc("get_total_fee_by_type", {
          p_type: category,
          p_year: year,
          p_month: month,
        });
  
        grossResults[key] = grossRes.data ?? 0;
        feeResults[key] = feeRes.data ?? 0;
  
        current.setUTCMonth(current.getUTCMonth() + 1);
      }
    }
  
    setGrossData(grossResults);
    setFeeData(feeResults);

    const sample = new Date(fromDate);
    const baseYear = sample.getUTCFullYear();
    const pg: Record<string, number> = {};
    const pf: Record<string, number> = {};
    const pn: Record<string, number> = {};

for (let i = 0; i < 12; i++) {
  const key = `${baseYear}-${i + 1}`;
  const { data: g } = await supabase.rpc("get_paypal_gross", {
    p_year: baseYear,
    p_month: i + 1,
  });
  const { data: f } = await supabase.rpc("get_paypal_fee", {
    p_year: baseYear,
    p_month: i + 1,
  });
  const { data: n } = await supabase.rpc("get_paypal_net", {
    p_year: baseYear,
    p_month: i + 1,
  });

  pg[key] = g ?? 0;
  pf[key] = f ?? 0;
  pn[key] = n ?? 0;
}

      setPaypalGross(pg);
      setPaypalFee(pf);
      setPaypalNet(pn);
  
  const sg: Record<string, number> = {};
  const sf: Record<string, number> = {};
  const sn: Record<string, number> = {};

for (let i = 0; i < 12; i++) {
  const key = `${baseYear}-${i + 1}`;

  const { data: g } = await supabase.rpc("get_stripe_gross", {
    p_year: baseYear,
    p_month: i + 1,
  });

  const { data: f } = await supabase.rpc("get_stripe_fee", {
    p_year: baseYear,
    p_month: i + 1,
  });

  const { data: n } = await supabase.rpc("get_stripe_net", {
    p_year: baseYear,
    p_month: i + 1,
  });

  sg[key] = g ?? 0;
  sf[key] = f ?? 0;
  sn[key] = n ?? 0;
}

setStripeGross(sg);
setStripeFee(sf);
setStripeNet(sn);

await fetchDonors();

};



  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">TreasurerReqs Report</h1>

      <div className="flex items-center gap-4 mb-6">
        <div>
          <label className="mr-2 font-medium">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="mr-2 font-medium">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={handleGenerateReport}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Generate Report
        </button>
      </div>

      {showReport && (
        <>
          <h2 className="text-2xl font-bold mb-4">Squarespace</h2>
          <p className="mb-4">
            Showing report from <strong>{fromDate}</strong> to <strong>{toDate}</strong>
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th rowSpan={2} className="p-2 border font-semibold">Category</th>
                  {allMonths.map((month) => (
                    <th colSpan={4} key={month} className="p-2 border font-semibold text-center">
                      {month}
                    </th>
                  ))}
                  <th rowSpan={2} className="p-2 border font-semibold">YTD Total</th>
                </tr>
                <tr className="bg-gray-100">
                  {allMonths.map((month) => (
                    <React.Fragment key={`${month}-sub`}>
                      <th className="p-2 border font-semibold">Gross</th>
                      <th className="p-2 border font-semibold">Fees</th>
                      <th className="p-2 border font-semibold">Net</th>
                      <th className="p-2 border font-semibold">Payout</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat}>
                    <td className="p-2 border">{cat}</td>
                    {allMonths.map((month, i) => {
                      const sampleDate = new Date(fromDate);
                      const year = sampleDate.getUTCFullYear();
                      const monthNum = i + 1;
                      const key = `${cat}-${year}-${monthNum}`;

                      const gross = grossData[key] ?? 0;
                      const fee = feeData[key] ?? 0;
                      const net = gross - fee;

                      const format = (v: number) =>
                        v.toLocaleString("en-US", { style: "currency", currency: "USD" });

                      return (
                        <React.Fragment key={`${cat}-${month}`}>
                          <td className="p-2 border text-right">{format(gross)}</td>
                          <td className="p-2 border text-right">{format(fee)}</td>
                          <td className="p-2 border text-right">{format(net)}</td>
                          <td className="p-2 border"></td>
                        </React.Fragment>
                      );
                    })}
                    <td className="p-2 border font-semibold bg-green-50 text-right">
                      {format(getYTDTotal(grossData, cat) - getYTDTotal(feeData, cat))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


  {/* Paypal Section */}
  <h2 className="text-xl font-bold mb-2 mt-8">PayPal</h2>
<div className="overflow-x-auto mb-10">
  <table className="min-w-full border-collapse border">
  <thead>
  {/* Row 1: Month headers (colSpan=2 per month) + YTD */}
  <tr className="bg-green-100 text-center">
    <th className="p-2 border">Category</th>
    {allMonths.map((month) => (
      <th key={month} className="p-2 border text-center" colSpan={2}>
        {month}
      </th>
    ))}
    <th className="p-2 border text-center" rowSpan={2}>
      YTD
    </th>
  </tr>

  {/* Row 2: Sub-headers */}
  <tr className="bg-green-100 text-center">
    <th className="p-2 border"></th>
    {allMonths.map((month) => (
      <React.Fragment key={`sub-${month}`}>
        <th className="p-2 border text-center">Value</th>
        <th className="p-2 border text-center">Payout</th>
      </React.Fragment>
    ))}
  </tr>
</thead>

<tbody>
  {/* Row: Gross */}
  <tr>
    <td className="p-2 border font-semibold">Gross</td>
    {allMonths.map((month, i) => {
      const key = `${new Date(fromDate).getUTCFullYear()}-${i + 1}`;
      return (
        <React.Fragment key={`gross-${month}`}>
          <td className="p-2 border text-right">{format(paypalGross[key] ?? 0)}</td>
          <td className="p-2 border text-right"></td>
        </React.Fragment>
      );
    })}
    <td className="p-2 border text-right font-bold bg-green-50">
      {format(getYTDTotal(paypalGross))}
    </td>
  </tr>

  {/* Row: Fee */}
  <tr>
    <td className="p-2 border font-semibold">Fee</td>
    {allMonths.map((month, i) => {
      const key = `${new Date(fromDate).getUTCFullYear()}-${i + 1}`;
      return (
        <React.Fragment key={`fee-${month}`}>
          <td className="p-2 border text-right">{format(paypalFee[key] ?? 0)}</td>
          <td className="p-2 border text-right"></td>
        </React.Fragment>
      );
    })}
    <td className="p-2 border text-right font-bold bg-green-50">
      {format(getYTDTotal(paypalFee))}
    </td>
  </tr>

  {/* Row: Bank Deposit */}
  <tr className="bg-gray-50 font-semibold">
    <td className="p-2 border">Bank Deposit</td>
    {allMonths.map((month, i) => {
      const key = `${new Date(fromDate).getUTCFullYear()}-${i + 1}`;
      return (
        <React.Fragment key={`net-${month}`}>
          <td className="p-2 border text-right">{format(paypalNet[key] ?? 0)}</td>
          <td className="p-2 border text-center">
            <input type="checkbox" />
          </td>
        </React.Fragment>
      );
    })}
    <td className="p-2 border text-right font-bold bg-green-50">
      {format(getYTDTotal(paypalNet))}
    </td>
  </tr>
</tbody>
</table>
</div>

   {/* Stripe Section */}
   <h2 className="text-xl font-bold mb-2 mt-8">Stripe</h2>
<div className="overflow-x-auto mb-10">
  <table className="min-w-full border-collapse border">
    <thead>
      {/* Row 1: Month headers + YTD */}
      <tr className="bg-green-100 text-center">
        <th className="p-2 border">Category</th>
        {allMonths.map((month) => (
          <th key={month} className="p-2 border text-center" colSpan={2}>
            {month}
          </th>
        ))}
        <th className="p-2 border text-center" rowSpan={2}>
          YTD
        </th>
      </tr>
      {/* Row 2: Sub-headers */}
      <tr className="bg-green-100 text-center">
        <th className="p-2 border"></th>
        {allMonths.map((month) => (
          <React.Fragment key={`stripe-sub-${month}`}>
            <th className="p-2 border text-center">Value</th>
            <th className="p-2 border text-center">Payout</th>
          </React.Fragment>
        ))}
      </tr>
    </thead>

    <tbody>
      {/* Row: Gross */}
      <tr>
        <td className="p-2 border font-semibold">Gross</td>
        {allMonths.map((month, i) => {
          const key = `${new Date(fromDate).getUTCFullYear()}-${i + 1}`;
          return (
            <React.Fragment key={`stripe-gross-${month}`}>
              <td className="p-2 border text-right">{format(stripeGross[key] ?? 0)}</td>
              <td className="p-2 border text-right"></td>
            </React.Fragment>
          );
        })}
        <td className="p-2 border text-right font-bold bg-green-50">
          {format(getYTDTotal(stripeGross))}
        </td>
      </tr>

      {/* Row: Fee */}
      <tr>
        <td className="p-2 border font-semibold">Fee</td>
        {allMonths.map((month, i) => {
          const key = `${new Date(fromDate).getUTCFullYear()}-${i + 1}`;
          return (
            <React.Fragment key={`stripe-fee-${month}`}>
              <td className="p-2 border text-right">{format(stripeFee[key] ?? 0)}</td>
              <td className="p-2 border text-right"></td>
            </React.Fragment>
          );
        })}
        <td className="p-2 border text-right font-bold bg-green-50">
          {format(getYTDTotal(stripeFee))}
        </td>
      </tr>

      {/* Row: Net Deposit */}
      <tr className="bg-gray-50 font-semibold">
        <td className="p-2 border">Bank Deposit</td>
        {allMonths.map((month, i) => {
          const key = `${new Date(fromDate).getUTCFullYear()}-${i + 1}`;
          return (
            <React.Fragment key={`stripe-net-${month}`}>
              <td className="p-2 border text-right">{format(stripeNet[key] ?? 0)}</td>
              <td className="p-2 border text-center">
                <input type="checkbox" />
              </td>
            </React.Fragment>
          );
        })}
        <td className="p-2 border text-right font-bold bg-green-50">
          {format(getYTDTotal(stripeNet))}
        </td>
      </tr>
    </tbody>
  </table>
</div>


{/*  Annual Donation Section */}

<div className="mt-12">
  <h2 className="text-2xl font-bold mb-1"> Annual Donation</h2>
  <p className="mb-4 text-gray-600">
    Annual summary of donor contributions collected via Squarespace.
  </p>

  <div className="overflow-x-auto">
    <table className="min-w-full border text-sm text-left">
      <thead>
        <tr className="bg-green-100">
          <th className="p-2 border font-bold">Donor</th>
          <th className="p-2 border font-bold">Gift Totals</th>
          <th className="p-2 border font-bold">Date</th>
          <th className="p-2 border font-bold">Amount</th>
          <th className="p-2 border font-bold">Total</th>
          <th className="p-2 border font-bold">Address</th>
        </tr>
      </thead>
      <tbody>
        {donors.length > 0 ? (
          donors.map((donor, idx) => {
            const fullName = `${donor.first_name} ${donor.last_name}`;
            const fullAddressParts = [
              donor.street_address,
              donor.city,
              donor.state,
              donor.zip_code,
            ].filter(Boolean);
            const fullAddress = fullAddressParts.join(', ');

            const amount = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(donor.total_donation_amount || 0);

            return (
              <tr key={idx}>
                <td className="p-2 border">{fullName}</td>
                <td className="p-2 border text-right">{amount}</td>
                <td className="p-2 border text-center"></td>
                <td className="p-2 border text-right"></td>
                <td className="p-2 border text-right">{amount}</td>
                <td className="p-2 border">{fullAddress || '—'}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={6} className="p-2 border text-center text-gray-500">
              No donor data found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


        </>
      )}
    </div>
  );
};

export default TreasurerReqs;
