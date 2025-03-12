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
import { getRoles, supabase } from "@/app/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAccessibleViews, View } from "@/app/schemas/schema";
import { allViews } from "@/app/schemas";
import Company from "@/components/ui/company";
import { useRouter } from "next/navigation";
import { handleShowDetails, handleEditDetails } from "@/app/view/details";

export default function MemberSearchComponent() {
  const [entries, setEntries] = useState<Record<string, any>[]>([]);

  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [views, setViews] = useState<Record<string, View>>({});
  const [selectedView, setSelectedView] = useState<View | null>(null);
  const [memberPictureUrl, setMemberPictureUrl] = useState<string | null>(null);
  const defaultPictureUrl = "https://i.imgur.com/Lx8xEdO.png";

  const router = useRouter();

  const getMemberPictureUrl = async (userId: string) => {
    // fetch member picture link from user_picture table
    console.log("Fetching member picture url for user", userId);
    const { data, error } = await supabase
      .from("user_pictures")
      .select("picture_link");

    if (error) {
      console.error("Failed to fetch member picture url", error);
      return null;
    }
    console.log("Member Picture Data", data);
    return data[0].picture_link;
  };

  useEffect(() => {
    const setup = async () => {
      const roles = await getRoles();
      if (!roles) {
        console.error("Failed to fetch roles");
        return;
      }
      setRoles(roles);

      const views: Record<string, View> = {};
      for (const [_, viewList] of Object.entries(allViews)) {
        const accessible = await getAccessibleViews(viewList);
        // Should we show all views in the group or just the first one?
        for (const view of accessible) {
          views[view.name] = view;
        }
      }
      setViews(views);
      console.log({
        roles,
        views,
      });

      // retrieve the previous selected view
      const previousView = localStorage.getItem("selectedView");
      console.log("Previous View", previousView);
      if (previousView) {
        setSelectedView(views[previousView]);
        // set the name of the selected view
      }
    };
    setup().catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedView) {
      return;
    }
    const fetchEntries = async () => {
      const data = await selectedView.query_function();
      setEntries(data);
    };
    fetchEntries().catch(console.error);
  }, [selectedView]);

  const handleSelect = (id: string) => {
    // Toggle selection: if the clicked id is already selected, deselect it
    setSelectedMemberId((prevId) => (prevId === id ? "" : id));
  };

  const handleBackToSearch = () => {
    // clear the selected member id
    setSelectedMemberId("");
    router.push("/search");
  };

  const handleViewChange = (viewName: string) => {
    // reset the selected member id
    setSelectedMemberId("");
    setSelectedView(views[viewName]);

    // save the selected view to local storage
    localStorage.setItem("selectedView", viewName);
  };

  const [membersMapping, setMembersMapping] = useState<Record<number, string>>(
    {}
  );
  const [committeesMapping, setCommitteesMapping] = useState<
    Record<number, string>
  >({});

  const [leadershipPositionMapping, setLeadershipPositionMapping] = useState<
    Record<number, string>
  >({});
  const [sdgNameMapping, setSdgNameMapping] = useState<Record<number, string>>(
    {}
  );

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
      ])
    );
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
      (data || []).map((committee) => [committee.pid, committee.committee_name])
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
      (data || []).map((item) => [item.pid, item.leadership_position])
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
      (data || []).map((item) => [item.pid, item.sdg])
    );

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
      <main className="flex flex-row">
        <Sidebar />
        <div className="flex flex-col items-center space-x-10 w-full justify-center">
          <h1 className="text-2xl font-bold mb-6">View Table Contents</h1>
          <Select
            onValueChange={handleViewChange}
            defaultValue={selectedView ? selectedView.name : ""}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={
                  selectedView ? selectedView.name : "Select Table Type"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(views).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="mt-6 flex justify-center space-x-4">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() =>
                handleShowDetails(selectedMemberId, entries, router)
              }
            >
              Show Details
            </Button>
            {selectedView?.upsert_function && (
              <Button
                variant="outline"
                className="border-blue-300 bg-blue-300 text-white hover:bg-blue-500 hover:text-white mb-8"
                onClick={() =>
                  handleEditDetails(
                    selectedMemberId,
                    entries,
                    selectedView,
                    router
                  )
                }
              >
                Edit Details
              </Button>
            )}
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 mb-8"
              onClick={handleBackToSearch}
            >
              Back to Search
            </Button>
          </div>

          <div className="overflow-auto max-h-[500px] mb-16 border rounded-lg w-3/4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  {selectedView &&
                    Object.entries(selectedView.schema.columns).map(
                      ([name, _]) => (
                        <TableHead
                          className="text-lg font-bold text-black"
                          key={name}
                        >
                          {columnDisplayNames[name] || name}
                        </TableHead>
                      )
                    )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.pid}>
                    <TableCell>
                      <Checkbox
                        onClick={() => handleSelect(entry.pid)}
                        checked={selectedMemberId === entry.pid}
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
                    {selectedView &&
                      Object.entries(selectedView.schema.columns).map(
                        ([name, _]) => (
                          <TableCell key={name}>
                            {(name === "member_id" ||
                              name === "referred_by_member_id" ||
                              name == "coordinator") &&
                            membersMapping[entry[name]]
                              ? `${entry[name]} ${membersMapping[entry[name]]}`
                              : name === "committee_id" &&
                                committeesMapping[entry[name]]
                              ? `${entry[name]} ${
                                  committeesMapping[entry[name]]
                                }`
                              : name === "leadership_position_id" &&
                                leadershipPositionMapping[entry[name]]
                              ? `${entry[name]} ${
                                  leadershipPositionMapping[entry[name]]
                                }`
                              : name === "sdg_id" && sdgNameMapping[entry[name]]
                              ? `${entry[name]} ${sdgNameMapping[entry[name]]}`
                              : entry[name]}
                          </TableCell>
                        )
                      )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
