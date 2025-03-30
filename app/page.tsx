"use client";

import { useRouter } from "next/navigation";
import { isSignedIn, getRoles } from "./supabase";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  async function redirect() {
    if (await isSignedIn()) {
      const roles = await getRoles();

      if (roles && roles.length > 0 && !roles.includes("member")) {
        router.replace("/admin");
      } else {
        router.replace("/members");
      }
    } else {
      router.replace("/login");
    }
  }

  useEffect(() => {
    redirect();
  }, [router]);

  return null;
}
