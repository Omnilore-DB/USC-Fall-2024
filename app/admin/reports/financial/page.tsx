import TreasurerReqs from "./TreasurerReqs";
import React from "react";

export default function FinancialReportPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Financial Report Dashboard
      </h1>

      {/* TreasurerReqs Section */}
      <section style={{ marginBottom: "0rem" }}>
        <h2>TreasurerReqs Report</h2>
        <TreasurerReqs />
      </section>
    </div>
  );
}
