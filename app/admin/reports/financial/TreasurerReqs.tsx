"use client";

import React, { useState } from "react";
import { supabase } from "@/app/supabase";

const TreasurerReqs = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [grossData, setGrossData] = useState<Record<string, number>>({});
  const [feeData, setFeeData] = useState<Record<string, number>>({});

  const [paypalGross, setPaypalGross] = useState<Record<string, number>>({});
  const [paypalFee, setPaypalFee] = useState<Record<string, number>>({});
  const [paypalNet, setPaypalNet] = useState<Record<string, number>>({});
  const [paypalPayout, setPaypalPayout] = useState<Record<string, number>>({});

  const [stripeGross, setStripeGross] = useState<Record<string, number>>({});
  const [stripeFee, setStripeFee] = useState<Record<string, number>>({});
  const [stripeNet, setStripeNet] = useState<Record<string, number>>({});
  const [stripePayout, setStripePayout] = useState<Record<string, number>>({});

  const [donors, setDonors] = useState<any[]>([]);

  const [triggerPresetReport, setTriggerPresetReport] = useState(false);
  const [monthsInRange, setMonthsInRange] = useState<{ year: number; month: number }[]>([]);

  const categories = ["MEMBERSHIP", "FORUM", "DONATION"];

  const format = (v: number) =>
    v.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const handleGenerateReport = async () => {
    if (!fromDate || !toDate) return;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffMonths = (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + (end.getUTCMonth() - start.getUTCMonth());
    if (diffMonths > 11) {
      alert("Please select a date range that is less than a year");
      return;
    }
    setShowReport(true);

    const range: {year: number; month: number }[] = [];
    const loop = new Date(start);
    while (loop <= end) {
      range.push({
        year: loop.getUTCFullYear(),
        month: loop.getUTCMonth() + 1,
      });
      loop.setUTCMonth(loop.getUTCMonth() + 1);
    }
    setMonthsInRange(range);

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

    const grossFeePromises = [];

    for (const category of categories) {
      for (const { year, month } of range) {
        const key = `${category}-${year}-${month}`;
        grossFeePromises.push(
          Promise.all([
            supabase.rpc("get_total_gross_by_type", { p_type: category, p_year: year, p_month: month }),
            supabase.rpc("get_total_fee_by_type", { p_type: category, p_year: year, p_month: month }),
          ]).then(([grossRes, feeRes]) => {
            grossResults[key] = grossRes.data ?? 0;
            feeResults[key] = feeRes.data ?? 0;
          })
        );
      }
    }

    await Promise.all(grossFeePromises);


    setGrossData(grossResults);
    setFeeData(feeResults);

    const paypal_gross: Record<string, number> = {};
    const paypal_fee: Record<string, number> = {};
    const paypal_net: Record<string, number> = {};
    const paypal_payout: Record<string, number> = {};

    await Promise.all(range.map(({ year, month }) => {
      const key = `${year}-${month}`;
      return Promise.all([
        supabase.rpc("get_paypal_gross", { p_year: year, p_month: month }),
        supabase.rpc("get_paypal_fee", { p_year: year, p_month: month }),
        supabase.rpc("get_paypal_net", { p_year: year, p_month: month }),
        supabase.rpc("get_paypal_payout_total", { p_year: year, p_month: month }),
      ]).then(([g, f, n, ppo]) => {
        paypal_gross[key] = g.data ?? 0;
        paypal_fee[key] = f.data ?? 0;
        paypal_net[key] = n.data ?? 0;
        paypal_payout[key] = ppo.data ?? 0;
      });
    }));
    

    setPaypalGross(paypal_gross);
    setPaypalFee(paypal_fee);
    setPaypalNet(paypal_net);
    setPaypalPayout(paypal_payout);

    const stripe_gross: Record<string, number> = {};
    const stripe_fee: Record<string, number> = {};
    const stripe_net: Record<string, number> = {};
    const stripe_payout: Record<string, number> = {};

    await Promise.all(range.map(({ year, month }) => {
      const key = `${year}-${month}`;
      return Promise.all([
        supabase.rpc("get_stripe_gross", { p_year: year, p_month: month }),
        supabase.rpc("get_stripe_fee", { p_year: year, p_month: month }),
        supabase.rpc("get_stripe_net", { p_year: year, p_month: month }),
        supabase.rpc("get_stripe_payout_total", { p_year: year, p_month: month }),
      ]).then(([g, f, n, p]) => {
        stripe_gross[key] = g.data ?? 0;
        stripe_fee[key] = f.data ?? 0;
        stripe_net[key] = n.data ?? 0;
        stripe_payout[key] = p.data ?? 0;
      });
    }));

    setStripeGross(stripe_gross);
    setStripeFee(stripe_fee);
    setStripeNet(stripe_net);
    setStripePayout(stripe_payout);

    await fetchDonors();
  };

  const getTotalLabel = () => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
  
    const isJan1 = start.getUTCMonth() === 0 && start.getUTCDate() === 1;
    const isDec31 = end.getUTCMonth() === 11 && end.getUTCDate() === 31;
    const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  
    return isJan1 && isDec31 && sameYear
      ? `${start.getUTCFullYear()} YTD Total`
      : "Date Range Total";
  };  

  const getRangeTotal = (obj: Record<string, number>) => {
    return monthsInRange.reduce((sum, { year, month }) => {
      const key = `${year}-${month}`;
      return sum + (obj[key] ?? 0);
    }, 0);
  };

  const getCatRangeTotal = (obj: Record<string, number>, cat: string) => {
    return monthsInRange.reduce((sum, { year, month }) => {
      const key = `${cat}-${year}-${month}`;
      return sum + (obj[key] ?? 0);
    }, 0);
  };

  const handlePresetRange = (year: number) => {
    const start = `${year}-01-01`;
    const end = `${year}-12-31`;
  
    setFromDate(start);
    setToDate(end);
    setTriggerPresetReport(true); // This will cause useEffect to fire after state updates
  };

  React.useEffect(() => {
    if (triggerPresetReport && fromDate && toDate) {
      handleGenerateReport();
      setTriggerPresetReport(false); // reset the flag
    }
  }, [triggerPresetReport, fromDate, toDate]);

  return (
    <div className="p-8">
      <h1 className="mb-6 bg-green-50 text-3xl font-bold">
        Treasurer's Report
      </h1>

      <div className="mb-6 flex flex-wrap items-center gap-4 bg-green-50">
        {/* From Date */}
        <div>
          <label className="mr-2 bg-green-50 font-medium">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded border p-2"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="mr-2 bg-green-50 font-medium">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded border p-2"
          />
        </div>

        {/* Generate Report */}
        <button
          onClick={handleGenerateReport}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Generate Report
        </button>

        {/* Preset Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Presets:</span>
          <button
            onClick={() => handlePresetRange(2023)}
            className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
          >
            2023
          </button>
          <button
            onClick={() => handlePresetRange(2024)}
            className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
          >
            2024
          </button>
        </div>
      </div>


      {showReport && (
        <>
          <p className="mb-4">
            Showing report from <strong>{fromDate}</strong> to{" "}
            <strong>{toDate}</strong>
          </p>
          <h2 className="mb-4 bg-green-50 text-2xl font-bold">Squarespace</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border text-left text-sm">
              <thead>
                <tr className="bg-green-50">
                  <th rowSpan={2} className="border p-2">
                    Category
                  </th>
                  {monthsInRange.map(({year, month}) => (
                    <th
                      colSpan={3}
                      key={`${year}-${month}`}
                      className="border p-2 text-center"
                    >
                      {new Date(year, month - 1).toLocaleString("default", { month: "short", year: "numeric" })}
                      {/* {month} */}
                    </th>
                  ))}
                  <th rowSpan={2} className="border p-2 text-center">
                    {getTotalLabel()}
                  </th>
                </tr>
                <tr className="bg-gray-100">
                  {monthsInRange.map(({year, month}) => (
                    <React.Fragment key={`sub-${year}-${month}`}>
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
                      <td className="border p-2">{cat}</td>
                      {allMonths.map((month, i) => {
                        const sampleDate = new Date(fromDate);
                        const year = sampleDate.getUTCFullYear();
                        const monthNum = i + 1;
                        const key = `${cat}-${year}-${monthNum}`;

                        const gross = grossData[key] ?? 0;
                        const fee = feeData[key] ?? 0;
                        const net = gross - fee;

                        const format = (v: number) =>
                          v.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          });

                        return (
                          <React.Fragment key={`${cat}-${month}`}>
                            <td className="border p-2 text-right">
                              {format(gross)}
                            </td>
                            <td className="border p-2 text-right">
                              {format(fee)}
                            </td>
                            <td className="border p-2 text-right">
                              {format(net)}
                            </td>
                          </React.Fragment>
                        );
                      })}
                      <td className="border bg-green-50 p-2 text-right">
                        {format(
                          getYTDTotal(grossData, cat) -
                            getYTDTotal(feeData, cat),
                        )}
                      </td>
                    </tr>

                    {cat === "DONATION" && (
                      <tr className="bg-green-50">
                        <td className="border p-2">Bank Confirmation</td>
                        {allMonths.map((month) => (
                          <td
                            key={`confirm-${month}`}
                            className="border p-2 text-center"
                            colSpan={3}
                          >
                            <input type="checkbox" className="h-4 w-4" />
                          </td>
                        ))}
                        <td className="border p-2"></td> {/* YTD cell */}
                      </tr>
                    )}
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
                  {monthsInRange.map(({year, month}) => (
                    <th 
                      key={`paypal-head-${year}-${month}`} 
                      className="border p-2 text-center"
                    >
                      {new Date(year, month - 1).toLocaleString("default", { 
                        month: "short", 
                        year: "numeric" })}
                    </th>
                  ))}
                  <th className="border p-2 text-center">{getTotalLabel()}</th>
                </tr>
              </thead>

              <tbody>
                {/* Row: Gross */}
                <tr>
                  <td className="border p-2 font-semibold">Gross</td>
                  {monthsInRange.map(({year, month}) => {
                    const key = `${year}-${month}`;
                    return (
                      <React.Fragment key={`gross-${year}-${month}`}>
                        <td className="border p-2 text-right">
                          {format(paypalGross[key] ?? 0)}
                        </td>
                      </React.Fragment>
                    );
                  })}
                  <td className="border bg-green-50 p-2 text-right font-bold">
                    {format(getRangeTotal(paypalGross))}
                  </td>
                </tr>

                {/* Row: Fee */}
                <tr>
                  <td className="border p-2 font-semibold">Fee</td>
                  {monthsInRange.map(({year, month}) => {
                    const key = `${year}-${month}`;
                    return (
                      <React.Fragment key={`fee-${year}-${month}`}>
                        <td className="border p-2 text-right">
                          {format(paypalFee[key] ?? 0)}
                        </td>
                      </React.Fragment>
                    );
                  })}
                  <td className="border bg-green-50 p-2 text-right font-bold">
                    {format(getRangeTotal(paypalFee))}
                  </td>
                </tr>

                {/* Row: Payout */}
                <tr className="bg-gray-50 font-semibold">
                  <td className="border p-2">Payout</td>

                  {monthsInRange.map(({year, month}) => {
                    const key = `${year}-${month}`;
                    return (
                      <td
                        key={`net-${month}`}
                        className="border p-2 text-right"
                      >
                        {format(paypalPayout[key] ?? 0)}
                      </td>
                    );
                  })}

                  <td className="border bg-green-50 p-2 text-right font-bold">
                    {format(getYTDTotal(paypalPayout))}
                  </td>
                </tr>

                {/* Row: Bank Confirmation */}
                <tr className="bg-green-50 font-semibold">
                  <td className="border p-2 font-semibold">
                    Bank Confirmation
                  </td>
                  {monthsInRange.map(({year, month}) => {
                    const key = `${year}-${month}`;
                    return (
                      <React.Fragment key={`paypal-confirm-${year}-${month}`}>
                      <td className="border p-2 text-center">
                        <input type="checkbox" className="mt-1 h-4 w-4" />
                      </td>
                    </React.Fragment>
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
                  {monthsInRange.map(({year, month}) => (
                    <th
                      key={`stripe-head-${year}-${month}`}
                      className="border p-2 text-center"
                    >
                      {new Date(year, month - 1).toLocaleString("default", {
                        month: "short",
                        year: "numeric",
                      })}
                    </th>
                  ))}
                  <th className="border p-2 text-center">{getTotalLabel()}</th>
                </tr>
              </thead>

              <tbody>
                {/* Row: Gross */}
                <tr>
                  <td className="border p-2 font-semibold">Gross</td>
                  {monthsInRange.map(({ year, month }) => {
                    const key = `${year}-${month}`;
                    return (
                      <React.Fragment key={`stripe-gross-${year}-${month}`}>
                        <td className="border p-2 text-right">
                          {format(stripeGross[key] ?? 0)}
                        </td>
                      </React.Fragment>
                    );
                  })}
                  <td className="border bg-green-50 p-2 text-right font-bold">
                    {format(getRangeTotal(stripeGross))}
                  </td>
                </tr>

                {/* Row: Fee */}
                <tr>
                  <td className="border p-2 font-semibold">Fee</td>
                  {monthsInRange.map(({year, month}) => {
                    const key = `${year}-${month}`;
                    return (
                      <React.Fragment key={`stripe-fee-${month}`}>
                        <td className="border p-2 text-right">
                          {format(stripeFee[key] ?? 0)}
                        </td>
                      </React.Fragment>
                    );
                  })}
                  <td className="border bg-green-50 p-2 text-right font-bold">
                    {format(getRangeTotal(stripeFee))}
                  </td>
                </tr>

                {/* Row: Payout */}
                <tr className="bg-gray-50 font-semibold">
                  <td className="border p-2">Bank Deposit</td>
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
                    {format(getYTDTotal(stripePayout))}
                  </td>
                </tr>

                {/* Row: Bank Confirmation */}
                <tr className="bg-green-50 font-semibold">
                  <td className="border p-2">Bank Confirmation</td>
                  {monthsInRange.map((year, month) => {
                    return (
                      <React.Fragment key={`stripe-confirm-${year}-${month}`}>
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
