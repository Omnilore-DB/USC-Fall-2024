'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import Logo from "@/components/assets/logo.png"
import { useState } from "react";
import AlertBox from "@/components/alertbox";
import { supabase } from "@/app/supabase";
import Company from "@/components/ui/company";
import NavBar from "@/components/ui/NavBar";
import Image from "next/image";
import LandingPageImage from "@/components/assets/landingpage.png";


export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const DEFAULT_GENERAL_EMAIL = "member@omnilore.org";
    const DEFAULT_GENERAL_PASSWORD = "CBIWbvMQNUStFCGhnXwV";

    const redirectToAdminLogin = () => {
        router.push('/admin-login');
    };

    const generalMemberLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: DEFAULT_GENERAL_EMAIL,
            password: DEFAULT_GENERAL_PASSWORD,
        });
        if (error) {
            setAlertMessage(error.message);
        } else {
            setAlertMessage('Successfully logged in!');
            router.push('/search');
        }
    };

    return (
        <div className="h-screen flex flex-col bg-white">
            {/* <NavBar /> */}
            <div className="flex h-full w-full justify-center items-center bg-red-500">
                <div className="w-[43%] h-full gap-3 p-32 flex flex-col justify-center bg-white">
                    <div className="text-start space-y-2">
                        <h2 className="text-2xl font-semibold">Welcome back</h2>
                    </div>
                    <div className="text-[#666C7A]">Use your ominlore.org login information</div>
                    
                    <input
                        className="bg-[#EFF3F6] border-none rounded-lg h-10 w-full px-4"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="bg-[#EFF3F6] border-none rounded-lg h-10 w-full px-4"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        className="h-10 w-full bg-[#1E1F28] rounded-lg text-white text-lg"
                        onClick={generalMemberLogin}>
                        Login
                    </button>
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

