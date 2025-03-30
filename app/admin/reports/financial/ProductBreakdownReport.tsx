"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { supabase } from "@/app/supabase";

const ProductBreakdown = () => {
  const [tableData, setTableData] = useState<any[][]>([]);

  useEffect(() => {
    fetchProductData();
  }, []);

  const skuMap: { [sku: string]: string } = {
    SQ6550241: "Membership",
    SQ9552476: "Membership",
    SQ2636402: "Membership",
    SQ9809470: "Membership",
    SQDONATION: "Donation",
    SQ1845348: "Forum",
    SQ8887606: "Membership",
    SQ1381039: "Membership",
    SQ5521712: "Membership",
    "SQ-TEST": "Test",
    SQ7817608: "Membership",
  };

  const extractProductType = (skus: string[] | string | null): string => {
    if (!skus) return "Unknown";
    const skuList = typeof skus === "string" ? JSON.parse(skus) : skus;
    const sku = skuList?.[0] || "";
    return skuMap[sku] || "Unknown";
  };

  const fetchProductData = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("date, amount, fee, payment_platform, skus")
      .gte("date", "2024-01-01")
      .lte("date", "2024-12-31");

    if (error) {
      console.error("Error fetching transactions:", error.message);
      return;
    }

    const report = processProductBreakdown(data || []);
    setTableData(report);
  };

  const processProductBreakdown = (data: any[]) => {
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
    const platforms = ["PAYPAL", "STRIPE"];

    const grouped: any = {};

    data.forEach((tx) => {
      const month = new Date(tx.date).getMonth();
      const platform = tx.payment_platform?.toUpperCase() || "OTHER";
      const product = extractProductType(tx.skus);

      if (!grouped[product]) grouped[product] = {};
      if (!grouped[product][platform]) {
        grouped[product][platform] = Array(12)
          .fill(null)
          .map(() => ({ gross: 0, fee: 0 }));
      }

      grouped[product][platform][month].gross += Number(tx.amount) || 0;
      grouped[product][platform][month].fee += Number(tx.fee) || 0;
    });

    const headerRow = [""].concat(months, "YTD Total");
    const result: any[][] = [headerRow];

    Object.keys(grouped).forEach((product) => {
      result.push([`📦 ${product}`]);

      platforms.forEach((platform) => {
        const monthly =
          grouped[product][platform] || Array(12).fill({ gross: 0, fee: 0 });

        const grossRow = [`Gross - ${platform}`];
        const feeRow = [`Fee - ${platform}`];
        const netRow = [`Net - ${platform}`];

        let ytdGross = 0;
        let ytdFee = 0;

        for (let i = 0; i < 12; i++) {
          const g = monthly[i]?.gross || 0;
          const f = monthly[i]?.fee || 0;
          const n = g - f;

          grossRow.push(g ? `$${g.toFixed(2)}` : "");
          feeRow.push(f ? `$${f.toFixed(2)}` : "");
          netRow.push(n ? `$${n.toFixed(2)}` : "");

          ytdGross += g;
          ytdFee += f;
        }

        grossRow.push(`$${ytdGross.toFixed(2)}`);
        feeRow.push(`$${ytdFee.toFixed(2)}`);
        netRow.push(`$${(ytdGross - ytdFee).toFixed(2)}`);

        result.push(grossRow, feeRow, netRow);
      });
    });

    return result;
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Product Breakdown");
    XLSX.writeFile(workbook, "ProductBreakdown.xlsx");
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Product Breakdown - 2024</h1>
      <h2 className="text-md mb-4 text-gray-600">
        Data Source: db.omnilore.org
      </h2>

      <div className="mb-4">
        <Button
          onClick={exportToExcel}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Export to Excel
        </Button>
      </div>

      {tableData.length === 0 ? (
        <p className="text-gray-500">No transaction data available for 2024.</p>
      ) : (
        <div className="overflow-auto rounded-lg border">
          <table className="min-w-full border-collapse border text-sm">
            <thead>
              <tr>
                {tableData[0]?.map((header, idx) => (
                  <th
                    key={idx}
                    className="border px-4 py-2 text-left font-semibold"
                  >
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
      )}
    </div>
  );
};

export default ProductBreakdown;
