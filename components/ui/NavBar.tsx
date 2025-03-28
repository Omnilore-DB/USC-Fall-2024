"use client";
import Logo from "@/components/assets/logo.png"; // Ensure correct path

export default function NavBar() {
  return (
    <nav className="flex w-full flex-row justify-between bg-white px-12 py-8">
      <div className="flex flex-row items-center gap-3">
        <img src={Logo.src} className="h-fit w-12" alt="Omnilore Logo" />
        <div>
          <div className="text-2xl font-bold">Omnilore</div>
          <div className="text-sm">Learning-in-Retirement, Inc</div>
        </div>
      </div>
      <img
        src="/account-icon.svg"
        alt="Account Icon"
        className="h-8 w-8 object-contain"
      />
    </nav>
  );
}
