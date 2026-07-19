import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth";
import { hasSupabaseAdminEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { categorySchema } from "@/lib/validations";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await assertAdmin())) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  if (!hasSupabaseAdminEnv) return NextResponse.json({ message: "Supabase غير مربوط" }, { status: 503 });
  const { id } = await params;
  const parsed = categorySchema.partial().safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || "بيانات غير صحيحة" }, { status: 400 });
  const { data, error } = await createAdminClient().from("categories").update(parsed.data).eq("id", id).select().single();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  revalidatePath("/");
  revalidatePath("/gallery");
  return NextResponse.json({ category: data });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await assertAdmin())) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  if (!hasSupabaseAdminEnv) return NextResponse.json({ message: "Supabase غير مربوط" }, { status: 503 });
  const { id } = await params;
  const { error } = await createAdminClient().from("categories").delete().eq("id", id);
  if (error) return NextResponse.json({ message: "لا يمكن حذف قسم مرتبط بأعمال. أخفه بدلًا من ذلك." }, { status: 409 });
  revalidatePath("/");
  revalidatePath("/gallery");
  return NextResponse.json({ success: true });
}
