import React from "react";

// Reports Sections
import PayoutsReport from "./PayoutsReport";
import ReceiptsReport from "./ReceiptsReport";
import ProductBreakdownReport from "./ProductBreakdownReport";
import SGQSPDonationsReport from "./SGQSPDonationsReport";
import MiscNotesSection from "./MiscNotesSection";
import FundRaising from "./FundRaising";
import TreasurerReqs from "./TreasurerReqs";

export default function FinancialReportPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Financial Report Dashboard
      </h1>

      {/* Payouts Section */}
      <section style={{ marginBottom: "4rem" }}>
        <h2>Payouts Report</h2>
        <PayoutsReport />
      </section>

      {/* Receipts Section */}
      <section style={{ marginBottom: "4rem" }}>
        <h2>Receipts Report</h2>
        <ReceiptsReport />
      </section>

      {/* Product Breakdown Section */}
      <section style={{ marginBottom: "4rem" }}>
        <h2>Product Breakdown - 2024</h2>
        <ProductBreakdownReport />
      </section>

      {/* SGQSP Donations Section */}
      <section style={{ marginBottom: "4rem" }}>
        <h2>SGQSP Donations - 2024</h2>
        <SGQSPDonationsReport />
      </section>

      {/* Misc Notes Section */}
      <section style={{ marginBottom: "4rem" }}>
        <h2>Misc Notes</h2>
        <MiscNotesSection />
      </section>

      {/* Fundraising Section */}
      <section style={{ marginBottom: "4rem" }}>
        <h2>Fundraising Report</h2>
        <FundRaising />
      </section>

      {/* TreasurerReqs Section */}
      <section style={{ marginBottom: "0rem" }}>
        <h2>TreasurerReqs Report</h2>
        <TreasurerReqs />
      </section>
    </div>
  );
}
