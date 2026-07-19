"use client";

import { CheckCircle2, LoaderCircle, Save, TriangleAlert } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { SiteSettings } from "@/types";

export function SettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [phoneText, setPhoneText] = useState(initialSettings.phone_numbers.join("\n"));
  const [state, setState] = useState<{ loading: boolean; error?: string; success?: string }>({ loading: false });

  async function save(event: FormEvent) {
    event.preventDefault();
    setState({ loading: true });
    const payload = { ...settings, phone_numbers: phoneText.split(/\n|,/).map((value) => value.trim()).filter(Boolean) };
    try {
      const response = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "تعذر حفظ الإعدادات");
      setSettings(result.settings);
      setState({ loading: false, success: "تم حفظ بيانات الموقع بنجاح." });
    } catch (error) {
      setState({ loading: false, error: error instanceof Error ? error.message : "حدث خطأ" });
    }
  }

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  const input = "h-12 rounded-xl border border-line bg-white px-4 font-normal outline-none focus:border-brand";
  const textarea = "rounded-xl border border-line bg-white px-4 py-3 font-normal leading-7 outline-none focus:border-brand";

  return <form onSubmit={save} className="rounded-[1.7rem] border border-line bg-white p-6 shadow-sm sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-bold text-brand-deep">اسم الموقع<input required value={settings.site_name} onChange={(e) => update("site_name", e.target.value)} className={input} /></label><label className="grid gap-2 text-sm font-bold text-brand-deep">الشعار المختصر<input required value={settings.tagline} onChange={(e) => update("tagline", e.target.value)} className={input} /></label><label className="grid gap-2 text-sm font-bold text-brand-deep sm:col-span-2">عنوان الـHero<input required value={settings.hero_title} onChange={(e) => update("hero_title", e.target.value)} className={input} /></label><label className="grid gap-2 text-sm font-bold text-brand-deep sm:col-span-2">وصف الـHero<textarea required rows={3} value={settings.hero_description} onChange={(e) => update("hero_description", e.target.value)} className={textarea} /></label><label className="grid gap-2 text-sm font-bold text-brand-deep">أرقام الاتصال — رقم في كل سطر<textarea required rows={4} value={phoneText} onChange={(e) => setPhoneText(e.target.value)} dir="ltr" className={`${textarea} text-right`} /></label><label className="grid gap-2 text-sm font-bold text-brand-deep">رقم واتساب<input required value={settings.whatsapp_number} onChange={(e) => update("whatsapp_number", e.target.value)} dir="ltr" className={`${input} text-right`} /><span className="text-xs font-normal text-muted">اكتب كود الدولة، مثال: +2010...</span></label><label className="grid gap-2 text-sm font-bold text-brand-deep sm:col-span-2">العنوان<textarea required rows={3} value={settings.address} onChange={(e) => update("address", e.target.value)} className={textarea} /></label><label className="grid gap-2 text-sm font-bold text-brand-deep">رابط اللوكيشن<input required type="url" value={settings.maps_url} onChange={(e) => update("maps_url", e.target.value)} dir="ltr" className={`${input} text-right`} /></label><label className="grid gap-2 text-sm font-bold text-brand-deep">مواعيد العمل<input required value={settings.working_hours} onChange={(e) => update("working_hours", e.target.value)} className={input} /></label><label className="grid gap-2 text-sm font-bold text-brand-deep">Facebook<input type="url" value={settings.facebook_url ?? ""} onChange={(e) => update("facebook_url", e.target.value)} dir="ltr" className={`${input} text-right`} /></label><label className="grid gap-2 text-sm font-bold text-brand-deep">Instagram<input type="url" value={settings.instagram_url ?? ""} onChange={(e) => update("instagram_url", e.target.value)} dir="ltr" className={`${input} text-right`} /></label><label className="grid gap-2 text-sm font-bold text-brand-deep">TikTok<input type="url" value={settings.tiktok_url ?? ""} onChange={(e) => update("tiktok_url", e.target.value)} dir="ltr" className={`${input} text-right`} /></label><label className="grid gap-2 text-sm font-bold text-brand-deep">البريد الإلكتروني<input type="email" value={settings.email ?? ""} onChange={(e) => update("email", e.target.value)} dir="ltr" className={`${input} text-right`} /></label></div>{state.error ? <p className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"><TriangleAlert className="h-5 w-5" />{state.error}</p> : null}{state.success ? <p className="mt-6 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700"><CheckCircle2 className="h-5 w-5" />{state.success}</p> : null}<button disabled={state.loading} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 font-bold text-white hover:bg-brand-dark disabled:opacity-60">{state.loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}{state.loading ? "جارٍ الحفظ…" : "حفظ التغييرات"}</button></form>;
}
