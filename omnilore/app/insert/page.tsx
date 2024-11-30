"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Suspense, useEffect, useState } from "react";
import { getAccessibleViews, View } from "@/app/schemas/schema";
import { allViews } from "@/app/schemas";
import AlertBox from "@/components/alertbox";
import Company from "@/components/ui/company";
import { supabase } from "@/app/supabase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditDetails() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToastContainer position="bottom-right" />
      <InsertComponent />
    </Suspense>
  );
}
function InsertComponent() {
  const [views, setViews] = useState<Record<string, View>>({});
  const [selectedView, setSelectedView] = useState<View | null>(null);
  const [entries, setEntries] = useState<Record<string, any>[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const [leadershipPositionOptions, setLeadershipPositionOptions] = useState<
    { pid: number; leadershipPosition: string }[]
  >([]);

  const [sdgOptions, setSdgOptions] = useState<
    { pid: number; sdgName: string }[]
  >([]);
  const [committeeOptions, setCommitteeOptions] = useState<
    { pid: number; committeeName: string }[]
  >([]);

  const [membersOptions, setMembersOptions] = useState<
    { pid: number; displayName: string }[]
  >([]);
  const [OrderSKUDescriptionOptions, setOrderSKUDescriptionOptions] = useState<
    Map<string, string>
  >(new Map());

  const orderPaymentOptions = {
    STRIPE: "STRIPE",
    PAYPAL: "PAYPAL",
    MAIL: "MAIL",
  };

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
        data.map((item) => [item.description, item.sku])
      );

      setOrderSKUDescriptionOptions(new Map(descriptionToSKU));
    };

    fetchOrderSKUDescription();
    fetchLeadershipPositions();
    fetchCommitteeNames();
    fetchMembers();
    fetchSDG();
  }, []);


  useEffect(() => {
    const setup = async () => {
      const views: Record<string, View> = {};
      for (const [_, viewList] of Object.entries(allViews)) {
        const accessible = await getAccessibleViews(viewList);
        for (const view of accessible) {
          if (!view.upsert_function) {
            continue;
          }
          views[view.name] = view;
        }
      }
      setViews(views);
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

  const handleViewChange = (viewName: string) => {
    setSelectedView(views[viewName]);
    setFormData({});
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedView) {
      toast.error("No view selected");
      return;
    }
    try {
      console.log("Inserting data:", formData);
      await selectedView.upsert_function!(formData);
      
      const data = await selectedView.query_function();
      setEntries(data);
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Company />
      </header>
      {/* {showAlert && (
        <AlertBox message={alertMessage} onClose={() => setShowAlert(false)} />
      )} */}
      <main className="flex flex-row p-4 pt-10">
        <Sidebar />
        <div className="flex-1 p-8 flex flex-col justify-start items-center">
          <div className="w-full max-w-md space-y-4">
            <Select
              onValueChange={handleViewChange}
              defaultValue={selectedView ? selectedView.name : ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select View" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(views).map((viewName) => (
                  <SelectItem key={viewName} value={viewName}>
                    {viewName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedView && (
              <>
                <form className="space-y-4 w-full">
                  {Object.entries(selectedView.schema.columns).map(
                    ([colName, col]) => {
                      const value = formData[colName] || "";
                      if (colName == "pid") {
                        return null;
                      }
                      return (
                        <div key={colName}>
                          <label
                            htmlFor={colName}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {columnDisplayNames[colName] || colName}
                          </label>
                          {colName === "member_status" ? (
                            <Select
                              onValueChange={(newValue) =>
                                handleInputChange(colName, newValue)
                              }
                              value={value}
                            >
                              <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(memberStatusOptions).map(
                                  ([optionKey, description]) => (
                                    <SelectItem
                                      key={optionKey}
                                      value={optionKey}
                                    >
                                      {description}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          ) : colName === "public" || colName === "active" ? (
                            <Select
                              onValueChange={(newValue) =>
                                handleInputChange(
                                  colName,
                                  newValue === "true" ? 1 : 0
                                )
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
                          ) : colName === "committee_id" ? (
                            <Select
                              onValueChange={(newValue) =>
                                handleInputChange(
                                  colName,
                                  parseInt(newValue, 10)
                                )
                              }
                              value={value ? value.toString() : ""}
                            >
                              <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Select Committee" />
                              </SelectTrigger>
                              <SelectContent>
                                {committeeOptions.map(
                                  ({ pid, committeeName }) => (
                                    <SelectItem
                                      key={pid}
                                      value={pid.toString()}
                                    >
                                      {`${pid}  ${committeeName}`}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          ) : colName === "leadership_position_id" &&
                            selectedView.name === "Leadership" ? (
                            <Select
                              onValueChange={(newValue) =>
                                handleInputChange(
                                  colName,
                                  parseInt(newValue, 10)
                                )
                              }
                              value={value ? value.toString() : ""}
                            >
                              <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Select Leadership Position" />
                              </SelectTrigger>
                              <SelectContent>
                                {leadershipPositionOptions.map(
                                  ({ pid, leadershipPosition }) => (
                                    <SelectItem
                                      key={pid}
                                      value={pid.toString()}
                                    >
                                      {leadershipPosition}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          ) : colName === "sdg_id" ? (
                            <Select
                              onValueChange={(newValue) =>
                                handleInputChange(
                                  colName,
                                  parseInt(newValue, 10)
                                )
                              }
                              value={value ? value.toString() : ""}
                            >
                              <SelectTrigger className="w-full mt-1 text-black">
                                <SelectValue placeholder="Select SDG" />
                              </SelectTrigger>
                              <SelectContent>
                                {sdgOptions.map(({ pid, sdgName }) => (
                                  <SelectItem key={pid} value={pid.toString()}>
                                    {sdgName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : colName === "member_id" ||
                            colName == "referred_by_member_id" ||
                            colName == "coordinator" ? (
                            <Select
                              onValueChange={
                                (newValue) =>
                                  handleInputChange(
                                    colName,
                                    parseInt(newValue, 10)
                                  ) // Store only the pid
                              }
                              value={value ? value.toString() : ""}
                            >
                              <SelectTrigger className="w-full mt-1">
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
                          ) : colName === "trimester" ? (
                            <Select
                              onValueChange={(newValue) =>
                                handleInputChange(colName, newValue)
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
                          ) : colName === "payment_platform" &&
                            selectedView.name == "Orders" ? (
                            <Select
                              onValueChange={(newValue) =>
                                handleInputChange(colName, newValue)
                              }
                              value={value}
                            >
                              <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Select payment platform" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(orderPaymentOptions).map(
                                  ([optionKey, description]) => (
                                    <SelectItem
                                      key={optionKey}
                                      value={optionKey}
                                    >
                                      {description}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          ) : (colName === "SKUDescription" &&
                              selectedView.name == "Orders")
                             ? (
                            // Dropdown for SKUDescription
                            <Select
                              onValueChange={(newValue) =>
                                handleInputChange(colName, newValue)
                              }
                              value={value}
                            >
                              <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Select SKUDescription" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from(
                                  OrderSKUDescriptionOptions.entries()
                                ).map(([description, sku]) => (
                                  <SelectItem key={description} value={sku}>
                                    {description}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ): (colName === "forum_name" &&
                            selectedView.name == "Forums") ? (
                            // Assuming you have access to `Members` data with PID, FirstName, and LastName
                            <Select
                              onValueChange={(newValue) =>
                                handleInputChange(colName, newValue)
                              }
                              value={value}
                            >
                              <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Select SKUDescription" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from(
                                  OrderSKUDescriptionOptions.entries()
                                ).map(([description, _]) => (
                                  <SelectItem key={description} value={description}>
                                    {description}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              id={colName}
                              value={value}
                              onChange={(e) =>
                                handleInputChange(colName, e.target.value)
                              }
                              className={`mt-1 text-gray-700 ${
                                colName === "sku" &&
                                selectedView.name === "Forums"
                                  ? "bg-gray-100"
                                  : ""
                              }`}
                              readOnly={
                                colName === "sku" &&
                                selectedView.name === "Forums"
                              }
                            />
                          )}
                        </div>
                      );
                    }
                  )}
                </form>
                <div className="flex flex-row justify-center space-x-4">
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-black text-white hover:bg-gray-800"
                  >
                    Submit
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setFormData({});
                    }}
                    className="w-full bg-gray-300 text-gray-700 hover:bg-gray-400"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
