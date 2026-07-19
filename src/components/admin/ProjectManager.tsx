"use client";

import Image from "next/image";
import { Check, CloudUpload, Edit3, FileImage, FileVideo, LoaderCircle, Plus, Search, Star, Trash2, X } from "lucide-react";
import { useMemo, useRef, useState, type FormEvent } from "react";
import type { Category, MediaType, Project, PublishStatus } from "@/types";
import { cn, formatFileSize, slugify, videoPosterFromCloudinary } from "@/lib/utils";

interface ProjectDraft {
  title: string;
  slug: string;
  description: string;
  category_id: string;
  media_type: MediaType;
  media_url: string;
  thumbnail_url: string;
  cloudinary_public_id: string;
  cloudinary_resource_type: MediaType;
  width: number | null;
  height: number | null;
  duration: number | null;
  file_size: number | null;
  is_featured: boolean;
  status: PublishStatus;
  sort_order: number;
}

const emptyDraft: ProjectDraft = {
  title: "",
  slug: "",
  description: "",
  category_id: "",
  media_type: "image",
  media_url: "",
  thumbnail_url: "",
  cloudinary_public_id: "",
  cloudinary_resource_type: "image",
  width: null,
  height: null,
  duration: null,
  file_size: null,
  is_featured: false,
  status: "draft",
  sort_order: 0,
};

function projectToDraft(project: Project): ProjectDraft {
  return {
    title: project.title,
    slug: project.slug,
    description: project.description ?? "",
    category_id: project.category_id ?? "",
    media_type: project.media_type,
    media_url: project.media_url ?? "",
    thumbnail_url: project.thumbnail_url ?? "",
    cloudinary_public_id: project.cloudinary_public_id ?? "",
    cloudinary_resource_type: project.cloudinary_resource_type ?? project.media_type,
    width: project.width ?? null,
    height: project.height ?? null,
    duration: project.duration ?? null,
    file_size: project.file_size ?? null,
    is_featured: project.is_featured,
    status: project.status,
    sort_order: project.sort_order,
  };
}

