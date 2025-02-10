'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { memberViews } from "@/app/schemas/members";
import { getRoles } from "@/app/supabase";
import { getAccessibleViews, View } from "@/app/schemas/schema";
import { allViews } from "@/app/schemas";
import { ActionButton} from "@/components/ui/actionButton";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";

export default function AdminSearch() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [entries, setEntries] = useState<Record<string, any>[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<Record<string, any>[]>([]);
    const [selectedMemberView, setSelectedMemberView] = useState(memberViews[0]);
    const [roles, setRoles] = useState<string[]>([]);
    const [views, setViews] = useState<Record<string, View>>({});
    const [selectedView, setSelectedView] = useState<View | null>(null);

    useEffect(() => {
        const setup = async () => {
            const userRoles = await getRoles();
            if (!userRoles) {
                console.error("Failed to fetch roles");
                return;
            }
            setRoles(userRoles);
            console.log("Roles:", userRoles);

            const accessibleViews: Record<string, View> = {};
            for (const [_, viewList] of Object.entries(allViews)) {
                const filteredViews = await getAccessibleViews(viewList);
                for (const view of filteredViews) {
                    accessibleViews[view.name] = view;
                }
            }
            setViews(accessibleViews);

            console.log("Accessible Views:", accessibleViews);

            // Set default selected view
            const firstView = Object.values(accessibleViews)[0] || null;
            setSelectedView(firstView);

            // Determine member view based on roles
            let newView = memberViews[0];
            if (userRoles.includes("treasurer")) newView = memberViews[1];
            if (userRoles.includes("admin")) newView = memberViews[2];
            if (userRoles.includes("registrar")) newView = memberViews[3];

            setSelectedMemberView(newView);
        };

        setup().catch(console.error);
    }, []);

    useEffect(() => {
        if (!selectedView) {
          return;
        }
        const fetchEntries = async () => {
          const data = await selectedView.query_function();
          setEntries(data);
        };
        fetchEntries().catch(console.error);
      }, [selectedView]);

    useEffect(() => {
        const keywords = query.toLowerCase().split(" ").filter(Boolean);
        setFilteredEntries(entries.filter(item =>
            keywords.every(kw =>
                Object.values(item).some(value =>
                    value !== null && value.toString().toLowerCase().includes(kw)
                )
            )
        ));
    }, [query, entries]);

    return (
        <div className="w-full flex justify-center items-center flex-col">
            <div className="w-5/6">
                <div className="w-full flex justify-between">
                    
    <div className="relative w-1/6">
      <Select.Root value={selectedView?.name || ""} onValueChange={(value) => setSelectedView(views[value])}>
        
        <Select.Trigger
            className="flex items-center justify-between border-1 border-gray-200 bg-gray-100 px-3 py-2 rounded-lg w-full shadow-sm text-gray-800 font-semibold 
                group 
                focus:outline-none focus:ring-0 
                data-[state=open]:border-transparent
                transition"
            >
            <Select.Value placeholder="Select a view" />
            <ChevronDown className="w-4 h-4 text-gray-500" />
            </Select.Trigger>

            <Select.Content 
            position="popper"
            className="border border-gray-200 bg-white rounded-lg shadow-lg w-full mt-1 z-10"
            >
            <Select.Viewport className="p-1">
                {Object.keys(views).length > 0 ? (
                Object.values(views).map((view) => (
                    <Select.Item
                    key={view.name}
                    value={view.name}
                    className="flex items-center justify-between px-4 py-2 cursor-pointer rounded-md font-semibold text-gray-700 
                    hover:bg-gray-100 focus:bg-gray-100 
                    border-none outline-none"
                    >
                    <Select.ItemText>{view.name}</Select.ItemText>
                        <Select.ItemIndicator>
                            <Check className="w-4 h-4 text-blue-500" />
                        </Select.ItemIndicator>
                    </Select.Item>
                ))
                ) : (
                <Select.Item disabled className="text-gray-400 px-3 py-2">
                    No views available
                </Select.Item>
                )}
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
    </div>
                    <div className="flex flex-row gap-1">
                        <ActionButton actionType="add" />
                        <ActionButton actionType="edit" />
                        <ActionButton actionType="delete" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full mt-4">
                    <img 
                        src="/search-icon.svg" 
                        alt="Search Icon" 
                        className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pr-2 pl-12 py-4 border border-gray-300 rounded-md text-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-300 focus:outline-none"
                    />
                </div>

                {/* Table Display */}
                <div className="mt-6 overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                {roles.includes("admin") || roles.includes("treasurer") || roles.includes("registrar") ? (
                                    <>
                                        <th className="outline outline-gray-200 outline-1 bg-gray-100 px-4 py-2 sticky left-0 z-5">PID</th>
                                        {entries.length > 0 && Object.keys(entries[0])
                                            .filter(name => name !== "pid")
                                            .map(columnName => (
                                                <th key={columnName} className="border border-gray-200 px-4 py-2">{columnName}</th>
                                            ))}
                                    </>
                                ) : (
                                    entries.length > 0 && Object.keys(entries[0]).map(columnName => (
                                        <th key={columnName} className="border border-gray-200 px-4 py-2">{columnName}</th>
                                    ))
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEntries.map((item, index) => (
                                <tr key={index} className="group hover:bg-gray-50">
                                    {roles.includes("admin") || roles.includes("treasurer") || roles.includes("registrar") ? (
                                        <>
                                            <td className="outline outline-gray-200 outline-1 border border-gray-200 px-4 py-2 bg-white sticky left-0 z-5 group-hover:bg-gray-50">
                                                {item.pid}
                                            </td>
                                            {Object.keys(item)
                                                .filter(name => name !== "pid")
                                                .map(columnName => (
                                                    <td key={columnName} className="border border-gray-200 px-4 py-2 group-hover:bg-gray-50">
                                                        {item[columnName]}
                                                    </td>
                                                ))}
                                        </>
                                    ) : (
                                        Object.keys(item).map(columnName => (
                                            <td key={columnName} className="border border-gray-200 px-4 py-2 group-hover:bg-gray-50">
                                                {item[columnName]}
                                            </td>
                                        ))
                                    )}
                                </tr>
                            ))}
                            {filteredEntries.length === 0 && (
                                <tr>
                                    <td colSpan={entries.length > 0 ? Object.keys(entries[0]).length : 1} className="text-center py-4 text-gray-500">
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
