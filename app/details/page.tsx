"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/sidebar";
import Company from "@/components/ui/company";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/supabase";

export default function ShowDetails() {
  return (
    <Suspense>
      <ShowDetailsComponent />
    </Suspense>
  );
}

// read the row from the query string
function ShowDetailsComponent() {
  const searchParams = useSearchParams();
  const row = searchParams.get("row");
  const [current_row, setCurrentRow] = useState<Record<string, any> | null>(
    row ? JSON.parse(row) : null,
  );
  const [membersMapping, setMembersMapping] = useState<Record<number, string>>(
    {},
  );
  const [committeesMapping, setCommitteesMapping] = useState<
    Record<number, string>
  >({});

  const [leadershipPositionMapping, setLeadershipPositionMapping] = useState<
    Record<number, string>
  >({});
  const [sdgNameMapping, setSdgNameMapping] = useState<Record<number, string>>(
    {},
  );

  console.log(current_row);

  const router = useRouter();

  const defaultPictureUrl = "https://i.imgur.com/M0H1D1a.jpeg";

  const handleBack = () => {
    router.back();
  };

  const columnDisplayNames: Record<string, string> = {
    member_id: "member_name",
    referred_by_member_id: "referred_by_member_name",
    committee_id: "committee_name",
    leadership_position_id: "leadership_position",
    sdg_id: "sdg",
  };

  // Fetch members data
  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("pid, first_name, last_name");
    if (error) {
      console.error("Error fetching members:", error);
      return;
    }
    const mapping = Object.fromEntries(
      (data || []).map((member) => [
        member.pid,
        `${member.first_name} ${member.last_name}`,
      ]),
    );
    console.log("member", mapping);
    setMembersMapping(mapping);
  };

  // Fetch committees data
  const fetchCommittees = async () => {
    const { data, error } = await supabase
      .from("committees")
      .select("pid, committee_name");
    if (error) {
      console.error("Error fetching committees:", error);
      return;
    }
    const mapping = Object.fromEntries(
      (data || []).map((committee) => [
        committee.pid,
        committee.committee_name,
      ]),
    );
    setCommitteesMapping(mapping);
  };

  const fetchLeadershipPositions = async () => {
    const { data, error } = await supabase
      .from("leadership_positions")
      .select("pid, leadership_position");

    if (error) {
      console.error("Error fetching leadership positions:", error);
      return;
    }

    const mapping = Object.fromEntries(
      (data || []).map((item) => [item.pid, item.leadership_position]),
    );

    setLeadershipPositionMapping(mapping);
  };

  const fetchSDG = async () => {
    const { data, error } = await supabase.from("sdgs").select("pid, sdg");

    if (error) {
      console.error("Error fetching leadership positions:", error);
      return;
    }

    const mapping = Object.fromEntries(
      (data || []).map((item) => [item.pid, item.sdg]),
    );
    console.log("sdg", mapping);

    setSdgNameMapping(mapping);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchMembers();
    fetchCommittees();
    fetchLeadershipPositions();
    fetchSDG();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Company />
      </header>
      <main className="flex flex-row p-4 pt-10">
        <Sidebar />
        <div className="flex-1 p-8 flex flex-col justify-center items-center">
          <div className="flex flex-row space-x-2">
            <Button
              type="button"
              className="w-20 bg-blue-500 hover:bg-blue-600"
              onClick={handleBack}
            >
              Back
            </Button>
          </div>
          <form className="w-full max-w-md space-y-4">
            <div className="flex flex-row space-x-2 w-[600px] justify-center">
              {current_row && current_row.photo_link ? (
                <div className="flex flex-col gap-2 w-full">
                  <h3 className="text-lg font-semibold">Photo</h3>
                  <img
                    src={current_row.photo_link || defaultPictureUrl}
                    alt="User"
                    className="w-full h-auto"
                  />
                </div>
              ) : null}

              <div className="flex flex-col gap-2">
                {Object.entries(current_row || {}).map(([key, value]) => {
                  const displayValue =
                    (key === "member_id" ||
                      key === "referred_by_member_id" ||
                      key == "coordinator") &&
                    membersMapping[value]
                      ? `${value} ${membersMapping[value]}`
                      : key === "committee_id" && committeesMapping[value]
                        ? `${value} ${committeesMapping[value]}`
                        : key === "leadership_position_id" &&
                            leadershipPositionMapping[value]
                          ? `${value} ${leadershipPositionMapping[value]}`
                          : key === "sdg_id" && sdgNameMapping[value]
                            ? `${value} ${sdgNameMapping[value]}`
                            : value;

                  return (
                    <div key={key} className="flex flex-col">
                      <label
                        htmlFor={key}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {columnDisplayNames[key] || key}
                      </label>
                      <div className="mt-1 bg-gray-100 text-gray-700 p-2 rounded">
                        {displayValue}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* <div>
                        <Button type="button" className="w-full" onClick={handleBack}>Cancel</Button>
                    </div> */}
          </form>
        </div>
      </main>
    </div>
  );
}
