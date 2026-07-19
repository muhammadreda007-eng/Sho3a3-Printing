import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth";
import { hasSupabaseAdminEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { categorySchema } from "@/lib/validations";

export async function GET() {
  if (!(await assertAdmin())) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  if (!hasSupabaseAdminEnv) return NextResponse.json({ categories: [] });
  const { data, error } = await createAdminClient().from("categories").select("*").order("sort_order");
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ categories: data });
}

export async function POST(request: NextRequest) {
  if (!(await assertAdmin())) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  if (!hasSupabaseAdminEnv) return NextResponse.json({ message: "Supabase غير مربوط" }, { status: 503 });
  const parsed = categorySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || "بيانات غير صحيحة" }, { status: 400 });
  const { data, error } = await createAdminClient().from("categories").insert(parsed.data).select().single();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  revalidatePath("/");
  revalidatePath("/gallery");
  return NextResponse.json({ category: data }, { status: 201 });
}
