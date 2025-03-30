import { isSignedIn, getRoles } from "@/app/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useLoginRedirect = () => {
  const router = useRouter();

  async function redirect() {
    if (!(await isSignedIn())) {
      router.replace("/login");
    }
  }

  useEffect(() => {
    redirect();
  }, [router]);
};
