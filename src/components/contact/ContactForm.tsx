"use client";

import { CheckCircle2, LoaderCircle, Send, TriangleAlert } from "lucide-react";
import { useState, type FormEvent } from "react";
import { services } from "@/data/site";

interface FormState {
  type: "idle" | "loading" | "success" | "error";
  message?: string;
}

export function ContactForm() {
  const [state, setState] = useState<FormState>({ type: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ type: "loading" });
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "تعذر إرسال الرسالة");
      form.reset();
      setState({ type: "success", message: result.message || "تم إرسال طلبك بنجاح." });
    } catch (error) {
      setState({ type: "error", message: error instanceof Error ? error.message : "حدث خطأ غير متوقع" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-line bg-white p-6 shadow-[0_20px_60px_rgba(16,42,56,.08)] sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-brand-deep">
          الاسم
          <input required name="name" autoComplete="name" className="focus-ring h-12 rounded-xl border border-line bg-brand-pale/50 px-4 font-normal outline-none transition focus:border-brand" placeholder="اسمك بالكامل" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-brand-deep">
          رقم الهاتف
          <input required name="phone" inputMode="tel" autoComplete="tel" dir="ltr" className="focus-ring h-12 rounded-xl border border-line bg-brand-pale/50 px-4 text-right font-normal outline-none transition focus:border-brand" placeholder="01xxxxxxxxx" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-brand-deep">
          البريد الإلكتروني <span className="font-normal text-muted">(اختياري)</span>
          <input name="email" type="email" autoComplete="email" dir="ltr" className="focus-ring h-12 rounded-xl border border-line bg-brand-pale/50 px-4 text-right font-normal outline-none transition focus:border-brand" placeholder="name@example.com" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-brand-deep">
          الخدمة المطلوبة
          <select required name="service" defaultValue="" className="focus-ring h-12 rounded-xl border border-line bg-brand-pale/50 px-4 font-normal outline-none transition focus:border-brand">
            <option value="" disabled>اختر الخدمة</option>
            {services.map((service) => <option key={service.slug} value={service.title}>{service.title}</option>)}
            <option value="خدمة أخرى">خدمة أخرى</option>
          </select>
        </label>
      </div>
      <label className="mt-5 grid gap-2 text-sm font-bold text-brand-deep">
        تفاصيل الطلب
        <textarea required name="message" rows={6} className="focus-ring resize-y rounded-xl border border-line bg-brand-pale/50 px-4 py-3 font-normal leading-7 outline-none transition focus:border-brand" placeholder="اكتب الكمية والمقاس ونوع المنتج والموعد المطلوب…" />
      </label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {state.type === "success" ? (
        <p className="mt-5 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700"><CheckCircle2 className="h-5 w-5" />{state.message}</p>
      ) : null}
      {state.type === "error" ? (
        <p className="mt-5 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"><TriangleAlert className="h-5 w-5" />{state.message}</p>
      ) : null}

      <button type="submit" disabled={state.type === "loading"} className="focus-ring mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-7 font-bold text-white shadow-[0_12px_30px_rgba(8,174,232,.24)] transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto">
        {state.type === "loading" ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        {state.type === "loading" ? "جارٍ الإرسال…" : "إرسال الطلب"}
      </button>
    </form>
  );
}
