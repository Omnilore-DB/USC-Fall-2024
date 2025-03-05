"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/assets/logo.png";
import { useState, useEffect } from "react";
import AlertBox from "@/components/alertbox";
import { supabase } from "@/app/supabase";
import Company from "@/components/ui/company";

function LoginPageContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Get token from URL
  const DEFAULT_GENERAL_PASSWORD = "CBIWbvMQNUStFCGhnXwV";

  useEffect(() => {
    if (token) {
      handleTokenLogin(token);
    }
  }, [token]);

  const handleTokenLogin = async (token: string) => {
    console.log("Token received:", token);
    // Your token handling logic...
    try {
      await supabase.auth.signInWithPassword({
        email: "member@omnilore.org",
        password: DEFAULT_GENERAL_PASSWORD,
      });
      router.push("/search");
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Authentication failed. Please try again.");
    }
  };

  const redirectToAdminLogin = () => {
    router.push("/admin-login");
  };

  const redirectToGeneralMemberLogin = () => {
    router.push("/general-login");
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
              onClick={redirectToGeneralMemberLogin}
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
          <img src={Logo.src} className="w-64 h-fit" alt="Logo" />
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
