import { redirect } from "next/navigation";
import { hasSupabaseAdminEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function getAdminUser() {
  if (!hasSupabaseAdminEnv) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("admin_users")
    .select("user_id, display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) return null;
  return { ...user, display_name: data.display_name as string | null };
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function assertAdmin() {
  return Boolean(await getAdminUser());
}
