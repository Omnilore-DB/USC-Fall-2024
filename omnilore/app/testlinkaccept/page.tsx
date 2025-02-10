"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const TestLinkAccept = () => {
  const searchParams = useSearchParams();
  const [decodedUser, setDecodedUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("❌ Invalid or missing token.");
      return;
    }

    // Call Next.js API route to verify token securely
    fetch(`/api/verify-token?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError("❌ Invalid token.");
        } else {
          setDecodedUser(data.userId);
        }
      })
      .catch(() => setError("❌ Error verifying token."));
  }, [searchParams]);

  if (!decodedUser && !error) {
    return <p>⏳ Verifying token...</p>;
  }

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>✅ Authentication Successful</h2>
          <p>Welcome, {decodedUser}!</p>
        </>
      )}
    </div>
  );
};

export default TestLinkAccept;
