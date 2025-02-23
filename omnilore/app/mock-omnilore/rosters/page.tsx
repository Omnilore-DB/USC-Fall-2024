'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MockOmniloreRosters() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLoginAttempt = () => {
        setShowLoginPrompt(true); // Show login modal when "Log In to Omnilore" is clicked
    };

    const handleLogin = () => {
        // Simulated authentication check (Replace with real validation)
        if (username === "owlsrus" && password === "SDGbook25") {
            setIsLoggedIn(true);
            localStorage.setItem("omnilore_token", "fake_jwt_token_123");
            setShowLoginPrompt(false); // Hide login modal
            setErrorMessage("");
        } else {
            setErrorMessage("Invalid credentials. Please try again.");
        }
    };

    const handleRedirect = () => {
        const token = localStorage.getItem("omnilore_token");
        if (token) {
            // Redirect user to db.omnilore.org with the token
            router.push(`http://localhost:3000/login?token=${token}`);
        } else {
            alert("Please log in first.");
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Mock Omnilore Rosters</h1>

            {!isLoggedIn ? (
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white" onClick={handleLoginAttempt}>
                    Log In to Omnilore
                </button>
            ) : (
                <button className="mt-4 px-4 py-2 bg-green-500 text-white" onClick={handleRedirect}>
                    Go to db.omnilore.org
                </button>
            )}

            {/* Login Modal */}
            {showLoginPrompt && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Sign in to Omnilore</h2>
                        <label className="block mb-2">
                            Username:
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </label>
                        <label className="block mb-4">
                            Password:
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </label>
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                                onClick={() => setShowLoginPrompt(false)}
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleLogin}>
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
