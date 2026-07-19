"use client";

import { Check, Edit3, LoaderCircle, Plus, Trash2, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Category } from "@/types";
import { slugify } from "@/lib/utils";

interface Draft {
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

const emptyDraft: Draft = { name: "", slug: "", description: "", sort_order: 0, is_active: true };

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editing, setEditing] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function createNew() {
    setEditing(null);
    setDraft(emptyDraft);
    setError("");
    setOpen(true);
  }

  function edit(category: Category) {
    setEditing(category);
    setDraft({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      sort_order: category.sort_order,
      is_active: category.is_active,
    });
    setError("");
    setOpen(true);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(editing ? `/api/categories/${editing.id}` : "/api/categories", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, description: draft.description || null }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "تعذر الحفظ");
      const saved = result.category as Category;
      setCategories((current) => editing ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved].sort((a, b) => a.sort_order - b.sort_order));
      setOpen(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  }

  async function remove(category: Category) {
    if (!window.confirm(`حذف تصنيف «${category.name}»؟`)) return;
    const response = await fetch(`/api/categories/${category.id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) return window.alert(result.message || "تعذر الحذف");
    setCategories((current) => current.filter((item) => item.id !== category.id));
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button onClick={createNew} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-bold text-white hover:bg-brand-dark"><Plus className="h-5 w-5" />إضافة تصنيف</button>
      </div>
      <div className="overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-right text-sm">
            <thead className="bg-brand-pale text-brand-deep"><tr><th className="px-5 py-4">الترتيب</th><th className="px-5 py-4">الاسم</th><th className="px-5 py-4">Slug</th><th className="px-5 py-4">الحالة</th><th className="px-5 py-4">الإجراءات</th></tr></thead>
            <tbody className="divide-y divide-line">
              {categories.map((category) => <tr key={category.id} className="hover:bg-brand-pale/40"><td className="px-5 py-4 font-bold text-muted">{category.sort_order}</td><td className="px-5 py-4 font-black text-brand-deep">{category.name}</td><td className="px-5 py-4 font-mono text-xs text-muted" dir="ltr">{category.slug}</td><td className="px-5 py-4"><span className={category.is_active ? "rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700" : "rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600"}>{category.is_active ? "ظاهر" : "مخفي"}</span></td><td className="px-5 py-4"><div className="flex gap-2"><button onClick={() => edit(category)} className="grid h-10 w-10 place-items-center rounded-xl border border-line text-brand-deep hover:border-brand"><Edit3 className="h-4 w-4" /></button><button onClick={() => remove(category)} className="grid h-10 w-10 place-items-center rounded-xl border border-red-100 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}
              {!categories.length ? <tr><td colSpan={5} className="px-5 py-12 text-center text-muted">لا توجد تصنيفات.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>

      {open ? <div className="fixed inset-0 z-[80] grid place-items-center bg-brand-deep/70 p-4 backdrop-blur-sm"><div className="w-full max-w-lg rounded-[1.75rem] bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-line px-6 py-5"><h2 className="text-xl font-black text-brand-deep">{editing ? "تعديل التصنيف" : "إضافة تصنيف"}</h2><button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-line"><X /></button></div><form onSubmit={save} className="grid gap-5 p-6"><label className="grid gap-2 text-sm font-bold text-brand-deep">الاسم<input required value={draft.name} onChange={(e) => setDraft((current) => ({ ...current, name: e.target.value, slug: editing ? current.slug : slugify(e.target.value) }))} className="h-12 rounded-xl border border-line px-4 font-normal outline-none focus:border-brand" /></label><label className="grid gap-2 text-sm font-bold text-brand-deep">Slug<input required value={draft.slug} onChange={(e) => setDraft((current) => ({ ...current, slug: slugify(e.target.value) }))} dir="ltr" className="h-12 rounded-xl border border-line px-4 text-right font-normal outline-none focus:border-brand" /></label><label className="grid gap-2 text-sm font-bold text-brand-deep">الوصف<input value={draft.description} onChange={(e) => setDraft((current) => ({ ...current, description: e.target.value }))} className="h-12 rounded-xl border border-line px-4 font-normal outline-none focus:border-brand" /></label><label className="grid gap-2 text-sm font-bold text-brand-deep">الترتيب<input type="number" min={0} value={draft.sort_order} onChange={(e) => setDraft((current) => ({ ...current, sort_order: Number(e.target.value) }))} className="h-12 rounded-xl border border-line px-4 font-normal outline-none focus:border-brand" /></label><label className="flex items-center gap-3 rounded-xl border border-line p-4 text-sm font-bold text-brand-deep"><input type="checkbox" checked={draft.is_active} onChange={(e) => setDraft((current) => ({ ...current, is_active: e.target.checked }))} className="h-5 w-5 accent-[#08aee8]" />إظهار التصنيف في الموقع</label>{error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}<button disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 font-bold text-white disabled:opacity-60">{saving ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}{saving ? "جارٍ الحفظ…" : "حفظ التصنيف"}</button></form></div></div> : null}
    </>
  );
}
