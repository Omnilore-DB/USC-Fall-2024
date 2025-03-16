"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import AlertBox from "@/components/alertbox";
import { supabase, getRoles } from "@/app/supabase";
import Image from "next/image";
import LandingPageImage from "@/components/assets/landingpage.png";

export default function WrappedLoginPage() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Default general member credentials
  const GENERAL_MEMBER_LOGIN = "owlsrus";
  const GENERAL_MEMBER_PASSWORD = "SDGbook25";

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

  const handleLogin = async () => {
    try {
      let userEmail = email;
      let userPassword = password;

      // Map "owlsrus" login to default general member email and password
      if (
        email.toLowerCase() === GENERAL_MEMBER_LOGIN &&
        password === GENERAL_MEMBER_PASSWORD
      ) {
        userEmail = DEFAULT_GENERAL_EMAIL;
        userPassword = DEFAULT_GENERAL_PASSWORD;
      }

      // Authenticate user with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: userPassword,
      });

      if (error) throw error;

      // Fetch user roles
      const roles = await getRoles();
      if (!roles || roles.length === 0) {
        throw new Error("Failed to retrieve roles");
      }

      console.log("Roles:", roles);

      // Redirect based on role
      if (roles.includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/members");
      }
    } catch (error) {
      setAlertMessage(
        (error as Error).message || "Login failed. Please try again."
      );
      setShowAlert(true);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {showAlert && (
        <AlertBox message={alertMessage} onClose={() => setShowAlert(false)} />
      )}

      <div className="flex h-full w-full justify-center items-center bg-red-500">
        <div className="w-[43%] h-full gap-3 p-32 flex flex-col justify-center bg-white">
          <div className="text-start space-y-2">
            <h2 className="text-2xl font-semibold">Welcome back</h2>
          </div>
          <div className="text-[#666C7A]">
            Use your omnilore.org login information
          </div>

          <Input
            className="bg-[#EFF3F6] border-none rounded-lg h-10 w-full px-4"
            type="text"
            placeholder="Email or Username"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            className="bg-[#EFF3F6] border-none rounded-lg h-10 w-full px-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            className="h-10 w-full bg-[#1E1F28] rounded-lg text-white text-lg"
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>

        <div className="flex justify-end items-end w-[57%] h-full bg-gradient-to-t to-[#EDF2FD] from-[#FAF0EA]">
          <Image
            src={LandingPageImage}
            alt="landing page image"
            layout="intrinsic"
            width={800}
            height={0}
            className="w-5/6 h-auto"
          />
        </div>
      </div>
    </div>
  );
}
