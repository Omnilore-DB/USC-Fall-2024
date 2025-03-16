"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/assets/logo.png";
import { useEffect, useState } from "react";
import AlertBox from "@/components/alertbox";
import { supabase } from "@/app/supabase";
import Company from "@/components/ui/company";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const DEFAULT_GENERAL_EMAIL = "member@omnilore.org";
  const DEFAULT_GENERAL_PASSWORD = "CBIWbvMQNUStFCGhnXwV";
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Get token from URL

  useEffect(() => {
    if (token) {
      handleTokenLogin(token);
    }
  }, [token]);

  const handleTokenLogin = async (token: string) => {
    console.log("Token received:", token);

    // Extract the current UTC date (YYYY-MM-DD)
    const pre64_token = "somekey" + new Date().toISOString().split("T")[0];
    // Encode the token in Base64
    const calculated_token = Buffer.from(pre64_token).toString("base64");

    if (calculated_token !== token) return;

    // Proceed with authentication using Supabase
    try {
      await supabase.auth.signInWithPassword({
        email: "member@omnilore.org",
        password: DEFAULT_GENERAL_PASSWORD, // Using token as a password for authentication
      });

      // Redirect to the search page after successful login
      router.push("/members");
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Authentication failed. Please try again.");
    }
  };

  const redirectToAdminLogin = () => {
    router.push("/admin-login");
  };

  const generalMemberLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: DEFAULT_GENERAL_EMAIL,
      password: DEFAULT_GENERAL_PASSWORD,
    });
    if (error) {
      setAlertMessage(error.message);
    } else {
      setAlertMessage("Successfully logged in!");
      router.push("/members");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-4">
        <Company />
      </header>
      {showAlert && (
        <AlertBox message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
      <main className="flex-grow flex flex-col md:flex-row justify-center p-4 pb-20 items-center">
        <div className="w-full max-w-md space-y-8 md:pr-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-semibold">Welcome back Member!</h2>
          </div>
          <div className="space-y-4">
            <Button
              className="h-30 w-full bg-blue-600 hover:bg-blue-700 text-white text-lg"
              onClick={generalMemberLogin}
            >
              General Member Log In
            </Button>
          </div>
          <div className="text-center">
            <span className="px-2 bg-white text-sm text-gray-500">OR</span>
          </div>
          <Button
            variant="outline"
            className="h-30 w-full border-blue-600 text-blue-600 hover:bg-blue-50 text-lg"
            onClick={redirectToAdminLogin}
          >
            Admin Member Log In
          </Button>
        </div>
        <div className="flex justify-center mt-4 ml-10">
          {" "}
          <img src={Logo.src} className="w-64 h-fit" />
        </div>
      </main>
    </div>
  );
}
