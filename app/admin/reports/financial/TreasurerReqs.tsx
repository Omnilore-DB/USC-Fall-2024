"use client";

/* TODO:

Make sure skipping fulfilled
Make sure all amounts from payouts table is divided by 100 (it comes in cents not dollars)
(dont do this rn) -> Make sure all the month table columns align / same width (already good for paypal and stripe but need to make it same width as squarespace)
  - About that I think this could be kinda difficult it depends on if we wanna do it completley dynamically or just hardcode some widths that seem like
  - they would fit the UI well (thats probably the best option)
Don't focus too much on styles (besides the width thing because hopefully Tais can make a better UI)
Maybe improve variable names so it is more readable

Follow my comments to help improve cohesiveness

*/

import React, { useState } from "react";
import { supabase } from "@/app/supabase";

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
      const key = category
        ? `${category}-${year}-${i + 1}`
        : `${year}-${i + 1}`;
      return sum + (obj[key] ?? 0);
    }, 0);
  };

  const allMonths = [
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

  const categories = ["MEMBERSHIP", "FORUM", "DONATION"];

  const [donors, setDonors] = useState<any[]>([]);

  const [paypalGross, setPaypalGross] = useState<Record<string, number>>({});
  const [paypalFee, setPaypalFee] = useState<Record<string, number>>({});
  const [paypalNet, setPaypalNet] = useState<Record<string, number>>({});
  const [paypalPayout, setPaypalPayout] = useState<Record<string, number>>({});

  const [stripeGross, setStripeGross] = useState<Record<string, number>>({});
  const [stripeFee, setStripeFee] = useState<Record<string, number>>({});
  const [stripeNet, setStripeNet] = useState<Record<string, number>>({});
  const [stripePayout, setStripePayout] = useState<Record<string, number>>({});

  const handleGenerateReport = async () => {
    if (!fromDate || !toDate) return;
    setShowReport(true);

    const start = new Date(fromDate);
    const end = new Date(toDate);
    const grossResults: Record<string, number> = {};
    const feeResults: Record<string, number> = {};

    const fetchDonors = async () => {
      const { data, error } = await supabase.rpc("get_donation_history", {
        start_date: fromDate,
        end_date: toDate,
      });

      if (error) {
        console.error("Error fetching donors:", error.message);
      } else {
        console.log("Donors fetched:", data);

        const grouped = data.reduce(
          (acc, item) => {
            const key = item.member_id;
            if (!acc[key]) {
              acc[key] = {
                member_id: item.member_id,
                first_name: item.first_name,
                last_name: item.last_name,
                street_address: item.street_address,
                city: item.city,
                state: item.state,
                zip_code: item.zip_code,
                donations: [],
                total_donation_amount: 0,
              };
            }

            acc[key].donations.push({
              date: item.donation_date,
              amount: item.donation_amount,
            });

            acc[key].total_donation_amount += item.donation_amount;

            return acc;
          },
          {} /* what is the final type of this? cast it with as SomeType (not any pls)*/,
        );

        setDonors(Object.values(grouped));
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
    const pp: Record<string, number> = {};

    for (let i = 0; i < 12; i++) {
      const key = `${baseYear}-${i + 1}`;

      // change this from using rpc to just doing one payouts table query where 'date' column is between the start and end date then we can use JS/TS to do all of this instead of asking database 48 times
      const { data: g } = await supabase.rpc("get_paypal_gross", {
        p_year: baseYear,
        p_month: i + 1,
      });
      const { data: f } = await supabase.rpc("get_paypal_fee", {
        p_year: baseYear,
        p_month: i + 1,
      });

      const { data: ppo } = await supabase.rpc("get_paypal_payout_total", {
        p_year: baseYear,
        p_month: i + 1,
      });
      pp[key] = ppo ?? 0;

      const { data: n } = await supabase.rpc("get_paypal_net", {
        p_year: baseYear,
        p_month: i + 1,
      });

      pg[key] = g ?? 0;
      pf[key] = f ?? 0;
      pn[key] = n ?? 0;
      pp[key] = ppo ?? 0;
    }

    setPaypalGross(pg);
    setPaypalFee(pf);
    setPaypalNet(pn);
    setPaypalPayout(pp);

    const sg: Record<string, number> = {};
    const sf: Record<string, number> = {};
    const sn: Record<string, number> = {};
    const sp: Record<string, number> = {};

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

      const { data: p } = await supabase.rpc("get_stripe_payout_total", {
        p_year: baseYear,
        p_month: i + 1,
      });

      sg[key] = g ?? 0;
      sf[key] = f ?? 0;
      sn[key] = n ?? 0;
      sp[key] = p ?? 0;
    }

    setStripeGross(sg);
    setStripeFee(sf);
    setStripeNet(sn);
    setStripePayout(sp);

    await fetchDonors();
  };

  return (
    <div className="p-8">
      <h1 className="mb-6 bg-green-50 text-3xl font-bold">
        TreasurerReqs Report
      </h1>

      <div className="mb-6 flex items-center gap-4 bg-green-50">
        <div>
          <label className="mr-2 bg-green-50 font-medium">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded border p-2"
          />
        </div>
        <div>
          <label className="mr-2 bg-green-50 font-medium">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded border p-2"
          />
        </div>
        <button
          onClick={handleGenerateReport}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Generate Report
        </button>
      </div>

      {showReport && (
        <>
          <h2 className="mb-4 bg-green-50 text-2xl font-bold">Squarespace</h2>
          <p className="mb-4">
            Showing report from <strong>{fromDate}</strong> to{" "}
            <strong>{toDate}</strong>
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border text-left text-sm">
              <thead>
                <tr className="bg-green-50">
                  <th rowSpan={2} className="border p-2">
                    Category
                  </th>
                  {allMonths.map((month) => (
                    <th
                      colSpan={3}
                      key={month}
                      className="border p-2 text-center"
                    >
                      {month}
                    </th>
                  ))}
                  <th rowSpan={2} className="border p-2">
                    YTD Total
                  </th>
                </tr>
                <tr className="bg-gray-100">
                  {allMonths.map((month) => (
                    <React.Fragment key={`${month}-sub`}>
                      <th className="border bg-green-50 p-2">Gross</th>
                      <th className="border bg-green-50 p-2">Fees</th>
                      <th className="border bg-green-50 p-2">Net</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>

              <tbody>
                  {categories.map((cat) => (
                    <React.Fragment key={cat}>
                      {/* Main data row */}
                      <tr>
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
                              <td className="p-2 border text-right ">{format(gross)}</td>
                              <td className="p-2 border text-right">{format(fee)}</td>
                              <td className="p-2 border text-right">{format(net)}</td>
                            </React.Fragment>
                          );
                        })}
                        <td className="p-2 border  bg-green-50 text-right">
                          {format(getYTDTotal(grossData, cat) - getYTDTotal(feeData, cat))}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          
          {/* Paypal Section */}
          <h2 className="mb-2 mt-8 text-xl font-bold">PayPal</h2>
          <div className="mb-10 overflow-x-auto">
            <table className="min-w-full border-collapse border">
              <thead>
                {/* Row 1: Month headers + YTD */}
                <tr className="bg-green-100 text-center">
                  <th className="border bg-green-50 p-2">Category</th>
                  {allMonths.map((month) => (
                    <th key={month} className="border p-2 text-center">
                      {month}
                    </th>
                  ))}
                  <th className="border p-2 text-center">YTD</th>
                </tr>
              </thead>

              <tbody>
                {/* Row: Gross */}
                <tr>
                  <td className="border p-2 font-semibold">Gross</td>
                  {allMonths.map((month, i) => {
                    const key = `${new Date(fromDate).getUTCFullYear()}-${i + 1}`;
                    return (
                      <React.Fragment key={`gross-${month}`}>
                        <td className="border p-2 text-right">
                          {format(paypalGross[key] ?? 0)}
                        </td>
                      </React.Fragment>
                    );
                  })}
                  <td className="border bg-green-50 p-2 text-right font-bold">
                    {format(getYTDTotal(paypalGross))}
                  </td>
                </tr>

                {/* Row: Fee */}
                <tr>
                  <td className="border p-2 font-semibold">Fee</td>
                  {allMonths.map((month, i) => {
                    const key = `${new Date(fromDate).getUTCFullYear()}-${i + 1}`;
                    return (
                      <React.Fragment key={`fee-${month}`}>
                        <td className="border p-2 text-right">
                          {format(paypalFee[key] ?? 0)}
                        </td>
                      </React.Fragment>
                    );
                  })}
                  <td className="border bg-green-50 p-2 text-right font-bold">
                    {format(getYTDTotal(paypalFee))}
                  </td>
                </tr>

                {/* Row: Payout */}
                <tr className="bg-gray-50 font-semibold">
                  <td className="border p-2">Payout</td>

                  {allMonths.map((month, i) => {
                    const key = `${new Date(fromDate).getUTCFullYear()}-${i + 1}`;
                    return (
                      <td
                        key={`net-${month}`}
                        className="border p-2 text-right"
                      >
                        {format((paypalPayout[key] ?? 0) / 100)}
                      </td>
                    );
                  })}

                  <td className="border bg-green-50 p-2 text-right font-bold">
                    {format(getYTDTotal(paypalPayout) / 100)}
                  </td>
                </tr>

                {/* Row: Bank Confirmation */}
                <tr className="bg-green-50 font-semibold">
                  <td className="border p-2 font-semibold">
                    Bank Confirmation
                  </td>
                  {allMonths.map((month, i) => {
                    const key = `${new Date(fromDate).getUTCFullYear()}-${i + 1}`;
                    return (
                      <td
                        key={`paypal-confirm-${month}`}
                        className="border p-2 text-center"
                      >
                        <input type="checkbox" className="mt-1 h-4 w-4" />
                      </td>
                    );
                  })}
                  <td className="border bg-green-50 p-2 text-right font-bold"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Stripe Section */}
          <h2 className="mb-2 mt-8 text-xl font-bold">Stripe</h2>
          <div className="mb-10 overflow-x-auto">
            <table className="min-w-full border-collapse border">
              <thead>
                {/* Row 1: Month headers + YTD */}
                <tr className="bg-green-100 text-center">
                  <th className="border p-2">Category</th>
                  {allMonths.map((month) => (
                    <th key={month} className="border p-2 text-center">
                      {month}
                    </th>
                  ))}
                  <th className="border p-2 text-center">YTD</th>
                </tr>
              </thead>

              <tbody>
                {/* Row: Gross */}
                <tr>
                  <td className="border p-2 font-semibold">Gross</td>
                  {allMonths.map((month, i) => {
                    const key = `${new Date(fromDate).getUTCFullYear()}-${i + 1}`;
                    return (
                      <React.Fragment key={`stripe-gross-${month}`}>
                        <td className="border p-2 text-right">
                          {format(stripeGross[key] ?? 0)}
                        </td>
                      </React.Fragment>
                    );
                  })}
                  <td className="border bg-green-50 p-2 text-right font-bold">
                    {format(getYTDTotal(stripeGross))}
                  </td>
                </tr>

                {/* Row: Fee */}
                <tr>
                  <td className="border p-2 font-semibold">Fee</td>
                  {allMonths.map((month, i) => {
                    const key = `${new Date(fromDate).getUTCFullYear()}-${i + 1}`;
                    return (
                      <React.Fragment key={`stripe-fee-${month}`}>
                        <td className="border p-2 text-right">
                          {format(stripeFee[key] ?? 0)}
                        </td>
                      </React.Fragment>
                    );
                  })}
                  <td className="border bg-green-50 p-2 text-right font-bold">
                    {format(getYTDTotal(stripeFee))}
                  </td>
                </tr>

                {/* Row: Payout */}
                <tr className="bg-gray-50 font-semibold">
                  <td className="border p-2">Payout</td>
                  {allMonths.map((month, i) => {
                    const key = `${new Date(fromDate).getUTCFullYear()}-${i + 1}`;
                    return (
                      <React.Fragment key={`stripe-net-${month}`}>
                        <td className="border p-2 text-right">
                          {format((stripePayout[key] ?? 0) / 100)}
                        </td>
                      </React.Fragment>
                    );
                  })}
                  <td className="border bg-green-50 p-2 text-right font-bold">
                    {format(getYTDTotal(stripePayout) / 100)}
                  </td>
                </tr>

                {/* Row: Bank Confirmation */}
                <tr className="bg-green-50 font-semibold">
                  <td className="border p-2">Bank Confirmation</td>
                  {allMonths.map((month, i) => {
                    const key = `${new Date(fromDate).getUTCFullYear()}-${i + 1}`;
                    return (
                      <React.Fragment key={`stripe-confirm-${month}`}>
                        <td className="border p-2 text-center">
                          <input type="checkbox" className="mt-1 h-4 w-4" />
                        </td>
                      </React.Fragment>
                    );
                  })}
                  {/* YTD Total */}
                  <td className="border bg-green-50 p-2 text-right font-bold"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/*  Annual Donation Section */}

          <div className="mt-12">
            <h2 className="mb-1 text-2xl font-bold"> Annual Donation</h2>
            <p className="mb-4 text-gray-600">
              Annual summary of donor contributions collected via Squarespace.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full border text-left text-sm">
                <thead>
                  <tr className="bg-green-100">
                    <th className="border p-2 font-bold">Donor</th>
                    <th className="border p-2 font-bold">Gift Totals</th>
                    <th className="border p-2 font-bold">Date</th>
                    <th className="border p-2 font-bold">Amount</th>
                    <th className="border p-2 font-bold">Total</th>
                    <th className="border p-2 font-bold">Address</th>
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
                      const fullAddress = fullAddressParts.join(", ");

                      const total = new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(donor.total_donation_amount || 0);

                      return (
                        <React.Fragment key={idx}>
                          {/* Donor summary row */}
                          <tr className="bg-gray-50 font-semibold">
                            <td className="border p-2">{fullName}</td>
                            <td className="border p-2 text-right">{total}</td>
                            <td className="border p-2"></td>
                            <td className="border p-2"></td>
                            <td className="border p-2 text-right">{total}</td>
                            <td className="border p-2">{fullAddress || "—"}</td>
                          </tr>

                          {/* Donation rows */}
                          {console.log("🔍 donor.donations", donor.donations)}
                          {donor.donations?.map((donation, i) => (
                            <tr key={`${donor.member_id}-${i}`}>
                              <td className="border p-2"></td>
                              <td className="border p-2 text-right"></td>
                              <td className="border p-2 text-center">
                                {new Date(donation.date).toLocaleDateString()}
                              </td>
                              <td className="border p-2 text-right">
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                }).format(donation.amount || 0)}
                              </td>
                              <td className="border p-2 text-right"></td>
                              <td className="border p-2"></td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="border p-2 text-center text-gray-500"
                      >
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
