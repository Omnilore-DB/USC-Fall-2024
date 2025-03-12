"use client";

import { useEffect, useState } from "react";

const TestPage: React.FC = () => {
  const [authLink, setAuthLink] = useState<string | null>(null);
  const userId = "test-user-123"; // Example user ID

  useEffect(() => {
    // Fetch the authentication link from the API
    fetch(`/api/generate-token?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.authLink) {
          setAuthLink(data.authLink);
        }
      })
      .catch(() => setAuthLink(null));
  }, []);

  return (
    <div>
      <h2>Test Authentication Link</h2>
      {authLink ? <a href={authLink}>{authLink}</a> : <p>⏳ Generating link...</p>}
    </div>
  );
};

export default TestPage;
