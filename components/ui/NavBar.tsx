'use client';
import Logo from "@/components/assets/logo.png";  // Ensure correct path

export default function NavBar() {
    return (
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
    );
}
