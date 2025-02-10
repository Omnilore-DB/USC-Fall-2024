'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserIcon from "@/components/assets/user-icon.png"
import { memberViews } from "@/app/schemas/members";
import {getRoles} from "@/app/supabase";



export default function GeneralMemberSearch() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [entries, setEntries] = useState<Record<string, any>[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<Record<string, any>[]>([]);
    const [selectedView, setSelectedView] = useState(memberViews[0]);
    const [roles, setRoles] = useState<string[]>([]);
    
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
            
            setSelectedView(newView);
        };
        setup().catch(console.error);
    }, []);

    useEffect(() => {
        if (!selectedView) return;
        
        const fetchMembers = async () => {
            console.log("Fetching members with view:", selectedView.name);
            const members = await selectedView.query_function();
            console.log("Fetched members:", members);
            setEntries(members);
            setFilteredEntries(members);
        };
    
        fetchMembers();
    }, [selectedView]);

    useEffect(() => {
        const keywords = query.toLowerCase().split(" ").filter(Boolean);
        setFilteredEntries(entries.filter(member =>
            keywords.every(kw =>
                Object.values(member).some(value =>
                    value !== null && value.toString().toLowerCase().includes(kw)
                )
            )
        ));
    }, [query, entries]);

    return (
        <div className="w-full flex justify-center items-center flex-col">
            <div className="w-5/6 mt-6">
                <h1 className="text-4xl font-semibold">Members</h1>
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
                                    <>
                                        <th className="border border-gray-200 px-4 py-2">Photo</th>
                                        <th className="border border-gray-200 px-4 py-2">Name</th>
                                        <th className="border border-gray-200 px-4 py-2">Address</th>
                                        <th className="border border-gray-200 px-4 py-2">Phone Number</th>
                                        <th className="border border-gray-200 px-4 py-2">Email</th>
                                    </>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEntries.map((member, index) => (
                                <tr key={index} className="group hover:bg-gray-50">
                                        <>
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
                                        </>
                                </tr>
                            ))}
                            {filteredEntries.length === 0 && (
                                <tr>
                                    <td colSpan={roles.includes("admin") || roles.includes("treasurer") || roles.includes("registrar") || roles.includes("member") ? Object.keys(selectedView.schema.columns).length : 5} 
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



    );
}
