"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { getRoles } from "@/app/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAccessibleViews, Report } from "@/app/schemas/schema";
import { allReports } from "@/app/schemas";
import * as XLSX from "xlsx";
import { supabase } from "@/app/supabase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Company from "@/components/ui/company";
import { filter_splitOrdersBySKU } from "@/app/utils/orderUtils";
import { set } from "react-datepicker/dist/date_utils";
import { FaCalendarAlt } from "react-icons/fa";

interface DashboardItem {
  group: string;
  count: number;
  percentage: string;
  totalAmount: number;
}

function groupDataByCriteria(
  data: Record<string, any>[],
  criteria: string,
): DashboardItem[] {
  const groupCounts: Record<string, number> = {};
  const groupAmounts: Record<string, number> = {};

  data.forEach((order) => {
    const criteriaValue = order[criteria]?.toUpperCase();
    const userAmount = parseFloat(order.user_amounts); // Convert userAmounts to a number

    // Ensure criteriaValue and userAmount are defined
    if (!criteriaValue || isNaN(userAmount)) return;

    // Initialize group counts and amounts if not already done
    if (!groupCounts[criteriaValue]) {
      groupCounts[criteriaValue] = 0;
      groupAmounts[criteriaValue] = 0;
    }

    // Increment the count for the criteriaValue
    groupCounts[criteriaValue] += 1;

    // Add the user amount to the group's total amount
    groupAmounts[criteriaValue] += userAmount;
  });

  const total = Object.values(groupCounts).reduce((a, b) => a + b, 0);

  const dashboardData: DashboardItem[] = Object.entries(groupCounts).map(
    ([group, count]) => ({
      group: group,
      count: count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(2) + "%" : "0%",
      totalAmount: groupAmounts[group], // Adding total amount for each group
    }),
  );

  return dashboardData;
}
export default function MemberSearchComponent() {
  const [entries, setEntries] = useState<Record<string, any>[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [reports, setReports] = useState<Record<string, Report>>({});
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [fromDate, setFromDate] = useState<Date>(new Date("1990-01-02"));
  const [toDate, setToDate] = useState<Date>(new Date());

  useEffect(() => {
    const setup = async () => {
      const roles = await getRoles();
      if (!roles) {
        console.error("Failed to fetch roles");
        return;
      }
      setRoles(roles);

      const reports: Record<string, Report> = {};
      for (const [_, reportList] of Object.entries(allReports)) {
        const accessible = await getAccessibleViews(reportList);
        for (const report of accessible) {
          reports[report.name] = report as Report;
        }
      }
      setReports(reports);
      console.log({
        roles,
        reports,
      });
    };
    setup().catch(console.error);
  }, []);

  const handleSelect = (id: string) => {
    setSelectedMemberId((prevId) => (prevId === id ? "" : id));
  };

  const handleReportChange = (reportName: string) => {
    setEntries([]);
    setSelectedReport(reports[reportName]);
  };

  const fetchEntries = async () => {
    if (!selectedReport) {
      return;
    }
    setSelectedMemberId("");
    let data;
    if (selectedReport.name === "Membership") {
      console.log("fromDate", fromDate, "toDate", toDate);
      data = await selectedReport.query_function(fromDate, toDate);
    } else {
      data = await selectedReport.query_function();
    }
    setEntries(data);
  };

  const exportMembershipReportToExcel = async () => {
    if (!selectedReport || entries.length === 0) return;

    try {
      // Prepare orders sheet data with split rows
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("description, sku, pid")
        .ilike("description", "membership%");

      if (productsError) throw productsError;

      // Create a map of SKU to description
      const skuDescriptions: { [key: string]: string } = products.reduce(
        (acc, product) => {
          acc[product.sku] = product.description;
          return acc;
        },
        {} as { [key: string]: string },
      );

      let ordersSheetData: any[] = [
        [
          "user_names",
          "user_emails",
          "date",
          "SKU_description",
          "skus",
          "user_amounts",
          "fee",
          "sqsp_transaction_id",
          "sqsp_order_id",
          "payment_platform",
          "external_transaction_id",
        ],
      ];

      ordersSheetData = ordersSheetData.concat(
        entries.map((entry) => [
          entry.user_names,
          entry.user_emails,
          entry.date,
          skuDescriptions[entry.skus] || "", // Append SKU description
          entry.skus,
          entry.user_amounts,
          entry.fee,
          entry.sqsp_transaction_id,
          entry.sqsp_order_id,
          entry.payment_platform,
          entry.external_transaction_id,
        ]),
      );

      // Group data by skus
      const groupedOrderData = groupDataByCriteria(entries, "skus");

      // Iterate through each grouped order and search the products database table for matching skus
      const dashboardData = groupedOrderData.map((order) => {
        const productDescription = skuDescriptions[order.group] || "";

        return {
          ...order,
          sku_description: productDescription,
        };
      });

      // Prepare dashboard sheet data
      const dashboardSheetData = [
        ["SKU_description", "SKU", "Count", "Percentage", "Revenue ($)"],
        ...dashboardData.map(
          ({ group, count, percentage, totalAmount, sku_description }) => [
            sku_description,
            group,
            count,
            percentage,
            totalAmount,
          ],
        ),
      ];

      // Create workbook and sheets
      const workbook = XLSX.utils.book_new();
      const dashboardSheet = XLSX.utils.aoa_to_sheet(dashboardSheetData);
      const ordersSheet = XLSX.utils.aoa_to_sheet(ordersSheetData);

      // Function to set column widths based on header
      const setColumnWidths = (sheet: XLSX.WorkSheet, data: any[][]) => {
        const header = data[0];
        const colWidths = header.map((headerCell: string) => ({
          wch: Math.max(headerCell.length + 2, 10), // Adding padding for readability and ensuring minimum width
        }));
        sheet["!cols"] = colWidths;
      };

      // Set column widths for each sheet
      setColumnWidths(dashboardSheet, dashboardSheetData);
      setColumnWidths(ordersSheet, ordersSheetData);

      // Append sheets to workbook
      XLSX.utils.book_append_sheet(workbook, dashboardSheet, "Dashboard");
      XLSX.utils.book_append_sheet(workbook, ordersSheet, "Membership Orders");

      // Export workbook to file
      XLSX.writeFile(workbook, `${selectedReport.name}.xlsx`);
    } catch (err) {
      console.error("Error exporting to Excel:", err);
    }
  };
  const exportForumReportToExcel = async () => {
    if (!selectedReport || !selectedMemberId) return;

    // Find the selected entry
    const selectedEntry = entries.find(
      (entry) => entry.pid === selectedMemberId,
    );
    if (!selectedEntry) {
      console.error("Selected entry not found");
      return;
    }

    const sku = selectedEntry.sku;
    if (!sku) {
      console.error("SKU not found in the selected entry");
      return;
    }

    try {
      // Fetch orders data where skus contain the selected sku
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select(
          "created_at, updated_at, sqsp_transaction_id, sqsp_order_id, user_emails, amount, date, skus, payment_platform, fee, external_transaction_id, user_names, user_amounts",
        )
        .contains("skus", [sku])
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Prepare orders sheet data with split rows
      const columnHeaders = [
        "user_names",
        "user_emails",
        "date",
        "skus",
        "user_amounts",
        "fee",
        "sqsp_transaction_id",
        "sqsp_order_id",
        "payment_platform",
        "external_transaction_id",
      ];
      let ordersSheetData: any[] = [columnHeaders];

      let ordersDashboardData: Record<
        string,
        { count: number; totalAmount: number }
      > = {};

      const filteredOrdersData = filter_splitOrdersBySKU(ordersData, [sku]);

      ordersSheetData = ordersSheetData.concat(
        filteredOrdersData.map((order) => [
          order.user_names,
          order.user_emails,
          order.date,
          order.skus,
          order.user_amounts,
          order.fee,
          order.sqsp_transaction_id,
          order.sqsp_order_id,
          order.payment_platform,
          order.external_transaction_id,
        ]),
      );

      // Prepare dashboard data
      console.log("ordersDashboardData", ordersDashboardData);
      const total = Object.values(ordersDashboardData).reduce(
        (sum, { count }) => sum + count,
        0,
      );

      const criteria =
        selectedReport?.name === "Membership" ? "skus" : "payment_platform";

      const dashboardData = groupDataByCriteria(filteredOrdersData, criteria);
      const dashboardSheetData = [
        ["Payment Platform", "Count", "Percentage", "Revenue ($)"],
        ...dashboardData.map(({ group, count, percentage, totalAmount }) => [
          group,
          count,
          percentage,
          totalAmount,
        ]),
      ];

      // Create workbook and sheets
      const workbook = XLSX.utils.book_new();
      const dashboardSheet = XLSX.utils.aoa_to_sheet(dashboardSheetData);
      const ordersSheet = XLSX.utils.aoa_to_sheet(ordersSheetData);

      // Function to set column widths based on header
      const setColumnWidths = (sheet: XLSX.WorkSheet, data: any[][]) => {
        const header = data[0];
        const colWidths = header.map((headerCell: string) => ({
          wch: Math.max(headerCell.length + 2, 10), // Adding padding for readability and ensuring minimum width
        }));
        sheet["!cols"] = colWidths;
      };

      // Set column widths for each sheet
      setColumnWidths(dashboardSheet, dashboardSheetData);
      setColumnWidths(ordersSheet, ordersSheetData);

      // Append sheets to workbook
      XLSX.utils.book_append_sheet(workbook, dashboardSheet, "Dashboard");
      XLSX.utils.book_append_sheet(workbook, ordersSheet, "Forum Orders");

      // Export workbook to file
      XLSX.writeFile(workbook, `${selectedReport.name}.xlsx`);
    } catch (err) {
      console.error("Error exporting to Excel:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Company />
      </header>
      <main className="flex flex-row">
        <Sidebar />
        <div className="flex flex-col items-center space-x-10 w-full justify-center">
          <h1 className="text-2xl font-bold mb-6">Reports</h1>
          <Select
            onValueChange={handleReportChange}
            defaultValue={selectedReport ? selectedReport.name : ""}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Report type" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(reports).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="h-2"></div>

          {selectedReport && selectedReport.name === "Membership" && (
            <div className="mt-4 flex flex-col space-y-4">
              <div className="text-lg font-semibold">Filter orders:</div>
              <div className="flex space-x-4">
                <div className="relative">
                  <label>From:</label>
                  <div
                    className="flex items-center border border-gray-300 rounded-md p-2"
                    onClick={() =>
                      document.getElementById("fromDatePicker")?.focus()
                    }
                  >
                    <DatePicker
                      selected={fromDate}
                      onChange={(date: Date | null) =>
                        date && setFromDate(date)
                      }
                      className="w-full border-none focus:ring-0"
                      id="fromDatePicker"
                    />
                    <FaCalendarAlt className="ml-2 text-gray-500" />
                  </div>
                </div>
                <div className="relative">
                  <label>To:</label>
                  <div
                    className="flex items-center border border-gray-300 rounded-md p-2"
                    onClick={() =>
                      document.getElementById("toDatePicker")?.focus()
                    }
                  >
                    <DatePicker
                      selected={toDate}
                      onChange={(date: Date | null) => date && setToDate(date)}
                      className="w-full border-none focus:ring-0"
                      id="toDatePicker"
                    />
                    <FaCalendarAlt className="ml-2 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-6 flex justify-center space-x-4">
            <Button
              onClick={fetchEntries}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Preview
            </Button>
            <Button
              onClick={
                selectedReport?.name === "Membership"
                  ? exportMembershipReportToExcel
                  : exportForumReportToExcel
              }
              disabled={
                selectedReport?.name === "Membership"
                  ? entries.length === 0
                  : !selectedMemberId && selectedMemberId !== ""
              }
              className={`bg-green-600 hover:bg-green-700 text-white ${selectedReport?.name !== "Membership" && !selectedMemberId ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Export to Excel
            </Button>
          </div>
          <div className="h-6"></div>
          {entries.length > 0 && (
            <div className="border rounded-lg w-4/5">
              <Table>
                <TableHeader>
                  <TableRow>
                    {selectedReport?.name !== "Membership" && (
                      <TableHead className="w-[50px]"></TableHead>
                    )}
                    {selectedReport &&
                      Object.entries(selectedReport.schema.columns).map(
                        ([name, _]) => <TableHead key={name}>{name}</TableHead>,
                      )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.pid}>
                      {selectedReport?.name !== "Membership" && (
                        <TableCell>
                          <Checkbox
                            onClick={() => handleSelect(entry.pid)}
                            disabled={
                              selectedMemberId !== "" &&
                              selectedMemberId !== entry.pid
                            }
                            className={
                              selectedMemberId !== "" &&
                              selectedMemberId !== entry.pid
                                ? "bg-gray-600"
                                : ""
                            }
                          />
                        </TableCell>
                      )}
                      {selectedReport &&
                        Object.entries(selectedReport.schema.columns).map(
                          ([name, _]) => (
                            <TableCell key={name}>{entry[name]}</TableCell>
                          ),
                        )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
