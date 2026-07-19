import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth";
import { hasSupabaseAdminEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { projectSchema } from "@/lib/validations";

export async function GET() {
  if (!(await assertAdmin())) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  if (!hasSupabaseAdminEnv) return NextResponse.json({ projects: [] });
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("projects").select("*, category:categories(id,name,slug)").order("sort_order").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ projects: data });
}

export async function POST(request: NextRequest) {
  if (!(await assertAdmin())) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  if (!hasSupabaseAdminEnv) return NextResponse.json({ message: "Supabase غير مربوط" }, { status: 503 });
  const parsed = projectSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || "بيانات غير صحيحة" }, { status: 400 });
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("projects").insert(parsed.data).select("*, category:categories(id,name,slug)").single();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  revalidatePath("/");
  revalidatePath("/gallery");
  return NextResponse.json({ project: data }, { status: 201 });
}
