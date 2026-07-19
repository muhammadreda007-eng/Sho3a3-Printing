"use client";

import { CheckCircle2, Clock3, LoaderCircle, Phone, Trash2 } from "lucide-react";
import { useState } from "react";
import type { ContactMessage, MessageStatus } from "@/types";
import { formatArabicDate, telUrl } from "@/lib/utils";

const labels: Record<MessageStatus, string> = { new: "جديدة", reviewed: "تمت المراجعة", closed: "مغلقة" };

export function MessageManager({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [working, setWorking] = useState<string | null>(null);

  async function updateStatus(id: string, status: MessageStatus) {
    setWorking(id);
    const response = await fetch(`/api/messages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const result = await response.json();
    if (!response.ok) window.alert(result.message || "تعذر التحديث");
    else setMessages((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    setWorking(null);
  }

  async function remove(id: string) {
    if (!window.confirm("حذف الرسالة نهائيًا؟")) return;
    setWorking(id);
    const response = await fetch(`/api/messages/${id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) window.alert(result.message || "تعذر الحذف");
    else setMessages((current) => current.filter((item) => item.id !== id));
    setWorking(null);
  }

  return messages.length ? <div className="grid gap-5">{messages.map((message) => <article key={message.id} className="rounded-[1.5rem] border border-line bg-white p-6 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-black text-brand-deep">{message.name}</h2><span className={message.status === "new" ? "rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-dark" : message.status === "reviewed" ? "rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700" : "rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600"}>{labels[message.status]}</span></div><p className="mt-2 flex items-center gap-2 text-xs text-muted"><Clock3 className="h-4 w-4" />{formatArabicDate(message.created_at)}</p></div><div className="flex gap-2"><a href={telUrl(message.phone)} className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand-dark" aria-label="اتصال"><Phone className="h-4 w-4" /></a><button disabled={working === message.id} onClick={() => remove(message.id)} className="grid h-10 w-10 place-items-center rounded-xl border border-red-100 text-red-600 hover:bg-red-50">{working === message.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</button></div></div><div className="mt-5 grid gap-3 rounded-2xl bg-brand-pale p-5 text-sm"><p><strong className="text-brand-deep">الهاتف:</strong> <span dir="ltr">{message.phone}</span></p>{message.email ? <p><strong className="text-brand-deep">البريد:</strong> <span dir="ltr">{message.email}</span></p> : null}<p><strong className="text-brand-deep">الخدمة:</strong> {message.service}</p><p className="leading-7"><strong className="text-brand-deep">التفاصيل:</strong> {message.message}</p></div><div className="mt-4 flex flex-wrap gap-2">{message.status !== "reviewed" ? <button disabled={working === message.id} onClick={() => updateStatus(message.id, "reviewed")} className="inline-flex items-center gap-2 rounded-full border border-green-200 px-4 py-2 text-xs font-bold text-green-700 hover:bg-green-50"><CheckCircle2 className="h-4 w-4" />تمت المراجعة</button> : null}{message.status !== "closed" ? <button disabled={working === message.id} onClick={() => updateStatus(message.id, "closed")} className="rounded-full border border-line px-4 py-2 text-xs font-bold text-muted hover:bg-zinc-50">إغلاق الرسالة</button> : null}</div></article>)}</div> : <div className="rounded-[1.7rem] border border-dashed border-brand/30 bg-white px-6 py-16 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-brand" /><h2 className="mt-4 text-xl font-black text-brand-deep">لا توجد رسائل حاليًا</h2><p className="mt-2 text-sm text-muted">الرسائل المرسلة من صفحة التواصل ستظهر هنا.</p></div>;
}
