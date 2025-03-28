"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/sidebar";
import Company from "@/components/ui/company";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allViewsByNames } from "@/app/schemas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditAdmin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToastContainer position="bottom-right" />
      <EditAdminComponent />
    </Suspense>
  );
}

// read the row from the query string
function EditAdminComponent() {
  const searchParams = useSearchParams();
  const row = searchParams.get("row");
  const [current_row, setCurrentRow] = useState<Record<string, any> | null>(
    row ? JSON.parse(row) : null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [leadershipPositionOptions, setLeadershipPositionOptions] = useState<
    { pid: number; leadershipPosition: string }[]
  >([]);

  const [OrderSKUDescriptionOptions, setOrderSKUDescriptionOptions] = useState<
    Map<string, string>
  >(new Map());

  const [sdgOptions, setSdgOptions] = useState<
    { pid: number; sdgName: string }[]
  >([]);

  const [committeeOptions, setCommitteeOptions] = useState<
    { pid: number; committeeName: string }[]
  >([]);

  const [membersOptions, setMembersOptions] = useState<
    { pid: number; displayName: string }[]
  >([]);
  const [productOptions, setProductOptions] = useState<
    { description: string }[]
  >([]);

  const memberStatusOptions = {
    LOAM: "Leave of Absence Mail",
    LOAE: "Leave of Absence Email",
    YrE: "Full Year Email",
    YrM: "Full Year Mail",
    "1/3E": "1 Trimester Email",
    "1/3M": "1 Trimester Mail",
    "2/3E": "2 Trimester Email",
    "2/3M": "2 Trimester Mail",
    LSE: "Lifestyle Email",
    LSM: "Lifestyle Mail",
    Deceased: "Deceased",
    Expired: "Expired",
    Guest: "Guest",
  };

  const orderPaymentOptions = {
    STRIPE: "STRIPE",
    PAYPAL: "PAYPAL",
    MAIL: "MAIL",
  };

  const columnDisplayNames: Record<string, string> = {
    member_id: "member_name",
    referred_by_member_id: "referred_by_member_name",
    committee_id: "committee_name",
    leadership_position_id: "leadership_position",
    sdg_id: "sdg",
  };

  const generateTrimesterOptions = () => {
    const options: string[] = [];
    const seasons = ["Fall", "Spring", "Summer"];
    const startYear = 1990;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Generate options up to the current year
    for (let year = startYear; year <= currentYear; year++) {
      seasons.forEach((season) => options.push(`${year} ${season}`));
    }

    // Add next year's options if the current date is past September
    if (currentMonth >= 8) {
      // September is month index 8
      seasons.forEach((season) => options.push(`${currentYear + 1} ${season}`));
    }

    return options;
  };

  const trimesterOptions = generateTrimesterOptions();

  useEffect(() => {
    const fetchLeadershipPositions = async () => {
      const { data, error } = await supabase
        .from("leadership_positions")
        .select("pid, leadership_position");

      if (error) {
        console.error("Error fetching leadership positions:", error);
        return;
      }

      const formattedData = (data || []).map((item) => ({
        pid: item.pid,
        leadershipPosition: `${item.pid} ${item.leadership_position}`,
      }));

      // const positions = data.map((item) => item.leadership_position);
      console.log("Mapped Leadership Positions:", formattedData);
      setLeadershipPositionOptions(formattedData);
    };
    const fetchSDG = async () => {
      const { data, error } = await supabase.from("sdgs").select("pid, sdg");

      if (error) {
        console.error("Error fetching leadership positions:", error);
        return;
      }

      const formattedData = (data || []).map((item) => ({
        pid: item.pid,
        sdgName: `${item.pid} ${item.sdg}`,
      }));

      // const positions = data.map((item) => item.leadership_position);
      console.log("Mapped Leadership Positions:", formattedData);
      setSdgOptions(formattedData);
    };

    const fetchCommitteeNames = async () => {
      const { data, error } = await supabase
        .from("committees")
        .select("pid, committee_name");

      if (error) {
        console.error("Error fetching committee names:", error);
        return;
      }

      const formattedData = (data || []).map((item) => ({
        pid: item.pid,
        committeeName: `${item.pid} ${item.committee_name}`,
      }));

      setCommitteeOptions(formattedData);
    };

    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from("members")
        .select("pid, first_name, last_name");

      if (error) {
        console.error("Error fetching members:", error);
        return;
      }

      const formattedData = (data || []).map((member) => ({
        pid: member.pid,
        displayName: `${member.pid} ${member.first_name} ${member.last_name}`,
      }));

      setMembersOptions(formattedData);
    };

    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("description");

      if (error) {
        console.error("Error fetching members:", error);
        return;
      }
      const formattedData = (data || []).map((products) => ({
        description: products.description,
      }));

      setProductOptions(formattedData);
    };

    const fetchOrderSKUDescription = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("sku, description");

      if (error) {
        console.error("Error fetching order SKUs:", error);
        return;
      }

      // Transform data into a Map
      const descriptionToSKU = new Map(
        data.map((item) => [item.description, item.sku]),
      );

      setOrderSKUDescriptionOptions(new Map(descriptionToSKU));
    };

    fetchLeadershipPositions();
    fetchCommitteeNames();
    fetchOrderSKUDescription();
    fetchMembers();
    fetchProducts();
    fetchSDG();
  }, []);

  console.log(current_row);

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    // call supabase upsert function
    const tableName = current_row?.table_name;

    if (!tableName) {
      console.error("No table name found");
      toast.error("No table name found.");
      return;
    }
    console.log("Table Name to upsert:", tableName);
    // remove the table name from the row
    delete current_row?.table_name;
    console.log("Row to upsert:", current_row);
    const upsert_function = allViewsByNames[tableName].upsert_function;
    if (!upsert_function) {
      const error = `No upsert function found for table ${tableName}`;
      console.error(error);
      toast.error(error);
      return;
    }
    try {
      await upsert_function(current_row);
      router.push(`/view`);
    } catch (error: any) {
      console.error("Upsert error:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
    return current_row;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCurrentRow((prevRow) => ({ ...prevRow, [id]: value }));
    console.log(`Updated row for ${id} : ${value}`);
  };

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
            <div>
              {Object.entries(current_row || {}).map(([key, value]) => (
                <div key={key}>
                  <label
                    htmlFor={key}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {columnDisplayNames[key] || key}
                  </label>
                  {key === "member_status" ? (
                    // Dropdown for member.member_status
                    <Select
                      onValueChange={(newValue) =>
                        setCurrentRow((prevRow) => ({
                          ...prevRow,
                          [key]: newValue,
                        }))
                      }
                      value={value}
                    >
                      <SelectTrigger className="w-full mt-1 text-black">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(memberStatusOptions).map(
                          ([optionKey, description]) => (
                            <SelectItem key={optionKey} value={optionKey}>
                              {description}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  ) : key === "public" || key == "active" ? (
                    // Dropdown for member.public (True or False)
                    <Select
                      onValueChange={(newValue) =>
                        setCurrentRow((prevRow) => ({
                          ...prevRow,
                          [key]: newValue === "true" ? 1 : 0,
                        }))
                      }
                      value={value === 1 ? "true" : "false"}
                    >
                      <SelectTrigger className="w-full mt-1 text-black">
                        <SelectValue placeholder="Select True or False" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : key === "payment_platform" ? (
                    // Dropdown for orders.payment_platform (MAIL, PAYPAL, STRIPE)
                    <Select
                      onValueChange={(newValue) =>
                        setCurrentRow((prevRow) => ({
                          ...prevRow,
                          [key]: newValue,
                        }))
                      }
                      value={value}
                    >
                      <SelectTrigger className="w-full mt-1 text-black">
                        <SelectValue placeholder="Select Payment Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(orderPaymentOptions).map(
                          ([optionKey, description]) => (
                            <SelectItem key={optionKey} value={optionKey}>
                              {description}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  ) : key === "SKUDescription" ? (
                    // Dropdown for orders.SKUDescription (restricted to "Products.description" values)
                    <Select
                      onValueChange={(newValue) =>
                        setCurrentRow((prevRow) => ({
                          ...prevRow,
                          [key]: newValue,
                        }))
                      }
                      value={value}
                    >
                      <SelectTrigger className="w-full mt-1 text-black">
                        <SelectValue placeholder="Select SKUDescription" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(OrderSKUDescriptionOptions.entries()).map(
                          ([description, sku]) => (
                            <SelectItem key={description} value={sku}>
                              {description}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  ) : key === "committee_id" ? (
                    // Dropdown for commitee_members.committee_names values
                    <Select
                      onValueChange={(newValue) =>
                        setCurrentRow((prevRow) => ({
                          ...prevRow,
                          [key]: parseInt(newValue, 10), // Store only the pid as an integer
                        }))
                      }
                      value={value ? value.toString() : ""}
                    >
                      <SelectTrigger className="w-full mt-1 text-black">
                        <SelectValue placeholder="Select Committee" />
                      </SelectTrigger>
                      <SelectContent>
                        {committeeOptions.map(({ pid, committeeName }) => (
                          <SelectItem key={pid} value={pid.toString()}>
                            {committeeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : key === "sdg_id" ? (
                    // Dropdown for commitee_members.committee_names values
                    <Select
                      onValueChange={(newValue) =>
                        setCurrentRow((prevRow) => ({
                          ...prevRow,
                          [key]: parseInt(newValue, 10), // Store only the pid as an integer
                        }))
                      }
                      value={value ? value.toString() : ""}
                    >
                      <SelectTrigger className="w-full mt-1 text-black">
                        <SelectValue placeholder="Select Committee" />
                      </SelectTrigger>
                      <SelectContent>
                        {sdgOptions.map(({ pid, sdgName }) => (
                          <SelectItem key={pid} value={pid.toString()}>
                            {sdgName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : key === "leadership_position_id" &&
                    current_row?.table_name === "Leadership" ? (
                    // Dropdown for leadership.leadershipPosition values
                    <Select
                      onValueChange={(newValue) =>
                        setCurrentRow((prevRow) => ({
                          ...prevRow,
                          [key]: parseInt(newValue, 10),
                        }))
                      }
                      value={value ? value.toString() : ""}
                    >
                      <SelectTrigger className="w-full mt-1 text-black">
                        <SelectValue placeholder="Select Leadership Position" />
                      </SelectTrigger>
                      <SelectContent>
                        {leadershipPositionOptions.map(
                          ({ pid, leadershipPosition }) => (
                            <SelectItem key={pid} value={pid.toString()}>
                              {leadershipPosition}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  ) : key === "trimester" ? (
                    // Dropdown for SDG.trimester values
                    <Select
                      onValueChange={(newValue) =>
                        setCurrentRow((prevRow) => ({
                          ...prevRow,
                          [key]: newValue,
                        }))
                      }
                      value={value}
                    >
                      <SelectTrigger className="w-full mt-1 text-black">
                        <SelectValue placeholder="Select Trimester" />
                      </SelectTrigger>
                      <SelectContent>
                        {trimesterOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : key === "member_id" || key === "referred_by_member_id" ? (
                    // Assuming you have access to `Members` data with PID, FirstName, and LastName
                    <Select
                      onValueChange={(newValue) => {
                        setCurrentRow((prevRow) => ({
                          ...prevRow,
                          [key]: parseInt(newValue, 10), // Store only the pid as an integer
                        }));
                      }}
                      value={value ? value.toString() : ""}
                    >
                      <SelectTrigger className="w-full mt-1 text-black">
                        <SelectValue placeholder="Select Member" />
                      </SelectTrigger>
                      <SelectContent>
                        {membersOptions.map(({ pid, displayName }) => (
                          <SelectItem key={pid} value={pid.toString()}>
                            {displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : key === "forum_name" ? (
                    // Assuming you have access to `Members` data with PID, FirstName, and LastName
                    <Select
                      onValueChange={(newValue) =>
                        setCurrentRow((prevRow) => ({
                          ...prevRow,
                          [key]: newValue,
                        }))
                      }
                      value={value}
                    >
                      <SelectTrigger className="w-full mt-1 text-black">
                        <SelectValue placeholder="Select Forum" />
                      </SelectTrigger>
                      <SelectContent>
                        {productOptions.map(({ description }) => (
                          <SelectItem
                            key={description}
                            value={`${description}`}
                          >
                            {`${description}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={key}
                      defaultValue={value}
                      className={`mt-1 text-black ${
                        key === "pid" || key === "sku" ? "bg-gray-100" : ""
                      }`}
                      readOnly={key === "pid" || key === "sku"}
                      onChange={handleChange}
                    />
                  )}
                  <div className="h-4"></div>
                </div>
              ))}
            </div>
            <div className="flex flex-row space-x-2">
              <Button
                type="button"
                className="w-full bg-blue-500 hover:bg-blue-600"
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Button
                type="button"
                className="w-full text-white bg-gray-500 hover:bg-gray-600"
                onClick={handleBack}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
