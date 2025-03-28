"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sidebar } from "@/components/sidebar";
import Company from "@/components/ui/company";

export default function MemberSearch() {
  const tableTypes = ["Member"];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between p-4">
        <Company />
      </header>
      <main className="flex flex-row p-4 pt-10">
        <Sidebar />
        <div className="flex w-full flex-col items-center justify-center space-x-10 md:flex-row">
          <div className="md:self-start">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Table type" />
              </SelectTrigger>
              <SelectContent>
                {tableTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/2 space-y-8 pt-3">
            <div className="flex flex-row items-center justify-center space-x-4">
              <h2 className="text-center text-3xl font-semibold">
                Search Member
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter first name"
                  className="mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter last name"
                  className="mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  className="mt-1"
                />
              </div>
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Search
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
