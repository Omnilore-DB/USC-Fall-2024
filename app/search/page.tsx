"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Sidebar } from "@/components/sidebar";
import Company from "@/components/ui/company";
import { memberViews } from "@/app/schemas/members";
import { allViews } from "@/app/schemas";
import { getRoles } from "@/app/supabase";
import { getAccessibleViews, View } from "@/app/schemas/schema";
import { handleShowDetails, handleEditDetails } from "../view/details";

export default function SearchMembersPage() {
  // Search term for Google Search
  const [entries, setEntries] = useState<Record<string, any>[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [membersSearchResults, setMembersSearchResults] = useState<
    Record<string, any>[]
  >([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedView, setSelectedView] = useState<View | null>(memberViews[0]);
  const router = useRouter();

  useEffect(() => {
    const setup = async () => {
      const roles = await getRoles();
      if (!roles) {
        console.error("Failed to fetch roles");
        return;
      }
      setRoles(roles);
      console.log("Roles", roles);
      if (
        roles.includes("admin") ||
        roles.includes("registrar") ||
        roles.includes("treasurer")
      ) {
        console.log("User is an admin");
        setSelectedView(memberViews[2]);
      } else {
        console.log("User is not an admin");
        setSelectedView(memberViews[0]);
      }
    };
    setup().catch(console.error);
  }, []);

  const handleSelect = (id: string) => {
    // Toggle selection: if the clicked id is already selected, deselect it
    console.log("Select", id);
    setSelectedMemberId((prevId) => (prevId === id ? "" : id));
    console.log("Selected Member Id", selectedMemberId);
  };

  const handleGoogleSearch = async (name: string) => {
    // clear the selected member id
    setSelectedMemberId("");

    const members = await searchMembersByKeyword(name);

    console.log(members);
    setMembersSearchResults(members);
  };

  const searchMembersByKeyword = async (keyword: string) => {
    try {
      // Use the query_function from the selected view (e.g., Members (Basic))
      if (!selectedView) {
        console.error("No view selected");
        return [];
      }

      const members = await selectedView.query_function();
      console.log("Members:", members);

      const keywords = keyword.toLowerCase().split(" ").filter(Boolean);

      // Filter members based on the keywords
      const filteredMembers = members.filter((member: Record<string, any>) => {
        return keywords.every((kw) =>
          Object.values(member).some(
            (value) =>
              value !== null && value.toString().toLowerCase().includes(kw),
          ),
        );
      });

      // Log the search results to the console
      console.log("Search Results:", filteredMembers);
      setEntries(filteredMembers);
      return filteredMembers;
    } catch (error) {
      console.error("Error searching members:", error);
    }
  };

  return (
    <div>
      <header className="p-4 flex justify-between items-center">
        <Company />
      </header>
      <main className="flex flex-row">
        <Sidebar />
        <div className="flex flex-col items-center space-x-10 w-full justify-center">
          <div className="flex items-center w-3/5 p-4">
            <label htmlFor="search" className="text-sm font-semibold mr-4">
              Search Members
            </label>
            <Input
              id="search"
              type="text"
              placeholder="Search member by any metric"
              className="flex-grow mr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const btnSearch = document.getElementById("search-button");
                  if (btnSearch) btnSearch.click();
                }
              }}
            />
            <Button
              id="search-button"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleGoogleSearch(searchTerm)}
            >
              Search
            </Button>
          </div>

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
                    router,
                  )
                }
              >
                Edit Details
              </Button>
            )}
          </div>

          <div className="overflow-auto max-h-[500px] border rounded-lg w-3/4 mt-8 mb-16">
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
                          {name}
                        </TableHead>
                      ),
                    )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {membersSearchResults.map((entry) => (
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
                          <TableCell key={name}>{entry[name]}</TableCell>
                        ),
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
