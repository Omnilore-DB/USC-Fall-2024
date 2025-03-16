"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    router.replace("/login");
    setRedirecting(false);
  }, [router]);

  if (redirecting) return null;

  return null;
}
