"use client";

import { FolderKanban, Images, LayoutDashboard, LogOut, Menu, MessageSquareText, Settings, Tags, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { cn } from "@/lib/utils";
import { logout } from "@/app/admin/(protected)/actions";

const nav = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/admin/projects", label: "الأعمال والوسائط", icon: Images },
  { href: "/admin/categories", label: "التصنيفات", icon: Tags },
  { href: "/admin/messages", label: "رسائل العملاء", icon: MessageSquareText },
  { href: "/admin/settings", label: "إعدادات الموقع", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const panel = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 p-5"><SiteLogo inverted /></div>
      <nav className="flex-1 space-y-1 p-4">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition", active ? "bg-white text-brand-deep" : "text-white/70 hover:bg-white/10 hover:text-white")}>
              <Icon className="h-5 w-5" />{item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <Link href="/gallery" target="_blank" className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white"><FolderKanban className="h-5 w-5" />عرض الموقع</Link>
        <form action={logout}>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/70 hover:bg-red-500/15 hover:text-white"><LogOut className="h-5 w-5" />تسجيل الخروج</button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-72 bg-brand-deep lg:block">{panel}</aside>
      <button onClick={() => setOpen(true)} className="fixed right-4 top-4 z-30 grid h-11 w-11 place-items-center rounded-xl bg-brand-deep text-white shadow-xl lg:hidden" aria-label="فتح قائمة الإدارة"><Menu /></button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-brand-deep/70 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-[86%] max-w-72 bg-brand-deep" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute left-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white" aria-label="إغلاق"><X /></button>
            {panel}
          </aside>
        </div>
      ) : null}
    </>
  );
}