async function uploadToCloudinary(file: File, resourceType: MediaType) {
  const maxSize = resourceType === "video" ? 100 * 1024 * 1024 : 15 * 1024 * 1024;
  if (file.size > maxSize) throw new Error(resourceType === "video" ? "حجم الفيديو يجب ألا يتجاوز 100MB" : "حجم الصورة يجب ألا يتجاوز 15MB");
  if (resourceType === "image" && !file.type.startsWith("image/")) throw new Error("اختر ملف صورة صحيح");
  if (resourceType === "video" && !file.type.startsWith("video/")) throw new Error("اختر ملف فيديو صحيح");

  const signResponse = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resourceType }),
  });
  const signature = await signResponse.json();
  if (!signResponse.ok) throw new Error(signature.message || "تعذر تجهيز رفع الملف");

  const data = new FormData();
  data.append("file", file);
  data.append("api_key", signature.apiKey);
  data.append("timestamp", String(signature.timestamp));
  data.append("signature", signature.signature);
  data.append("folder", signature.folder);

  const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/${resourceType}/upload`, {
    method: "POST",
    body: data,
  });
  const result = await uploadResponse.json();
  if (!uploadResponse.ok) throw new Error(result.error?.message || "فشل رفع الملف");
  return result as {
    secure_url: string;
    public_id: string;
    resource_type: MediaType;
    width?: number;
    height?: number;
    duration?: number;
    bytes?: number;
  };
}

export function ProjectManager({ initialProjects, categories }: { initialProjects: Project[]; categories: Category[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [draft, setDraft] = useState<ProjectDraft>(emptyDraft);
  const [editing, setEditing] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const visibleProjects = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return projects;
    return projects.filter((project) => `${project.title} ${project.category?.name ?? ""}`.toLowerCase().includes(term));
  }, [projects, query]);

  function startCreate() {
    setEditing(null);
    setDraft(emptyDraft);
    setError("");
    setOpen(true);
  }

  function startEdit(project: Project) {
    setEditing(project);
    setDraft(projectToDraft(project));
    setError("");
    setOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setOpen(false);
    setEditing(null);
    setDraft(emptyDraft);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const file = fileRef.current?.files?.[0];
      let nextDraft = { ...draft };
      if (file) {
        const upload = await uploadToCloudinary(file, draft.media_type);
        nextDraft = {
          ...nextDraft,
          media_url: upload.secure_url,
          thumbnail_url: draft.media_type === "video" ? videoPosterFromCloudinary(upload.secure_url) ?? "" : upload.secure_url,
          cloudinary_public_id: upload.public_id,
          cloudinary_resource_type: upload.resource_type,
          width: upload.width ?? null,
          height: upload.height ?? null,
          duration: upload.duration ?? null,
          file_size: upload.bytes ?? file.size,
        };
      }

      if (!nextDraft.media_url) throw new Error("ارفع صورة أو فيديو للعمل قبل الحفظ");
      if (!nextDraft.category_id) throw new Error("اختر تصنيف العمل");

      const payload = {
        ...nextDraft,
        slug: nextDraft.slug || slugify(nextDraft.title),
        description: nextDraft.description || null,
        category_id: nextDraft.category_id || null,
        thumbnail_url: nextDraft.thumbnail_url || null,
        cloudinary_public_id: nextDraft.cloudinary_public_id || null,
        cloudinary_resource_type: nextDraft.cloudinary_resource_type || nextDraft.media_type,
      };

      const response = await fetch(editing ? `/api/projects/${editing.id}` : "/api/projects", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "تعذر حفظ العمل");
      const saved = result.project as Project;
      setProjects((current) => editing ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]);
      closeModal();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "حدث خطأ غير متوقع");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(project: Project) {
    if (!window.confirm(`حذف «${project.title}» نهائيًا؟ سيتم حذف الملف من Cloudinary أيضًا.`)) return;
    setDeletingId(project.id);
    try {
      const response = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "تعذر الحذف");
      setProjects((current) => current.filter((item) => item.id !== project.id));
    } catch (deleteError) {
      window.alert(deleteError instanceof Error ? deleteError.message : "تعذر الحذف");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full max-w-md">
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 w-full rounded-full border border-line bg-white pr-12 pl-5 text-sm outline-none focus:border-brand" placeholder="ابحث بالاسم أو التصنيف…" />
        </label>
        <button onClick={startCreate} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-bold text-white shadow-lg hover:bg-brand-dark"><Plus className="h-5 w-5" />إضافة عمل</button>
      </div>

      {visibleProjects.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => {
            const source = project.media_type === "video" ? project.thumbnail_url || videoPosterFromCloudinary(project.media_url) : project.media_url;
            return (
              <article key={project.id} className="overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-brand-pale">
                  {source ? <Image src={source} alt={project.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : <div className="grid h-full place-items-center text-brand">{project.media_type === "video" ? <FileVideo className="h-12 w-12" /> : <FileImage className="h-12 w-12" />}</div>}
                  <div className="absolute right-3 top-3 flex gap-2">
                    <span className={cn("rounded-full px-3 py-1 text-xs font-bold", project.status === "published" ? "bg-green-600 text-white" : "bg-amber-100 text-amber-800")}>{project.status === "published" ? "منشور" : "مسودة"}</span>
                    {project.is_featured ? <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-amber-500 shadow"><Star className="h-4 w-4" fill="currentColor" /></span> : null}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-brand-dark">{project.category?.name ?? "بدون تصنيف"} · {project.media_type === "video" ? "فيديو" : "صورة"}</p>
                  <h3 className="mt-2 text-lg font-black text-brand-deep">{project.title}</h3>
                  <p className="mt-2 text-xs text-muted">{formatFileSize(project.file_size)}</p>
                  <div className="mt-5 flex gap-2">
                    <button onClick={() => startEdit(project)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-bold text-brand-deep hover:border-brand"><Edit3 className="h-4 w-4" />تعديل</button>
                    <button disabled={deletingId === project.id} onClick={() => deleteProject(project)} className="grid h-11 w-11 place-items-center rounded-xl border border-red-100 text-red-600 hover:bg-red-50 disabled:opacity-50">{deletingId === project.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[1.7rem] border border-dashed border-brand/30 bg-white px-6 py-16 text-center"><CloudUpload className="mx-auto h-12 w-12 text-brand" /><h2 className="mt-4 text-xl font-black text-brand-deep">لم تتم إضافة أعمال بعد</h2><p className="mt-2 text-sm text-muted">ارفع أول صورة أو فيديو ليظهر في معرض الموقع.</p></div>
      )}

      {open ? (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-brand-deep/70 p-4 backdrop-blur-sm">
          <div className="mx-auto my-6 w-full max-w-3xl rounded-[2rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div><p className="text-xs font-bold text-brand-dark">إدارة المعرض</p><h2 className="mt-1 text-2xl font-black text-brand-deep">{editing ? "تعديل العمل" : "إضافة عمل جديد"}</h2></div>
              <button onClick={closeModal} className="grid h-11 w-11 place-items-center rounded-full border border-line text-brand-deep" aria-label="إغلاق"><X /></button>
            </div>
            <form onSubmit={handleSave} className="p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-brand-deep sm:col-span-2">اسم العمل<input required value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value, slug: editing ? current.slug : slugify(event.target.value) }))} className="h-12 rounded-xl border border-line px-4 font-normal outline-none focus:border-brand" placeholder="مثال: طباعة كتاب تعليمي" /></label>
                <label className="grid gap-2 text-sm font-bold text-brand-deep">الرابط المختصر<input required value={draft.slug} onChange={(event) => setDraft((current) => ({ ...current, slug: slugify(event.target.value) }))} dir="ltr" className="h-12 rounded-xl border border-line px-4 text-right font-normal outline-none focus:border-brand" /></label>
                <label className="grid gap-2 text-sm font-bold text-brand-deep">التصنيف<select required value={draft.category_id} onChange={(event) => setDraft((current) => ({ ...current, category_id: event.target.value }))} className="h-12 rounded-xl border border-line px-4 font-normal outline-none focus:border-brand"><option value="">اختر التصنيف</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
                <label className="grid gap-2 text-sm font-bold text-brand-deep sm:col-span-2">وصف مختصر<textarea value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} rows={3} className="rounded-xl border border-line px-4 py-3 font-normal leading-7 outline-none focus:border-brand" /></label>
                <fieldset className="sm:col-span-2"><legend className="mb-2 text-sm font-bold text-brand-deep">نوع الملف</legend><div className="grid grid-cols-2 gap-3">{(["image", "video"] as MediaType[]).map((type) => <button type="button" key={type} onClick={() => { setDraft((current) => ({ ...current, media_type: type, cloudinary_resource_type: type })); if (fileRef.current) fileRef.current.value = ""; }} className={cn("flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold", draft.media_type === type ? "border-brand bg-brand-soft text-brand-dark" : "border-line text-muted")}>{type === "image" ? <FileImage className="h-5 w-5" /> : <FileVideo className="h-5 w-5" />}{type === "image" ? "صورة" : "فيديو"}</button>)}</div></fieldset>
                <label className="grid gap-2 text-sm font-bold text-brand-deep sm:col-span-2">{editing ? "استبدال الملف (اختياري)" : "رفع الملف"}<span className="rounded-2xl border-2 border-dashed border-brand/25 bg-brand-pale p-6 text-center"><CloudUpload className="mx-auto h-9 w-9 text-brand" /><span className="mt-3 block text-sm font-bold text-brand-deep">اختر {draft.media_type === "video" ? "فيديو MP4 أو WebM" : "صورة JPG أو PNG أو WebP"}</span><span className="mt-1 block text-xs font-normal text-muted">الحد الأقصى: {draft.media_type === "video" ? "100MB" : "15MB"}</span><input ref={fileRef} type="file" accept={draft.media_type === "video" ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp,image/avif"} className="mt-4 block w-full text-xs font-normal text-muted file:ml-4 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:font-bold file:text-white" /></span></label>
                <label className="grid gap-2 text-sm font-bold text-brand-deep">حالة النشر<select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as PublishStatus }))} className="h-12 rounded-xl border border-line px-4 font-normal outline-none focus:border-brand"><option value="draft">مسودة</option><option value="published">منشور</option></select></label>
                <label className="grid gap-2 text-sm font-bold text-brand-deep">الترتيب<input type="number" min={0} value={draft.sort_order} onChange={(event) => setDraft((current) => ({ ...current, sort_order: Number(event.target.value) }))} className="h-12 rounded-xl border border-line px-4 font-normal outline-none focus:border-brand" /></label>
                <label className="flex items-center gap-3 rounded-xl border border-line p-4 text-sm font-bold text-brand-deep sm:col-span-2"><input type="checkbox" checked={draft.is_featured} onChange={(event) => setDraft((current) => ({ ...current, is_featured: event.target.checked }))} className="h-5 w-5 accent-[#08aee8]" />عرض العمل ضمن الأعمال المميزة في الرئيسية</label>
              </div>
              {error ? <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={closeModal} className="min-h-12 rounded-full border border-line px-6 text-sm font-bold text-muted">إلغاء</button><button disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60">{saving ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}{saving ? "جارٍ الرفع والحفظ…" : "حفظ العمل"}</button></div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
