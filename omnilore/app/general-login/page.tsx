'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import Logo from "@/components/assets/logo.png"
import { useState } from "react";
import AlertBox from "@/components/alertbox";
import {supabase} from "@/app/supabase";
import Company from "@/components/ui/company";

export default function LoginPage() {
  const router = useRouter();
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const redirectToSignUp = () => {
    router.push('/signup');
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUserIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserID(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const handleLogin = async () => {
    setShowAlert(true);
    if (userID === "owlsrus" && password === "SDGbook25") {
        setAlertMessage("Successfully logged in!");
        router.push('/search');
        setShowAlert(true);
        // Proceed with authentication logic (e.g., redirect to dashboard)
      } else {
        setAlertMessage("Invalid User ID or Password");
        setShowAlert(true);
      }
    // if (emailError) {
    //   setAlertMessage('Please correct the highlighted errors before logging in.');
    // }
    // else {
    //   const { data, error } = await supabase.auth.signInWithPassword({
    //     email: email,
    //     password: password,
    //   });
    //     if (error) {
    //         setAlertMessage(error.message);
    //     } else {
    //         setAlertMessage('Successfully logged in!');
    //         router.push('/search');
    //     }
    }



  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-4">
        <Company />
      </header>
      {showAlert && <AlertBox message={alertMessage} onClose={() => setShowAlert(false)} />}
      <main className="flex-grow flex flex-col md:flex-row justify-center p-4 pt-10">
        <div className="w-full max-w-md space-y-8 md:pr-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-semibold">Welcome back Member!</h2>
            <p className="text-gray-600">Enter your Omnilore credentials to access this site, or log in through {" "}
              <a href="https://omnilore.org" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              omnilore.org
              </a>
            </p>
          </div>
          <div className="space-y-4">
          <div>
              <label htmlFor="userID" className="block text-sm font-medium text-gray-700">
                User ID
              </label>
              <Input
                id="userID"
                type="text"
                placeholder="Enter your User ID"
                className="mt-1"
                onChange={handleUserIDChange}
                value={userID}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input id="password" type="password" placeholder="Enter your password" className="mt-1" onChange={handlePasswordChange} value={password} />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleLogin}>Log In</Button>
          </div>
          {/* <div className="text-center">
            <span className="px-2 bg-white text-sm text-gray-500">OR</span>
          </div>
          <Button variant="outline"
            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={redirectToSignUp}>
            Sign Up
          </Button> */}
        </div>
        <div className="flex justify-center mt-4 ml-10"> {/* New div for logo */}
          <img src={Logo.src} className="w-64 h-fit" /> 
        </div>
      </main>
    </div>
  )
}