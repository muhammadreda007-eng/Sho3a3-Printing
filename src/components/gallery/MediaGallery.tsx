"use client";

import Image from "next/image";
import { BookOpenText, Brush, Clapperboard, Expand, ImageIcon, Layers3, MonitorUp, Play, Scissors, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Category, Project } from "@/types";
import { cn, videoPosterFromCloudinary } from "@/lib/utils";

const iconMap = {
  books: BookOpenText,
  offset: Layers3,
  digital: ImageIcon,
  "indoor-outdoor": MonitorUp,
  banners: ImageIcon,
  design: Brush,
  finishing: Scissors,
};

function ProjectVisual({ project, priority = false }: { project: Project; priority?: boolean }) {
  const source = project.media_type === "video"
    ? project.thumbnail_url || videoPosterFromCloudinary(project.media_url)
    : project.media_url;
  const Icon = iconMap[(project.category?.slug ?? "") as keyof typeof iconMap] ?? (project.media_type === "video" ? Clapperboard : ImageIcon);

  if (source) {
    return (
      <Image
        src={source}
        alt={project.title}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition duration-700 group-hover:scale-105"
      />
    );
  }

  return (
    <div className="absolute inset-0 grid-pattern bg-gradient-to-br from-brand-soft via-white to-[#c8effc]">
      <div className="absolute -left-10 -top-14 h-40 w-40 rounded-full bg-brand/15 blur-2xl" />
      <div className="absolute -bottom-14 -right-12 h-44 w-44 rounded-full bg-brand-dark/10 blur-2xl" />
      <div className="relative grid h-full place-items-center">
        <span className="grid h-24 w-24 place-items-center rounded-[2rem] border border-white bg-white/80 text-brand shadow-[0_20px_50px_rgba(8,174,232,.16)] backdrop-blur">
          <Icon className="h-11 w-11" strokeWidth={1.6} />
        </span>
      </div>
    </div>
  );
}

export function MediaGallery({
  projects,
  categories,
  showFilters = true,
  compact = false,
}: {
  projects: Project[];
  categories: Category[];
  showFilters?: boolean;
  compact?: boolean;
}) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((project) => project.category?.slug === filter)),
    [filter, projects],
  );

  return (
    <>
      {showFilters ? (
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="تصنيفات الأعمال">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn("focus-ring rounded-full border px-4 py-2 text-sm font-bold transition", filter === "all" ? "border-brand bg-brand text-white" : "border-line bg-white text-muted hover:border-brand")}
          >
            الكل
          </button>
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              onClick={() => setFilter(category.slug)}
              className={cn("focus-ring rounded-full border px-4 py-2 text-sm font-bold transition", filter === category.slug ? "border-brand bg-brand text-white" : "border-line bg-white text-muted hover:border-brand")}
            >
              {category.name}
            </button>
          ))}
        </div>
      ) : null}

      {filtered.length ? (
        <div className={cn("grid gap-5", compact ? "md:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3")}>
          {filtered.map((project, index) => (
            <button
              type="button"
              key={project.id}
              onClick={() => setSelected(project)}
              className="group focus-ring overflow-hidden rounded-[1.75rem] border border-line bg-white text-right shadow-[0_14px_50px_rgba(16,42,56,.07)] transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_22px_60px_rgba(8,174,232,.14)]"
            >
              <div className={cn("relative overflow-hidden", compact ? "aspect-[4/3]" : "aspect-[4/3]")}>
                <ProjectVisual project={project} priority={index < 3} />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-brand-deep opacity-0 shadow-lg transition group-hover:opacity-100">
                  {project.media_type === "video" ? <Play className="h-4 w-4" fill="currentColor" /> : <Expand className="h-4 w-4" />}
                </span>
                {project.media_type === "video" ? (
                  <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-brand-deep/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                    <Play className="h-3.5 w-3.5" fill="currentColor" /> فيديو
                  </span>
                ) : null}
              </div>
              <div className="p-5">
                <p className="text-xs font-bold text-brand-dark">{project.category?.name ?? "أعمال شعاع"}</p>
                <h3 className="mt-2 text-lg font-black text-brand-deep">{project.title}</h3>
                {project.description ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{project.description}</p> : null}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-brand/35 bg-brand-pale px-6 py-16 text-center">
          <ImageIcon className="mx-auto h-10 w-10 text-brand" />
          <h3 className="mt-4 text-lg font-black text-brand-deep">لا توجد أعمال في هذا القسم حاليًا</h3>
          <p className="mt-2 text-sm text-muted">يمكن إضافة الصور والفيديوهات بسهولة من لوحة التحكم.</p>
        </div>
      )}

      {selected ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-brand-deep/85 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelected(null)}>
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setSelected(null)} className="focus-ring absolute left-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-white text-brand-deep shadow-lg" aria-label="إغلاق">
              <X />
            </button>
            <div className="relative aspect-video bg-brand-deep">
              {selected.media_type === "video" && selected.media_url ? (
                <video controls autoPlay className="h-full w-full object-contain" poster={selected.thumbnail_url || videoPosterFromCloudinary(selected.media_url) || undefined}>
                  <source src={selected.media_url} />
                  متصفحك لا يدعم تشغيل الفيديو.
                </video>
              ) : (
                <ProjectVisual project={selected} />
              )}
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs font-bold text-brand-dark">{selected.category?.name ?? "أعمال شعاع"}</p>
              <h3 className="mt-2 text-2xl font-black text-brand-deep">{selected.title}</h3>
              {selected.description ? <p className="mt-3 leading-7 text-muted">{selected.description}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
