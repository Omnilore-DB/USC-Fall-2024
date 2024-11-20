'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/sidebar"
import Company from "@/components/ui/company";
export default function MemberSearch() {
  const tableTypes = [
      "Member",
      "Donation",
      "Referrals",
      "Committees",
      "Officers",
      "SDG"
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Company />
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
      </header>
      <main className="flex flex-row p-4 pt-10">
        <Sidebar />
        <div className="flex flex-row items-center space-x-10 w-full justify-center">
            <div className="self-start">
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Table type" />
                    </SelectTrigger>
                    <SelectContent>
                        {tableTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="w-1/2 space-y-8">
                <div className="flex items-center space-x-4 flex-row justify-center">
                    <h2 className="text-3xl font-semibold text-center">Search Member</h2>
                </div>
                <div className="space-y-4">
                    <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                    </label>
                    <Input id="firstName" type="text" placeholder="Enter first name" className="mt-1" />
                    </div>
                    <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                    </label>
                    <Input id="lastName" type="text" placeholder="Enter last name" className="mt-1" />
                    </div>
                    <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <Input id="email" type="email" placeholder="Enter email" className="mt-1" />
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Search</Button>
                </div>
            </div>
        </div>
      </main>
    </div>
  )
}