"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import AlertBox from "@/components/alertbox";
import { supabase, getRoles } from "@/app/supabase";
import Image from "next/image";
import LandingPageImage from "@/components/assets/landingpage.png";
import { wait } from "../api/cron/src/utils";

export default function WrappedPasswordPage() {
  return (
    <Suspense>
      <PasswordPage />
    </Suspense>
  );
}

function PasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");


useEffect(() => {
  const handleRecovery = async () => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.substring(1))

    const access_token = params.get("access_token")
    const refresh_token = params.get("refresh_token")

    if (access_token && refresh_token) {
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      })
      const { data } = await supabase.auth.getSession()
      console.log("SESSION:", data.session);
      window.history.replaceState({}, document.title, window.location.pathname)

      if (error) {
        console.error("Session error:", error)
      }
    }
    else{
      setAlertMessage("Invalid or expired reset link. Redirecting...")
      setShowAlert(true)
      setTimeout(() => {
          router.push("login")
        }, 3000);
    }
  }

  handleRecovery()
}, [])

  const handlePassword = async () => {

      let userPassword = password;
      const { data, error } = await supabase.auth.updateUser({ password: userPassword })
      if(error){
        setAlertMessage(
        (error as Error).message || "Password Reset failed. Please try again.");
        setShowAlert(true);
      
      }
      else{
        setAlertMessage( "Password Reset successfully. Redirecting in 3s");
        setShowAlert(true);
        setTimeout(() => {
          router.push("login")
        }, 3000);
        
      }
    
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      {showAlert && (
        <AlertBox message={alertMessage} onClose={() => setShowAlert(false)} />
      )}

      <div className="flex h-full w-full items-center justify-center bg-red-500">
        <div className="flex h-full w-[43%] flex-col justify-center gap-3 bg-white p-32">
          <div className="space-y-2 text-start">
            <h2 className="text-2xl font-semibold">Reset Password</h2>
          </div>
          <div className="text-[#666C7A]">
            Enter a new password
          </div>
          <Input
            className="h-10 w-full rounded-lg border-none bg-[#EFF3F6] px-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="h-10 w-full rounded-lg bg-[#1E1F28] text-lg text-white"
            onClick={handlePassword}
          >
            Reset Password
          </Button>
        </div>

        <div className="flex h-full w-[57%] items-end justify-end bg-linear-to-t from-[#FAF0EA] to-[#EDF2FD]">
          <Image
            src={LandingPageImage}
            alt="landing page image"
            layout="intrinsic"
            width={800}
            height={0}
            className="h-auto w-5/6"
          />
        </div>
      </div>
    </div>
  );
}
