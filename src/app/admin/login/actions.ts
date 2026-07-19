"use server";

import { redirect } from "next/navigation";
import { hasSupabaseAdminEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export interface LoginState {
  error?: string;
}

export async function login(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  if (!hasSupabaseAdminEnv) {
    return { error: "اربط مفاتيح Supabase في ملف البيئة أولًا، ثم أنشئ حساب الأدمن." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "اكتب البريد الإلكتروني وكلمة المرور." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "بيانات الدخول غير صحيحة." };

  const admin = createAdminClient();
  const { data: adminRecord } = await admin.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!adminRecord) {
    await supabase.auth.signOut();
    return { error: "هذا الحساب لا يملك صلاحية إدارة الموقع." };
  }

  redirect("/admin");
}
