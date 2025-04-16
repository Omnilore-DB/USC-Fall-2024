"use client";

import { supabase } from "@/app/supabase";
import { useState, useEffect } from "react";
import { getRoles } from "@/app/supabase";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";

export default function ForumReports() {
  // CSV export function
  const exportToCSV = () => {
    if (forumMembers.length === 0) {
      alert("No data to export");
      return;
    }
    const headers = ["Name", "Email"];
    const rows = forumMembers.map(m => [
      m.name ?? "",
      m.email ?? ""
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(","))
    ].join("\r\n");

    // Map trimester names to short codes
    const trimesterMap: Record<string, string> = {
      "Trimester 1": "t1",
      "Trimester 2": "t2",
      "Trimester 3": "t3"
    };

    const yearsString = selectedYears.length > 0 ? selectedYears.join("_") : "all";

    let filename = "";
    if (customRange && startDate && endDate) {
      filename = `forum_report_${startDate}_to_${endDate}.csv`;
    } else {
      // Map trimester names to short codes
      const trimesterMap: Record<string, string> = {
        "Trimester 1": "t1",
        "Trimester 2": "t2",
        "Trimester 3": "t3"
      };
      const yearsString = selectedYears.length > 0 ? selectedYears.join("_") : "all";
      let trimestersString = "";
      if (
        selectedTrimesters.length > 0 &&
        selectedTrimesters.length < 3
      ) {
        trimestersString = selectedTrimesters.map(t => trimesterMap[t] || t).join("_");
      }
      filename =
        trimestersString
          ? `forum_report_${yearsString}_${trimestersString}.csv`
          : `forum_report_${yearsString}.csv`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const [roles, setRoles] = useState<string[]>([]);
  const [customRange, setCustomRange] = useState(false);
  const [availableYears] = useState(["2022", "2023", "2024", "2025"]);
  const [availableTrimesters] = useState(["Trimester 1", "Trimester 2", "Trimester 3"]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedTrimesters, setSelectedTrimesters] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [forumMembers, setForumMembers] = useState<{ name: string; email: string }[]>([]);

  useEffect(() => {
    const setup = async () => {
      const userRoles = await getRoles();
      if (!userRoles) {
        console.error("Failed to fetch roles");
        return;
      }
      setRoles(userRoles);
    };
    setup().catch(console.error);
  }, []);

  const getGroupIds = (years: string[], trimesters: string[]) => {
    const trimesterNumberMap: Record<string, string> = {
      "Trimester 1": "1",
      "Trimester 2": "2",
      "Trimester 3": "3",
    };
    const groupIds: string[] = [];
    for (const year of years) {
      const shortYear = year.slice(2); // e.g., "2024" -> "24"
      for (const trimester of trimesters) {
        groupIds.push(`${shortYear}-${trimesterNumberMap[trimester]}`);
      }
    }
    return groupIds;
  };

  const fetchForumReport = async () => {
    if (customRange && (!startDate || !endDate)) {
      alert("Please select both start and end dates");
      return;
    }
    if (!customRange && (selectedYears.length === 0 || selectedTrimesters.length === 0)) {
      alert("Please select at least one calendar year and one trimester");
      return;
    }

    const groupIds = getGroupIds(selectedYears, selectedTrimesters);

    const { data: products, error: productError } = await supabase
      .from("products")
      .select("sku")
      .eq("type", "FORUM")
      .in("group_id", groupIds);

    if (productError) {
      console.error("Error fetching FORUM SKUs", productError);
      return;
    }

    const forumSkus = products.map((p) => p.sku);

    const { data: mtt, error: mttError } = await supabase
      .from("members_to_transactions")
      .select("member_id, sku")
      .in("sku", forumSkus);

    if (mttError) {
      console.error("Error fetching member IDs", mttError);
      return;
    }

    const memberIds = mtt.map((t) => t.member_id).filter(Boolean);

    const { data: members, error: memberError } = await supabase
      .from("members")
      .select("first_name, last_name, email, created_at, id")
      .in("id", memberIds);

    if (memberError) {
      console.error("Error fetching member data", memberError);
      return;
    }

    const filtered = members
      .filter((m) => {
        const date = new Date(m.created_at);
        const year = date.getFullYear().toString();
        if (customRange) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          return date >= start && date <= end;
        } else {
          return selectedYears.includes(year);
        }
      })
      .map((m) => ({
        name: `${m.first_name} ${m.last_name}`,
        email: m.email,
      }));

    setForumMembers(filtered);
  };

  return (
    <div className="flex h-full w-full flex-col bg-gray-100">
      <div className="flex w-full flex-grow flex-col items-center justify-center overflow-y-auto">
        {roles === null ? (
          <div>Don't have the necessary permission</div>
        ) : (
          <div className="flex h-[95%] w-[98%] flex-row items-center gap-4">
            <div className="flex h-full w-full flex-col items-center">
              <div className="flex h-full w-full flex-col gap-3">
                <div className="flex flex-row justify-between w-full items-end">
                  <div className="flex flex-row justify-between w-3/5 gap-2">
                    {customRange ? (
                      <>
                        <div className="w-1/3 flex flex-col">
                          <label className="text-sm font-semibold">Start Date</label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full h-10 rounded-lg border-gray-200 bg-white p-2"
                          />
                        </div>
                        <div className="w-1/3 flex flex-col">
                          <label className="text-sm font-semibold">End Date</label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full h-10 rounded-lg border-gray-200 bg-white p-2"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-1/3 flex flex-col">
                          <label className="text-sm font-semibold">Calendar Year(s)</label>
                          <MultiSelectDropdown
                            options={availableYears}
                            selectedOptions={selectedYears}
                            setSelectedOptions={setSelectedYears}
                            placeholder="Select Calendar Year(s)"
                          />
                        </div>
                        <div className="w-1/3 flex flex-col">
                          <label className="text-sm font-semibold">Trimester(s)</label>
                          <MultiSelectDropdown
                            options={availableTrimesters}
                            selectedOptions={selectedTrimesters}
                            setSelectedOptions={setSelectedTrimesters}
                            placeholder="Select Trimester(s)"
                          />
                        </div>
                      </>
                    )}
                    <div className="w-1/3 flex items-end">
                      <button
                        className="w-full h-10 rounded-lg bg-gray-200 font-semibold"
                        onClick={() => {
                          setCustomRange((prev) => !prev);
                          setForumMembers([]);
                        }}
                      >
                        {customRange ? "Calendar Year" : "Custom Range"}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between w-1/4 gap-2">
                    <div className="flex items-end w-1/2">
                      <button
                        onClick={fetchForumReport}
                        className="w-full bg-blue-500 h-10 rounded-lg font-semibold text-white"
                      >
                        Generate Report
                      </button>
                    </div>
                    <div className="flex items-end w-1/2">
                      <button
                        className="w-full bg-green-500 h-10 rounded-lg font-semibold text-white"
                        onClick={exportToCSV}
                      >
                        Export as CSV
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-full flex-grow overflow-y-auto">
                  <table className="w-full text-left border-collapse bg-white rounded-lg shadow">
                    <thead>
                      <tr>
                        <th className="p-3 font-semibold">Name</th>
                        <th className="p-3 font-semibold">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forumMembers.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="p-3 text-center text-gray-500">
                            No forum participants found
                          </td>
                        </tr>
                      ) : (
                        forumMembers.map((m, i) => (
                          <tr key={i} className="border-t">
                            <td className="p-3">{m.name}</td>
                            <td className="p-3">{m.email}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}