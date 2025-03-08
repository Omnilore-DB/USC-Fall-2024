'use client'
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/assets/logo.png"
import {getRoles} from "@/app/supabase";
import UserIcon from "@/components/assets/user-icon.png"
import { queryTableWithFields } from '@/app/queryFunctions';
import NavBar from "@/components/ui/NavBar";

const memberSchema = {
    pid: { type: "basic", name: "int", nullable: false },
    first_name: { type: "basic", name: "text", nullable: true },
    last_name: { type: "basic", name: "text", nullable: true },
    alias: { type: "basic", name: "text", nullable: true },
    street_address: { type: "basic", name: "text", nullable: true },
    city: { type: "basic", name: "text", nullable: true },
    state: { type: "basic", name: "text", nullable: true },
    zip_code: { type: "basic", name: "text", nullable: true },
    phone: { type: "basic", name: "text", nullable: true },
    email: { type: "basic", name: "text", nullable: true },
    photo_link: { type: "basic", name: "text", nullable: true },
};


export default function Search() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [entries, setEntries] = useState<Record<string, any>[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>("members");
    const [primaryKey, setPrimaryKey] = useState<string | null>(null);
        
    const filteredEntries = useMemo(() => {
        const keywords = query.toLowerCase().split(" ").filter(Boolean);
        return entries.filter(item =>
            keywords.every(kw =>
                Object.values(item).some(value =>
                    value !== null && value.toString().toLowerCase().includes(kw)
                )
            )
        );
    }, [query, entries]);
    
    useEffect(() => {
        const setup = async () => {
            try {
                const userRoles = await getRoles();
                if (!userRoles) {
                    console.error("Failed to fetch roles");
                    return;
                }
                setRoles(userRoles);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        setup();
    }, []);

    
    useEffect(() => {
        const setup = async () => {
            const roles = await getRoles();
            if (!roles) {
                console.error("Failed to fetch roles");
                return;
            }
            setRoles(roles);
            console.log("Roles", roles);
    
            setSelectedTable("members");

        };
        setup().catch(console.error);
    }, []);

    
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const { data, primaryKey } = await queryTableWithFields("members", memberSchema);
                setEntries(data);
                setPrimaryKey(primaryKey);
            } catch (error: any) {
                console.error(`Failed to fetch data for members table`, error);
                if (error?.message) {
                    console.error('Error message:', error.message);
                }
                if (error?.status) {
                    console.error('HTTP Status:', error.status);
                }
            }
        };

        fetchEntries();
    }, [selectedTable]);

    return (
        <div className="w-full h-screen flex flex-col">
            {/* Nav Bar */}
            <NavBar/>
            
            <div className="flex-grow flex flex-col w-full overflow-y-auto">
                {roles === null ? (
                    <div>Loading...</div>
                ):(
                    <div className="w-full h-full flex flex-col items-center">
                    {/* <div className="w-full flex justify-center items-center flex-col"> */}
                    <div className="w-5/6 h-full flex flex-col gap-3">

            {/* <div className="w-5/6 mt-6"> */}
            
                <h1 className="text-3xl font-semibold">Members</h1>
                <p className="text-base text-gray-600">Connect with Omnilore Members</p>
                <div className="relative w-full mt-4">
                    <img 
                        src="/search-icon.svg" 
                        alt="Search Icon" 
                        className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    />

                    <input
                        type="text"
                        placeholder="Search by name or nickname..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pr-2 pl-12 py-4 border border-gray-300 rounded-md text-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-300 focus:outline-none"
                    />
                </div>
                <div className="mt-6 overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="bg-gray-100 border border-gray-200 px-4 py-2 sticky top-0">Photo</th>
                                <th className="bg-gray-100 border border-gray-200 px-4 py-2 sticky top-0">Name</th>
                                <th className="bg-gray-100 border border-gray-200 px-4 py-2 sticky top-0">Address</th>
                                <th className="bg-gray-100 border border-gray-200 px-4 py-2 sticky top-0">Phone Number</th>
                                <th className="border border-gray-200 px-4 py-2 sticky top-0">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEntries.map((member, index) => (
                                <tr key={index} className="group hover:bg-gray-50">
                                    <td className="border border-gray-200 px-4 py-2">
                                        <div className="w-12 h-12 overflow-hidden rounded-full border border-gray-300">
                                            <img 
                                                src={member.photo_link || UserIcon.src} 
                                                alt={member.first_name} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="border border-gray-200 px-4 py-2">
                                        {member.first_name}
                                        {member.alias && member.alias.trim() !== "" ? ` (${member.alias}) ` : " "}
                                        {member.last_name}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-2">
                                        {member.street_address && member.street_address.trim() !== "" ? `${member.street_address}, ` : ""}
                                        {member.city && member.city.trim() !== "" ? `${member.city}, ` : ""}
                                        {member.state && member.state.trim() !== "" ? `${member.state} ` : ""}
                                        {member.zip && member.zip.trim() !== "" ? member.zip : ""}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-2">{member.phone}</td>
                                    <td className="border border-gray-200 px-4 py-2">{member.email}</td>
                                </tr>
                            ))}
                            {filteredEntries.length === 0 && (
                                <tr>
                                    <td colSpan={roles.includes("admin") || roles.includes("treasurer") || roles.includes("registrar") || roles.includes("member") ? Object.keys(memberSchema).length : 5} 
                                        className="text-center py-4 text-gray-500">
                                        No results found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>



            </div>
        </div>


                )}
            </div>
        </div>
    );
}
