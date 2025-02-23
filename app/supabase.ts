import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getRoles() {
  const { error, data } = await supabase.rpc("get_current_user_roles");
  if (error) {
    return null;
  }
  const roles: string[] = data.map((x: any) => x.role);
  return roles;
}

export async function isSignedIn() {
  const { error, data } = await supabase.auth.getUser();
  return !error && data !== null;
}

export async function signOut() {
  await supabase.auth.signOut({ scope: "local" });
}
