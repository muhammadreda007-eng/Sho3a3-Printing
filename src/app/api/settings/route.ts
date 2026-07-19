import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth";
import { hasSupabaseAdminEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { settingsSchema } from "@/lib/validations";

export async function PATCH(request: NextRequest) {
  if (!(await assertAdmin())) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  if (!hasSupabaseAdminEnv) return NextResponse.json({ message: "Supabase غير مربوط" }, { status: 503 });
  const parsed = settingsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || "بيانات غير صحيحة" }, { status: 400 });
  const supabase = createAdminClient();
  const { data: existing } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();
  const query = existing?.id
    ? supabase.from("site_settings").update(parsed.data).eq("id", existing.id)
    : supabase.from("site_settings").insert(parsed.data);
  const { data, error } = await query.select().single();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  revalidatePath("/");
  revalidatePath("/contact");
  return NextResponse.json({ settings: data });
}
