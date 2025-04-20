"use client";
import TreasurerReqs from "./TreasurerReqs";
import React from "react";

export default function FinancialReportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Financial Report Dashboard</h1>
      </div>

      <div className="flex-grow rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col gap-6">
          {/* TreasurerReqs Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">TreasurerReqs Report</h2>
            <TreasurerReqs />
          </div>
        </div>
      </div>
    </div>
  );
}
