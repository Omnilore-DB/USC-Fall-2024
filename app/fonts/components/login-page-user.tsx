"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-4">
        <h1 className="text-2xl font-bold text-blue-600">Omnilore</h1>
      </header>
      <main className="flex-grow flex flex-col md:flex-row items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 md:pr-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-semibold">
              Welcome back General Member!
            </h2>
            <p className="text-gray-600">
              Enter your Credentials to access your account
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input id="password" type="password" className="mt-1" />
            </div>
            <Button className="w-full text-lg py-6">Log In</Button>
          </div>
          <div className="text-center">
            <span className="px-2 bg-white text-sm text-gray-500">OR</span>
          </div>
          <Button variant="outline" className="w-full">
            I am an admin member
          </Button>
        </div>
        <div className="hidden md:block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="240"
            height="240"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-600"
          >
            <path d="M12 3c-1.5 0-2.7 1.2-3 2.8C7.9 6.4 7 7.8 7 9.5 7 11.9 9.1 14 11.5 14c1.9 0 3.5-1.2 4.1-2.8 1.1-.3 2-.9 2.4-1.7.6-1 .7-2.3.2-3.3-.4-.8-1.2-1.5-2.2-1.7C15.4 3.6 13.8 3 12 3z" />
            <path d="M15 11.5c-.5.3-1 .4-1.5.4-1.7 0-3-1.3-3-3 0-.8.3-1.5.8-2" />
            <circle cx="9" cy="9.5" r="1" />
            <circle cx="15" cy="9.5" r="1" />
            <path d="M3 21h18" />
            <path d="M12 17v4" />
            <path d="M8 21h8" />
          </svg>
        </div>
      </main>
    </div>
  );
}
