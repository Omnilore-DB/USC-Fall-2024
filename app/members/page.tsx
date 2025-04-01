"use client";
import { useState, useEffect, useMemo } from "react";
import { getRoles } from "@/app/supabase";
import UserIcon from "@/components/assets/user-icon.png";
import { queryTableWithFields } from "@/app/queryFunctions";
import NavBar from "@/components/ui/NavBar";
import TableComponent from "@/components/ui/TableComponent";
import MemberPanel from "@/components/ui/MemberPanel";
import { FormattedKeysMember } from "@/app/types";
import { useLoginRedirect } from "@/hooks/use-login-redirect";

const memberSchema = {
  id: { type: "basic", name: "int", nullable: false },
  first_name: { type: "basic", name: "text", nullable: true },
  last_name: { type: "basic", name: "text", nullable: true },
  alias: { type: "basic", name: "text", nullable: true },
  street_address: { type: "basic", name: "text", nullable: true },
  city: { type: "basic", name: "text", nullable: true },
  state: { type: "basic", name: "text", nullable: true },
  zip_code: { type: "basic", name: "text", nullable: true },
  phone: { type: "basic", name: "text", nullable: true },
  email: { type: "basic", name: "text", nullable: true },
  photo_link: { type: "basic", name: "text", nullable: true },
};

export default function Search() {
  useLoginRedirect();
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<Record<string, any>[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>("members");
  const [primaryKey, setPrimaryKey] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<FormattedKeysMember | null>(
    null,
  );
  const [isMemberPanelOpen, setIsMemberPanelOpen] = useState(false);

  const filteredEntries = useMemo(() => {
    const keywords = query.toLowerCase().split(" ").filter(Boolean);
    return entries.filter((item) =>
      keywords.every((kw) =>
        Object.values(item).some(
          (value) =>
            value !== null && value.toString().toLowerCase().includes(kw),
        ),
      ),
    );
  }, [query, entries]);

  useEffect(() => {
    const setup = async () => {
      try {
        const userRoles = await getRoles();
        if (!userRoles) {
          console.error("Failed to fetch roles");
          return;
        }
        setRoles(userRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    setup();
  }, []);

  useEffect(() => {
    const setup = async () => {
      const roles = await getRoles();
      if (!roles) {
        console.error("Failed to fetch roles");
        return;
      }
      setRoles(roles);
      console.log("Roles", roles);

      setSelectedTable("members");
    };
    setup().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data, primaryKey } = await queryTableWithFields(
          "members",
          memberSchema,
        );
        setEntries(data);
        setPrimaryKey(primaryKey);
      } catch (error: any) {
        console.error(`Failed to fetch data for members table`, error);
        if (error?.message) {
          console.error("Error message:", error.message);
        }
        if (error?.status) {
          console.error("HTTP Status:", error.status);
        }
      }
    };

    fetchEntries();
  }, [selectedTable]);

  useEffect(() => {
    console.log("Selected Row:", selectedRow);
  }, [selectedRow]);

  const formattedData = useMemo(() => {
    return filteredEntries.map((member) => {
      const name = `${member.first_name || ""}${
        member.alias && member.alias.trim() ? ` (${member.alias})` : ""
      } ${member.last_name || ""}`.trim();
      const addressParts = [
        member.street_address,
        member.city,
        member.state,
        member.zip_code,
      ].filter(Boolean);
      return {
        Photo: member.photo_link || UserIcon.src,
        Name: name,
        Address: addressParts.join(", "),
        "Phone Number": member.phone || "",
        Email: member.email || "",
        id: member.id,
      };
    });
  }, [filteredEntries]);

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Nav Bar */}
      <NavBar />

      <div className="flex w-full flex-grow flex-col overflow-y-auto">
        {roles === null ? (
          <div>Loading...</div>
        ) : (
          <div className="flex h-full w-full flex-col items-center">
            <div className="flex h-full w-5/6 flex-col gap-3">
              <h1 className="text-3xl font-semibold">Members</h1>
              <p className="text-base text-gray-600">
                Connect with Omnilore Members
              </p>
              <div className="relative mt-4 w-full">
                <img
                  src="/search-icon.svg"
                  alt="Search Icon"
                  className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 transform"
                />

                <input
                  type="text"
                  placeholder="Search by name or nickname..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-4 pl-12 pr-2 text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </div>
              <div className="mb-4 w-full flex-grow overflow-y-auto">
                <TableComponent
                  entries={formattedData}
                  roles={roles}
                  selectedRow={selectedRow}
                  handleRowSelection={(row: Record<string, any>) => {
                    setSelectedRow(row as FormattedKeysMember);
                    setIsMemberPanelOpen(true);
                  }}
                  primaryKeys={["id"]}
                  showImages={true}
                  adminTable={false}
                />
              </div>
              {selectedRow && (
                <MemberPanel
                  isOpen={isMemberPanelOpen}
                  onClose={() => setIsMemberPanelOpen(false)}
                  selectedRow={selectedRow}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
