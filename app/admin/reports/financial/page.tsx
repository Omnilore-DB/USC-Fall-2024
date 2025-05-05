"use client";
import type { SupabasePayout } from "@/app/api/cron/src/supabase/types";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { supabase, getRoles } from "@/app/supabase";
import React, { useState, useEffect } from "react";
import { Temporal } from "temporal-polyfill";
import { updatePayout } from "./actions";
import { toast } from "sonner";
import * as XLSX from "xlsx";

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

  const [customRange, setCustomRange] = useState(false);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [triggerPresetReport, setTriggerPresetReport] = useState(false);
  const [monthsInRange, setMonthsInRange] = useState<
    { year: number; month: number }[]
  >([]);

  const [paypalPayouts, setPaypalPayouts] = useState<
    Record<string, SupabasePayout>
  >({});
  const [stripePayouts, setStripePayouts] = useState<
    Record<string, SupabasePayout>
  >({});
  const [fetchPayoutsErr, setFetchPayoutsErr] = useState<string | null>(null);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = 2023; y <= currentYear; y++) {
      years.push(y.toString());
    }
    setAvailableYears(years);
  }, []);

  const categories = ["MEMBERSHIP", "FORUM", "DONATION"];

  const format = (v: number) =>
    v.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const exportFullReportToCSV = () => {
    const reportSections = [
      {
        title: "Squarespace",
        headers: [
          "Category",
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
          "YTD",
        ],
        rows: squarespaceRows,
      },
      {
        title: "PayPal",
        headers: [
          "Category",
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
          "YTD",
        ],
        rows: paypalRows,
      },
      {
        title: "Stripe",
        headers: [
          "Category",
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
          "YTD",
        ],
        rows: stripeRows,
      },
      {
        title: "Donation",
        headers: [
          "Category",
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
          "YTD",
        ],
        rows: donationRows,
      },
    ];

    let allData: any[][] = [];

    reportSections.forEach(({ title, headers, rows }) => {
      allData.push([title]);
      allData.push(headers);
      allData.push(...rows);
      allData.push([]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(allData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FinancialReport");
    XLSX.writeFile(workbook, "FinancialReport.csv");
  };

  // CSV export function
  const exportToCSV = () => {
    if (donors.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = ["Name", "Date", "Amount", "Address"];
    const rows = donors.flatMap((donor) => {
      const fullName = `${donor.first_name} ${donor.last_name}`;
      const fullAddressParts = [
        donor.street_address,
        donor.city,
        donor.state,
        donor.zip_code,
      ].filter(Boolean);
      const fullAddress = fullAddressParts.join(", ");

      return donor.donations.map(
        (donation: { date: string; amount: number }) => [
          fullName,
          new Date(donation.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          donation.amount.toFixed(2),
          fullAddress,
        ],
      );
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((r) =>
        r
          .map(
            (field: string | number) =>
              `"${String(field).replace(/"/g, '""')}"`,
          )
          .join(","),
      ),
    ].join("\r\n");

    let filename = "";
    if (customRange && startDate && endDate) {
      filename = `financial_report_${startDate}_to_${endDate}.csv`;
    } else {
      const yearsString =
        selectedYears.length > 0 ? selectedYears.join("_") : "all";
      filename = `financial_report_${yearsString}.csv`;
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const fetchPayouts = async (fromDate: string, toDate: string) => {
    const { data, error } = await supabase
      .from("payouts")
      .select("*")
      .gte("date_adjusted", fromDate)
      .lte("date_adjusted", toDate)
      .order("date_adjusted", { ascending: true });

    if (error) {
      setFetchPayoutsErr(error.message);
      return;
    }

    const paypal = data
      .filter((p) => p.date_adjusted && p.payment_platform === "PAYPAL")
      .map((p) => [p.date_adjusted!, p] as const);

    const stripe = data
      .filter((p) => p.date_adjusted && p.payment_platform === "STRIPE")
      .map((p) => [p.date_adjusted!, p] as const);

    setPaypalPayouts(Object.fromEntries(paypal));
    setStripePayouts(Object.fromEntries(stripe));
    setFetchPayoutsErr(null);
  };

  const handleGenerateReport = async () => {
    let fromDateValue = "";
    let toDateValue = "";

    // Set dates based on selection mode
    if (customRange) {
      if (!startDate || !endDate) {
        alert("Please select both start and end dates");
        return;
      }
      fromDateValue = startDate;
      toDateValue = endDate;
    } else {
      if (selectedYears.length === 0) {
        alert("Please select at least one calendar year");
        return;
      }
      // Set fromDate and toDate based on selected years
      if (selectedYears.length === 1) {
        fromDateValue = `${selectedYears[0]}-01-01`;
        toDateValue = `${selectedYears[0]}-12-31`;
      } else {
        // Sort years and take first and last
        const sortedYears = [...selectedYears].sort();
        fromDateValue = `${sortedYears[0]}-01-01`;
        toDateValue = `${sortedYears[sortedYears.length - 1]}-12-31`;
      }
    }

    // Ensure we have valid dates before proceeding
    if (!fromDateValue || !toDateValue) {
      alert("Please select valid dates");
      return;
    }

    // Set the state values after validation
    setFromDate(fromDateValue);
    setToDate(toDateValue);

    // Check date range
    const startDateObj = new Date(fromDateValue);
    const endDateObj = new Date(toDateValue);
    const diffMonths =
      (endDateObj.getUTCFullYear() - startDateObj.getUTCFullYear()) * 12 +
      (endDateObj.getUTCMonth() - startDateObj.getUTCMonth());

    if (diffMonths > 11) {
      alert("Please select a date range that is less than a year");
      return;
    }

    setShowReport(true);

    const range: { year: number; month: number }[] = [];
    const loop = new Date(fromDateValue);
    const endDateObj2 = new Date(toDateValue);
    while (loop <= endDateObj2) {
      range.push({
        year: loop.getUTCFullYear(),
        month: loop.getUTCMonth() + 1,
      });
      loop.setUTCMonth(loop.getUTCMonth() + 1);
    }
    setMonthsInRange(range);

    fetchPayouts(
      Temporal.PlainYearMonth.from(range[0]).toString(),
      Temporal.PlainYearMonth.from(range.at(-1)!).toString(),
    );

    const grossResults: Record<string, number> = {};
    const feeResults: Record<string, number> = {};

    const fetchDonors = async (start_date: string, end_date: string) => {
      // Only fetch donors if we have valid dates
      if (!start_date || !end_date) {
        console.log("Skipping donor fetch due to missing dates");
        return;
      }

      const { data, error } = await supabase.rpc("get_donation_history", {
        start_date,
        end_date,
      });

      if (error) {
        console.error("Error fetching donors:", error.message);
      } else {
        console.log("Donors fetched:", data);

        const grouped = data.reduce((acc, item) => {
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
        }, {} as any);

        setDonors(Object.values(grouped));
      }
    };

    const grossFeePromises: Promise<void>[] = [];

    for (const category of categories) {
      for (const { year, month } of range) {
        const upperCaseCategory = category.toUpperCase();
        const key = `${upperCaseCategory}-${year}-${month}`;
        grossFeePromises.push(
          Promise.all([
            supabase.rpc("get_total_gross_by_type", {
              p_type: category,
              p_year: year,
              p_month: month,
            }),
            supabase.rpc("get_total_fee_by_type", {
              p_type: category,
              p_year: year,
              p_month: month,
            }),
          ]).then(([grossRes, feeRes]) => {
            grossResults[key] = grossRes.data ?? 0;
            feeResults[key] = feeRes.data ?? 0;
          }),
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

    await Promise.all(
      range.map(({ year, month }) => {
        const key = `${year}-${month}`;
        return Promise.all([
          supabase.rpc("get_paypal_gross", { p_year: year, p_month: month }),
          supabase.rpc("get_paypal_fee", { p_year: year, p_month: month }),
          supabase.rpc("get_paypal_net", { p_year: year, p_month: month }),
          supabase.rpc("get_paypal_payout_total", {
            p_year: year,
            p_month: month,
          }),
        ]).then(([g, f, n, ppo]) => {
          paypal_gross[key] = g.data ?? 0;
          paypal_fee[key] = f.data ?? 0;
          paypal_net[key] = n.data ?? 0;
          paypal_payout[key] = ppo.data ?? 0;
        });
      }),
    );

    setPaypalGross(paypal_gross);
    setPaypalFee(paypal_fee);
    setPaypalNet(paypal_net);
    setPaypalPayout(paypal_payout);

    const stripe_gross: Record<string, number> = {};
    const stripe_fee: Record<string, number> = {};
    const stripe_net: Record<string, number> = {};
    const stripe_payout: Record<string, number> = {};

    await Promise.all(
      range.map(({ year, month }) => {
        const key = `${year}-${month}`;
        return Promise.all([
          supabase.rpc("get_stripe_gross", { p_year: year, p_month: month }),
          supabase.rpc("get_stripe_fee", { p_year: year, p_month: month }),
          supabase.rpc("get_stripe_net", { p_year: year, p_month: month }),
          supabase.rpc("get_stripe_payout_total", {
            p_year: year,
            p_month: month,
          }),
        ]).then(([g, f, n, p]) => {
          stripe_gross[key] = g.data ?? 0;
          stripe_fee[key] = f.data ?? 0;
          stripe_net[key] = n.data ?? 0;
          stripe_payout[key] = p.data ?? 0;
        });
      }),
    );

    setStripeGross(stripe_gross);
    setStripeFee(stripe_fee);
    setStripeNet(stripe_net);
    setStripePayout(stripe_payout);

    await fetchDonors(fromDateValue, toDateValue);
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
  // Generate Squarespace rows
  const squarespaceRows = categories.map((cat) => {
    const row: string[] = [cat];
    let ytdGross = 0;
    let ytdFee = 0;

    monthsInRange.forEach(({ year, month }) => {
      const key = `${cat}-${year}-${month}`;
      const gross = grossData[key] ?? 0;
      const fee = feeData[key] ?? 0;
      ytdGross += gross;
      ytdFee += fee;
      row.push((gross - fee).toFixed(2));
    });

    row.push((ytdGross - ytdFee).toFixed(2));
    return row;
  });

  // PayPal rows
  const paypalRows = [
    [
      "Gross",
      ...monthsInRange.map(({ year, month }) =>
        (paypalGross[`${year}-${month}`] ?? 0).toFixed(2),
      ),
      getRangeTotal(paypalGross).toFixed(2),
    ],
    [
      "Fee",
      ...monthsInRange.map(({ year, month }) =>
        (paypalFee[`${year}-${month}`] ?? 0).toFixed(2),
      ),
      getRangeTotal(paypalFee).toFixed(2),
    ],
    [
      "Payout",
      ...monthsInRange.map(({ year, month }) =>
        ((paypalPayout[`${year}-${month}`] ?? 0) / 100).toFixed(2),
      ),
      (getRangeTotal(paypalPayout) / 100).toFixed(2),
    ],
  ];

  // Stripe rows
  const stripeRows = [
    [
      "Gross",
      ...monthsInRange.map(({ year, month }) =>
        (stripeGross[`${year}-${month}`] ?? 0).toFixed(2),
      ),
      getRangeTotal(stripeGross).toFixed(2),
    ],
    [
      "Fee",
      ...monthsInRange.map(({ year, month }) =>
        (stripeFee[`${year}-${month}`] ?? 0).toFixed(2),
      ),
      getRangeTotal(stripeFee).toFixed(2),
    ],
    [
      "Payout",
      ...monthsInRange.map(({ year, month }) =>
        ((stripePayout[`${year}-${month}`] ?? 0) / 100).toFixed(2),
      ),
      (getRangeTotal(stripePayout) / 100).toFixed(2),
    ],
  ];

  // Donation rows
  const donationRows = donors.flatMap((donor) => {
    const fullName = `${donor.first_name} ${donor.last_name}`;
    const address = [
      donor.street_address,
      donor.city,
      donor.state,
      donor.zip_code,
    ]
      .filter(Boolean)
      .join(", ");
    return donor.donations.map((donation: any) => [
      fullName,
      new Date(donation.date).toLocaleDateString(),
      donation.amount.toFixed(2),
      address,
    ]);
  });

  return (
    <div className="custom-scrollbar flex h-full w-full flex-col bg-gray-100">
      <div className="flex w-full grow flex-col items-center justify-center overflow-auto">
        <div className="flex h-[95%] w-[98%] flex-row items-center gap-4">
          <div className="flex h-full w-full flex-col items-center">
            <div className="flex h-full w-full flex-col gap-3">
              <div className="flex w-full flex-row items-end justify-between">
                <div className="flex w-3/5 flex-row justify-between gap-2">
                  {customRange ? (
                    <>
                      <div className="flex w-1/3 flex-col">
                        <label className="text-sm font-semibold">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="h-10 w-full cursor-pointer rounded-lg border-gray-200 bg-white p-2"
                        />
                      </div>
                      <div className="flex w-1/3 flex-col">
                        <label className="text-sm font-semibold">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="h-10 w-full cursor-pointer rounded-lg border-gray-200 bg-white p-2"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex w-2/3 flex-col">
                        <label className="text-sm font-semibold">
                          Calendar Year
                        </label>
                        <MultiSelectDropdown
                          options={availableYears}
                          selectedOptions={selectedYears}
                          setSelectedOptions={setSelectedYears}
                          placeholder="Select Calendar Year(s)"
                        />
                      </div>
                    </>
                  )}
                  <div className="flex w-1/3 items-end">
                    <button
                      className="h-10 w-full cursor-pointer rounded-lg bg-gray-200 font-semibold"
                      onClick={() => setCustomRange((prev) => !prev)}
                    >
                      {customRange ? "Calendar Year" : "Custom Range"}
                    </button>
                  </div>
                </div>
                <div className="flex w-1/4 flex-row justify-between gap-2">
                  <div className="flex w-1/2 items-end">
                    <button
                      onClick={handleGenerateReport}
                      className="h-10 w-full cursor-pointer rounded-lg bg-blue-500 font-semibold text-white"
                    >
                      Generate Report
                    </button>
                  </div>

                  <div className="flex w-1/2 items-end">
                    <button
                      onClick={exportFullReportToCSV}
                      className="h-10 w-full cursor-pointer rounded-lg bg-green-500 font-semibold text-white"
                    >
                      Export as CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* <div className="relative custom-scrollbar bg-white p-4 rounded-lg overflow-auto"> */}
              {showReport && (
                <div className="custom-scrollbar h-full w-full rounded-lg bg-white p-4 px-6">
                  <div className="custom-scrollbar relative w-full grow overflow-auto rounded-lg bg-white">
                    <p className="mb-4">
                      {/* Showing report from <strong>{fromDate}</strong> to{" "}
                      <strong>{toDate}</strong> */}
                    </p>
                    <div className="sticky left-0 z-10 pb-2">
                      <h2 className="mb-2 text-base font-semibold">
                        Squarespace
                      </h2>
                    </div>

                    <div className="">
                      <table className="w-full table-fixed border-collapse rounded-lg bg-white text-center text-sm shadow-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th
                              rowSpan={2}
                              className="sticky left-0 z-20 w-32 border bg-gray-100 p-2"
                            >
                              Category
                            </th>
                            {monthsInRange.map(({ year, month }) => (
                              <th
                                colSpan={3}
                                key={`${year}-${month}`}
                                className="w-64 border p-2 text-center"
                              >
                                {new Date(year, month - 1).toLocaleString(
                                  "default",
                                  { month: "short", year: "numeric" },
                                )}
                              </th>
                            ))}
                            <th
                              rowSpan={2}
                              className="sticky right-0 z-10 w-32 border bg-gray-100 p-2 text-center"
                            >
                              {getTotalLabel()}
                            </th>
                          </tr>
                          <tr className="bg-gray-100">
                            {monthsInRange.map(({ year, month }) => (
                              <React.Fragment key={`sub-${year}-${month}`}>
                                <th className="border bg-gray-100 p-2">
                                  Gross
                                </th>
                                <th className="border bg-gray-100 p-2">Fees</th>
                                <th className="border bg-gray-100 p-2">Net</th>
                              </React.Fragment>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {categories.map((cat) => (
                            <React.Fragment key={cat}>
                              {/* Main data row */}
                              <tr>
                                <td className="sticky left-0 z-20 border bg-gray-100 p-2 text-left font-semibold">
                                  {cat.charAt(0).toUpperCase() +
                                    cat.slice(1).toLowerCase()}
                                </td>
                                {monthsInRange.map(({ year, month }) => {
                                  // Convert category to uppercase for data lookup to match existing data keys
                                  const upperCat = cat.toUpperCase();
                                  const key = `${upperCat}-${year}-${month}`;

                                  const gross = grossData[key] ?? 0;
                                  const fee = feeData[key] ?? 0;
                                  const net = gross - fee;

                                  return (
                                    <React.Fragment
                                      key={`${cat}-${year}-${month}`}
                                    >
                                      <td className="border p-2">
                                        {format(gross)}
                                      </td>
                                      <td className="border p-2">
                                        {format(fee)}
                                      </td>
                                      <td className="border p-2">
                                        {format(net)}
                                      </td>
                                    </React.Fragment>
                                  );
                                })}
                                <td className="sticky right-0 border bg-gray-100 p-2">
                                  {format(
                                    getCatRangeTotal(
                                      grossData,
                                      cat.toUpperCase(),
                                    ) -
                                      getCatRangeTotal(
                                        feeData,
                                        cat.toUpperCase(),
                                      ),
                                  )}
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}

                          {/* Total Row */}
                          <tr className="bg-gray-50 font-semibold">
                            <td className="sticky left-0 z-20 border bg-gray-100 p-2 text-left font-semibold">
                              Total
                            </td>
                            {monthsInRange.map(({ year, month }) => {
                              // Calculate totals for each month across all categories
                              let totalGross = 0;
                              let totalFee = 0;
                              let totalNet = 0;

                              categories.forEach((cat) => {
                                const upperCat = cat.toUpperCase();
                                const key = `${upperCat}-${year}-${month}`;
                                totalGross += grossData[key] ?? 0;
                                totalFee += feeData[key] ?? 0;
                              });

                              totalNet = totalGross - totalFee;

                              return (
                                <React.Fragment key={`total-${year}-${month}`}>
                                  <td className="border bg-gray-50 p-2">
                                    {format(totalGross)}
                                  </td>
                                  <td className="border bg-gray-50 p-2">
                                    {format(totalFee)}
                                  </td>
                                  <td className="border bg-gray-50 p-2">
                                    {format(totalNet)}
                                  </td>
                                </React.Fragment>
                              );
                            })}
                            <td className="sticky right-0 border bg-gray-100 p-2">
                              {format(
                                categories.reduce((sum, cat) => {
                                  return (
                                    sum +
                                    (getCatRangeTotal(
                                      grossData,
                                      cat.toUpperCase(),
                                    ) -
                                      getCatRangeTotal(
                                        feeData,
                                        cat.toUpperCase(),
                                      ))
                                  );
                                }, 0),
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Paypal Section */}
                    <div className="sticky left-0 z-10 bg-white pb-2">
                      <h2 className="mt-8 mb-2 text-base font-semibold">
                        PayPal
                      </h2>
                    </div>

                    <div className="mb-10">
                      <table className="w-full table-fixed border-collapse rounded-lg bg-white text-sm shadow-sm">
                        <thead>
                          {/* Row 1: Month headers + YTD */}
                          <tr className="bg-gray-100 text-center">
                            <th
                              rowSpan={2}
                              className="sticky left-0 z-20 w-32 border bg-gray-100 p-2"
                            >
                              Category
                            </th>
                            {monthsInRange.map(({ year, month }) => (
                              <th
                                key={`paypal-head-${year}-${month}`}
                                className="w-64 border p-2 text-center"
                              >
                                {new Date(year, month - 1).toLocaleString(
                                  "default",
                                  {
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </th>
                            ))}
                            {/* <th className="border p-2 text-center">{getTotalLabel()}</th> */}

                            <th
                              rowSpan={2}
                              className="sticky right-0 z-10 w-32 border bg-gray-100 p-2 text-center"
                            >
                              {getTotalLabel()}
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {/* Row: Gross */}
                          <tr>
                            <td className="sticky left-0 z-20 border bg-gray-100 p-2 font-semibold">
                              Gross
                            </td>
                            {monthsInRange.map(({ year, month }) => {
                              const key = `${year}-${month}`;
                              return (
                                <React.Fragment key={`gross-${year}-${month}`}>
                                  <td className="border p-2 text-center">
                                    {format(paypalGross[key] ?? 0)}
                                  </td>
                                </React.Fragment>
                              );
                            })}
                            <td className="sticky right-0 border bg-gray-100 p-2 font-bold">
                              {format(getRangeTotal(paypalGross))}
                            </td>
                          </tr>

                          {/* Row: Fee */}
                          <tr>
                            <td className="sticky left-0 z-20 border bg-gray-100 p-2 font-semibold">
                              Fee
                            </td>
                            {monthsInRange.map(({ year, month }) => {
                              const key = `${year}-${month}`;
                              return (
                                <React.Fragment key={`fee-${year}-${month}`}>
                                  <td className="border p-2 text-center">
                                    {format(paypalFee[key] ?? 0)}
                                  </td>
                                </React.Fragment>
                              );
                            })}
                            <td className="sticky right-0 border bg-gray-100 p-2 font-bold">
                              {format(getRangeTotal(paypalFee))}
                            </td>
                          </tr>

                          {/* Row: Payout */}
                          <tr className="bg-white font-semibold">
                            <td className="sticky left-0 z-20 border bg-gray-100 p-2">
                              Payout
                            </td>
                            {monthsInRange.map(({ year, month }) => {
                              const key = `${year}-${month}`;
                              return (
                                <td
                                  key={`net-${year}-${month}`}
                                  className="border p-2 text-center"
                                >
                                  {format((paypalPayout[key] ?? 0) / 100)}
                                </td>
                              );
                            })}

                            <td className="sticky right-0 border bg-gray-100 p-2 font-bold">
                              {format(getRangeTotal(paypalPayout) / 100)}
                            </td>
                          </tr>

                          {/* Row: Bank Confirmation */}
                          <tr className="bg-gray-100 font-semibold">
                            <td className="sticky left-0 z-20 border bg-gray-100 p-2 font-semibold">
                              Bank Confirmation
                            </td>
                            {monthsInRange.map(({ year, month }) => {
                              const temporalKey = Temporal.PlainYearMonth.from({
                                year,
                                month,
                              }).toString();
                              return (
                                <React.Fragment
                                  key={`paypal-confirm-${year}-${month}`}
                                >
                                  <td className="border bg-white p-2 text-center">
                                    <div className="flex flex-col items-center">
                                      <input
                                        type="checkbox"
                                        className="mt-1 h-4 w-4"
                                        disabled={!paypalPayouts[temporalKey]}
                                        checked={
                                          paypalPayouts[temporalKey]
                                            ?.received ?? false
                                        }
                                        onChange={async (e) => {
                                          const toAwait = updatePayout(
                                            temporalKey,
                                            e.target.checked,
                                            "PAYPAL",
                                          );

                                          toast.promise(toAwait, {
                                            loading: "Updating payout...",
                                            success: (data) => {
                                              setPaypalPayouts((prev) => ({
                                                ...prev,
                                                [temporalKey]: data,
                                              }));
                                              return `${temporalKey} PayPal Payout updated!`;
                                            },
                                            error: (error) =>
                                              `Error updating PayPal payout for ${temporalKey}: ${error.message}`,
                                          });
                                        }}
                                      />
                                      {fetchPayoutsErr !== null ? (
                                        <span className="text-xs text-red-400">
                                          Error fetching payouts:{" "}
                                          {fetchPayoutsErr}
                                        </span>
                                      ) : paypalPayouts[temporalKey] ? null : (
                                        // <span className="text-xs text-red-500">
                                        //   'date_adjusted' not found for '
                                        //   {temporalKey}'
                                        // </span>
                                        <></>
                                      )}
                                    </div>
                                  </td>
                                </React.Fragment>
                              );
                            })}
                            <td className="sticky right-0 border bg-gray-100 p-2 font-bold"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Stripe Section */}
                    <div className="sticky left-0 z-10 bg-white pb-2">
                      <h2 className="mt-8 mb-2 text-base font-semibold">
                        Stripe
                      </h2>
                    </div>

                    <div className="mb-10">
                      <table className="w-full table-fixed border-collapse border text-sm">
                        <thead>
                          {/* Row 1: Month headers + YTD */}
                          <tr className="bg-gray-100 text-center">
                            <th
                              rowSpan={2}
                              className="sticky left-0 z-20 w-32 border bg-gray-100 p-2"
                            >
                              Category
                            </th>
                            {monthsInRange.map(({ year, month }) => (
                              <th
                                key={`stripe-head-${year}-${month}`}
                                className="w-64 border p-2 text-center"
                              >
                                {new Date(year, month - 1).toLocaleString(
                                  "default",
                                  {
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </th>
                            ))}
                            {/* <th className="border p-2 text-center">{getTotalLabel()}</th> */}

                            <th
                              rowSpan={2}
                              className="sticky right-0 z-10 w-32 border bg-gray-100 p-2 text-center"
                            >
                              {getTotalLabel()}
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {/* Row: Gross */}
                          <tr>
                            <td className="sticky left-0 z-20 border bg-gray-100 p-2 font-semibold">
                              Gross
                            </td>
                            {monthsInRange.map(({ year, month }) => {
                              const key = `${year}-${month}`;
                              return (
                                <React.Fragment
                                  key={`stripe-gross-${year}-${month}`}
                                >
                                  <td className="border p-2 text-center">
                                    {format(stripeGross[key] ?? 0)}
                                  </td>
                                </React.Fragment>
                              );
                            })}
                            <td className="sticky right-0 border bg-gray-100 p-2 font-bold">
                              {format(getRangeTotal(stripeGross))}
                            </td>
                          </tr>

                          {/* Row: Fee */}
                          <tr>
                            <td className="sticky left-0 z-20 border bg-gray-100 p-2 font-semibold">
                              Fee
                            </td>
                            {monthsInRange.map(({ year, month }) => {
                              const key = `${year}-${month}`;
                              return (
                                <React.Fragment
                                  key={`stripe-fee-${year}-${month}`}
                                >
                                  <td className="border p-2 text-center">
                                    {format(stripeFee[key] ?? 0)}
                                  </td>
                                </React.Fragment>
                              );
                            })}
                            <td className="sticky right-0 border bg-gray-100 p-2 font-bold">
                              {format(getRangeTotal(stripeFee))}
                            </td>
                          </tr>

                          {/* Row: Payout */}
                          <tr className="bg-white font-semibold">
                            <td className="sticky left-0 z-20 border bg-gray-100 p-2">
                              Payout
                            </td>
                            {monthsInRange.map(({ year, month }) => {
                              const key = `${year}-${month}`;
                              return (
                                <React.Fragment
                                  key={`stripe-net-${year}-${month}`}
                                >
                                  <td className="border p-2 text-center">
                                    {format((stripePayout[key] ?? 0) / 100)}
                                  </td>
                                </React.Fragment>
                              );
                            })}
                            <td className="sticky right-0 border bg-gray-100 p-2 font-bold">
                              {format(getRangeTotal(stripePayout) / 100)}
                            </td>
                          </tr>

                          {/* Row: Bank Confirmation */}
                          <tr className="bg-gray-100 font-semibold">
                            <td className="sticky left-0 z-20 border bg-gray-100 p-2">
                              Bank Confirmation
                            </td>
                            {monthsInRange.map(({ year, month }) => {
                              const temporalKey = Temporal.PlainYearMonth.from({
                                year,
                                month,
                              }).toString();
                              return (
                                <React.Fragment
                                  key={`stripe-confirm-${year}-${month}`}
                                >
                                  <td className="border bg-white p-2 text-center">
                                    <div className="flex flex-col items-center">
                                      <input
                                        type="checkbox"
                                        className="mt-1 h-4 w-4"
                                        disabled={!stripePayouts[temporalKey]}
                                        checked={
                                          stripePayouts[temporalKey]
                                            ?.received ?? false
                                        }
                                        onChange={async (e) => {
                                          const toAwait = updatePayout(
                                            temporalKey,
                                            e.target.checked,
                                            "STRIPE",
                                          );

                                          toast.promise(toAwait, {
                                            loading: "Updating payout...",
                                            success: (data) => {
                                              setStripePayouts((prev) => ({
                                                ...prev,
                                                [temporalKey]: data,
                                              }));
                                              return `${temporalKey} Stripe Payout updated!`;
                                            },
                                            error: (error) =>
                                              `Error updating Stripe payout for ${temporalKey}: ${error.message}`,
                                          });
                                        }}
                                      />
                                      {fetchPayoutsErr !== null ? (
                                        <span className="text-xs text-red-400">
                                          Error fetching payouts:{" "}
                                          {fetchPayoutsErr}
                                        </span>
                                      ) : stripePayouts[temporalKey] ? null : (
                                        // <span className="text-xs text-red-500">
                                        //   'date_adjusted' not found for '
                                        //   {temporalKey}'
                                        // </span>
                                        <></>
                                      )}
                                    </div>
                                  </td>
                                </React.Fragment>
                              );
                            })}
                            {/* YTD Total */}
                            <td className="sticky right-0 border bg-gray-100 p-2 font-bold"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/*  Annual Donation Section */}

                    <div className="sticky left-0 z-10 bg-white pb-2">
                      <h2 className="mt-8 mb-2 text-base font-semibold">
                        Annual Donation
                      </h2>
                    </div>
                    <div className="sticky left-0 overflow-auto">
                      <table className="w-full table-fixed border bg-white text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-2 font-bold">Donor</th>
                            <th className="border p-2 font-bold">
                              Gift Totals
                            </th>
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
                                  <tr className="bg-white font-semibold">
                                    <td className="border p-2">{fullName}</td>
                                    <td className="border p-2">{total}</td>
                                    <td className="border p-2"></td>
                                    <td className="border p-2"></td>
                                    <td className="border p-2">{total}</td>
                                    <td className="border p-2">
                                      {fullAddress || "—"}
                                    </td>
                                  </tr>

                                  {/* Donation rows */}
                                  {console.log(
                                    "🔍 donor.donations",
                                    donor.donations,
                                  )}
                                  {donor.donations?.map(
                                    (
                                      donation: {
                                        date: string;
                                        amount: number;
                                      },
                                      i: number,
                                    ) => (
                                      <tr key={`${donor.member_id}-${i}`}>
                                        <td className="border p-2"></td>
                                        <td className="border p-2"></td>
                                        <td className="border p-2 text-center">
                                          {new Date(
                                            donation.date,
                                          ).toLocaleDateString()}
                                        </td>
                                        <td className="border p-2">
                                          {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                          }).format(donation.amount || 0)}
                                        </td>
                                        <td className="border p-2"></td>
                                        <td className="border p-2"></td>
                                      </tr>
                                    ),
                                  )}
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
                </div>
              )}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreasurerReqs;
