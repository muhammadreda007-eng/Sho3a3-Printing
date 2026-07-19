import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertAdmin } from "@/lib/auth";
import { hasSupabaseAdminEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

const statusSchema = z.object({ status: z.enum(["new", "reviewed", "closed"]) });

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await assertAdmin())) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  if (!hasSupabaseAdminEnv) return NextResponse.json({ message: "Supabase غير مربوط" }, { status: 503 });
  const { id } = await params;
  const parsed = statusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "حالة غير صحيحة" }, { status: 400 });
  const { data, error } = await createAdminClient().from("contact_messages").update(parsed.data).eq("id", id).select().single();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ message: data });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await assertAdmin())) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  if (!hasSupabaseAdminEnv) return NextResponse.json({ message: "Supabase غير مربوط" }, { status: 503 });
  const { id } = await params;
  const { error } = await createAdminClient().from("contact_messages").delete().eq("id", id);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
