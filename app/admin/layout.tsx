"use client";

import { useLoginRedirect } from "@/hooks/use-login-redirect";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Logo from "@/components/assets/logo.png";
import { MailIcon } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useLoginRedirect();
  const router = useRouter();
  const pathname = usePathname();
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTab = localStorage.getItem("activeReportTab");
      if (storedTab && pathname === "/admin/reports")
        setActiveReportTab(storedTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeReportTab", activeReportTab);
  }, [activeReportTab]);

  const handleReportTabClick = (tab: string) => {
    setActiveReportTab(tab);
    setShowSubMenu(true);
    router.push(`/admin/reports/${tab.toLowerCase()}`);
  };

  useEffect(() => {
    router.prefetch("/admin/tables");
    router.prefetch("/admin/reports");
    router.prefetch("/admin/conflicts");
  }, [router]);

  const handleOtherTabClick = (path: string) => {
    setActiveReportTab("");
    setShowSubMenu(false);
    router.push(path);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-100">
      <div className="flex w-full grow flex-row items-center justify-center overflow-y-auto">
        <div className="relative h-full w-1/6 gap-4 rounded-xl bg-white p-4">
          <div className="flex flex-row items-center gap-3">
            <img src={Logo.src} className="h-fit w-12" alt="Omnilore Logo" />
            <div>
              <div className="text-xl font-bold">Omnilore</div>
              <div className="text-xs">Learning-in-Retirement, Inc</div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <div onClick={() => handleOtherTabClick("/admin/tables")}>
              {" "}
              <TableButton />{" "}
            </div>
            <div
              onMouseEnter={() => setShowSubMenu(true)}
              onMouseLeave={() => setShowSubMenu(activeReportTab !== "")}
              className="relative"
            >
              <ReportsButton />
              {(showSubMenu || activeReportTab !== "") && (
                <div className="flex flex-col gap-1 pl-6">
                  {["Membership", "Forum", "Donation", "Financial"].map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => handleReportTabClick(tab)}
                        className={`group flex w-full items-center gap-2 rounded-lg p-2 ${activeReportTab === tab ? "bg-[#F6F6F6] text-[#000000]" : "bg-white text-[#85849E]"} hover:bg-[#F6F6F6]`}
                      >
                        <span
                          className={`group-hover:text-[#000000] ${activeReportTab === tab ? "text-[#000000]" : "text-[#85849E]"}`}
                        >
                          {tab}
                        </span>
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
            <div onClick={() => handleOtherTabClick("/admin/conflicts")}>
              {" "}
              <ConflictsButton />{" "}
            </div>
            <div onClick={() => handleOtherTabClick("/admin/mail-in")}>
              {" "}
              <MailInButton />{" "}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex h-full w-5/6 flex-col overflow-auto rounded-xl bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}

const TableButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === "/admin/tables";

  const TableIcon = () => (
    <svg
      width="25"
      height="28"
      viewBox="0 0 25 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`group-hover:stroke-[#000000] ${isActive ? "stroke-[#000000]" : "stroke-[#85849E]"}`}
    >
      <path
        d="M24 9.63025V4C24 2.34315 22.6569 1 21 1H4C2.34315 1 1 2.34315 1 4V9.63025M24 9.63025H1M24 9.63025V18.3151M1 9.63025V18.3151M24 18.3151V24C24 25.6569 22.6569 27 21 27H4C2.34315 27 1 25.6569 1 24V18.3151M24 18.3151H1"
        strokeWidth="2"
      />
    </svg>
  );

  return (
    <button
      className={`group flex w-full items-center gap-2 rounded-lg p-2 ${
        isActive ? "bg-[#F6F6F6]" : "bg-white"
      } hover:bg-[#F6F6F6]`}
    >
      <TableIcon />
      <span
        className={`group-hover:text-[#000000] ${isActive ? "text-[#000000]" : "text-[#85849E]"}`}
      >
        Table
      </span>
    </button>
  );
};

const ReportsButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === "/admin/reports";

  const ReportsIcon = () => (
    <svg
      width="25"
      height="29"
      viewBox="0 0 25 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`group-hover:stroke-[#000000] ${isActive ? "stroke-[#000000]" : "stroke-[#85849E]"}`}
    >
      <path
        d="M14.9266 1H4C2.34315 1 1 2.34315 1 4V25C1 26.6569 2.34315 28 4 28H21C22.6569 28 24 26.6569 24 25V9.41304M14.9266 1L24 9.41304M14.9266 1V8.41304C14.9266 8.96533 15.3743 9.41304 15.9266 9.41304H24M6.27523 20.5652L10.775 15.85L14.225 19.225L18.825 13.825"
        strokeWidth="2"
      />
    </svg>
  );

  return (
    <button
      className={`group flex w-full items-center gap-2 rounded-lg p-2 ${
        isActive ? "bg-[#F6F6F6]" : "bg-white"
      } hover:bg-[#F6F6F6]`}
    >
      <ReportsIcon />
      <span
        className={`group-hover:text-[#000000] ${isActive ? "text-[#000000]" : "text-[#85849E]"}`}
      >
        Reports
      </span>
    </button>
  );
};

const ConflictsButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === "/admin/conflicts";

  const ConflictsIcon = () => (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`group-hover:stroke-[#000000] ${isActive ? "stroke-[#000000]" : "stroke-[#85849E]"}`}
    >
      <path
        d="M1 6.8149C1 6.74074 1 5.66568 1 4.42032C1 2.76347 2.34315 1.41992 4 1.41992H6.03531"
        strokeWidth="2"
      />
      <path
        d="M17.3648 1.41992C17.4611 1.41992 19.0049 1.41992 20.6587 1.41992C22.3156 1.41992 23.6589 2.76307 23.6589 4.41992V6.8149"
        strokeWidth="2"
      />
      <path
        d="M1 17.605C1 17.6792 1 18.7542 1 19.9996C1 21.6565 2.34315 23 4 23H6.03531"
        strokeWidth="2"
      />
      <path
        d="M17.3648 23C17.4611 23 19.0049 23 20.6587 23C22.3156 23 23.6589 21.6569 23.6589 20V17.605"
        strokeWidth="2"
      />
      <path
        d="M6.15653 6.81445L9.8118 12.167M9.8118 12.167H1M9.8118 12.167L6.15653 17.6044"
        strokeWidth="2"
      />
      <path
        d="M18.5024 6.81445L14.8471 12.167M14.8471 12.167H23.6589M14.8471 12.167L18.5024 17.6044"
        strokeWidth="2"
      />
    </svg>
  );

  return (
    <button
      onClick={() => router.push("/admin/conflicts")}
      className={`group flex w-full items-center gap-2 rounded-lg p-2 ${
        isActive ? "bg-[#F6F6F6]" : "bg-white"
      } hover:bg-[#F6F6F6]`}
    >
      <ConflictsIcon />
      <span
        className={`text-left group-hover:text-[#000000] ${isActive ? "text-[#000000]" : "text-[#85849E]"}`}
      >
        Member Conflicts
      </span>
    </button>
  );
};

const MailInButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === "/admin/mail-in";

  const MailInIcon = () => (
    <MailIcon
      className={`group-hover:stroke-[#000000] ${isActive ? "stroke-[#000000]" : "stroke-[#85849E]"}`}
    />
  );

  return (
    <button
      onClick={() => router.push("/admin/mail-in")}
      className={`group flex w-full items-center gap-2 rounded-lg p-2 ${
        isActive ? "bg-[#F6F6F6]" : "bg-white"
      } hover:bg-[#F6F6F6]`}
    >
      <MailInIcon />
      <span
        className={`text-left group-hover:text-[#000000] ${isActive ? "text-[#000000]" : "text-[#85849E]"}`}
      >
        Add Mail-In Order
      </span>
    </button>
  );
};
