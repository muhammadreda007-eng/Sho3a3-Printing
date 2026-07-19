import { NextRequest, NextResponse } from "next/server";
import { hasSupabaseAdminEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { contactSchema } from "@/lib/validations";

const requests = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

function rateLimit(key: string) {
  const now = Date.now();
  const current = requests.get(key);
  if (!current || current.resetAt < now) {
    requests.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= MAX_REQUESTS) return false;
  current.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ message: "تم إرسال عدة طلبات. حاول مرة أخرى بعد قليل." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "بيانات الطلب غير صحيحة." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message || "راجع البيانات المدخلة." }, { status: 400 });
  }

  if (parsed.data.website) return NextResponse.json({ message: "تم إرسال طلبك بنجاح." });

  if (!hasSupabaseAdminEnv) {
    return NextResponse.json(
      { message: "نموذج التواصل يحتاج ربط Supabase أولًا. استخدم زر واتساب حاليًا." },
      { status: 503 },
    );
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    service: parsed.data.service,
    message: parsed.data.message,
    status: "new",
  });

  if (error) {
    console.error("contact insert error", error);
    return NextResponse.json({ message: "تعذر حفظ الطلب الآن. تواصل معنا عبر واتساب." }, { status: 500 });
  }

  return NextResponse.json({ message: "تم إرسال طلبك بنجاح، وسنتواصل معك في أقرب وقت." }, { status: 201 });
}
