"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { getRoles, isSignedIn, signOut } from "../app/supabase";
import { useRouter } from "next/navigation";
import AlertBox from "./alertbox";
import { useEffect, useState } from "react";

export function Sidebar() {
  // redirect to login page if the user is not signed in
  // create a function to check if the user is signed in or not if not redirect to login page
  const [isGeneralUser, setIsGeneralUser] = useState(false);
  const router = useRouter();

  async function checkSignedIn() {
    if (!(await isSignedIn())) {
      // show alert message
      router.push("/login");
    }
  }

  async function checkRoles() {
    const roles = await getRoles();
    if (roles) {
      // if the role only includes member, then set isGeneralUser to true
      console.log("roles are:", roles);
      console.log(
        "roles is general user:",
        roles.length === 1 && roles[0] === "member",
      );
      setIsGeneralUser(roles.length === 1 && roles[0] === "member");
    }
  }

  useEffect(() => {
    console.log("isGeneralUser", isGeneralUser);
  }, [isGeneralUser]);

  useEffect(() => {
    checkSignedIn();
    checkRoles();
  }, []);

  const handleLogout = async () => {
    if (await isSignedIn()) {
      console.log("Logout clicked for authenticated user");
      await signOut();
    }

    // redirect to login page
    router.push("/login");
  };

  return (
    <aside>
      <div className="p-5 bg-white">
        <nav className="space-y-5 flex flex-col h-full">
          <Link
            href="/search"
            className="block text-gray-600 hover:text-blue-600 transition-colors"
          >
            Search
          </Link>
          <Link
            href="/view"
            className="block text-gray-600 hover:text-blue-600 transition-colors"
          >
            View
          </Link>

          {!isGeneralUser && (
            <>
              <Link
                href="/insert"
                className="block text-gray-600 hover:text-blue-600 transition-colors"
              >
                Add
              </Link>

              <Link
                href="/reports"
                className="block text-gray-600 hover:text-blue-600 transition-colors"
              >
                Reports
              </Link>
            </>
          )}
        </nav>
        <div className="mt-10">
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
