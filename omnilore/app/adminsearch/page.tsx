'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/assets/logo.png"
import { memberViews } from "@/app/schemas/members";
import {getRoles} from "@/app/supabase";
import GeneralMemberView from "./generalMember";
import AdminView from "./admin";



export default function Search() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [entries, setEntries] = useState<Record<string, any>[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<Record<string, any>[]>([]);
    const [selectedView, setSelectedView] = useState(memberViews[0]);
    const [roles, setRoles] = useState<string[]>([]);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    
    useEffect(() => {
        const setup = async () => {
            const roles = await getRoles();
            if (!roles) {
                console.error("Failed to fetch roles");
                return;
            }
            setRoles(roles);
            console.log("Roles", roles);
    
            let newView = memberViews[0]; // General member

            if (roles.includes("treasurer")) {
                console.log("User is a treasurer");
                newView = memberViews[1]; 
            }
            if (roles.includes("admin")) {
                console.log("User is an admin");
                newView = memberViews[2]; 
            }
            if (roles.includes("registrar")) {
                console.log("User is a registrar");
                newView = memberViews[3]; 
            }

            setIsAdmin(roles?.some(role => ["admin", "treasurer", "registrar"].includes(role)));
            
            setSelectedView(newView);
        };
        setup().catch(console.error);
    }, []);

    return (
        <div className="w-full h-screen flex flex-col">
            <nav className="w-full bg-white flex flex-row justify-between px-12 py-8">
                <div className="flex flex-row items-center gap-3">
                    <img src={Logo.src} className="w-12 h-fit" alt="Omnilore Logo" />
                    <div>
                        <div className="text-2xl font-bold">Omnilore</div>
                        <div className="text-sm">Learning-in-Retirement, Inc</div>
                    </div>
                </div>
                <img 
                    src="/account-icon.svg" 
                    alt="Account Icon" 
                    className="w-8 h-8 object-contain"
                />
            </nav>

            
            <div className="flex-grow flex flex-col w-full overflow-y-auto">
                {roles === null ? (
                    <div>Loading...</div>
                ):(
                    isAdmin ? <AdminView /> : <GeneralMemberView />
                )}
            </div>
        </div>
    );
}
