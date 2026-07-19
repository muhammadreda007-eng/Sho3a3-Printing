"use client";

import { Menu, PhoneCall, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { Container } from "@/components/ui/Container";
import { cn, telUrl } from "@/lib/utils";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/#services", label: "خدماتنا" },
  { href: "/gallery", label: "أعمالنا" },
  { href: "/contact", label: "تواصل معنا" },
];

export function Header({ primaryPhone }: { primaryPhone: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);


  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-white/90 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between gap-5">
        <SiteLogo compact />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="القائمة الرئيسية">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href.split("#")[0]);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "focus-ring rounded-full px-4 py-2 text-sm font-bold transition",
                  active ? "bg-brand-soft text-brand-dark" : "text-muted hover:bg-brand-pale hover:text-brand-deep",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <a
          href={telUrl(primaryPhone)}
          className="focus-ring hidden min-h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(8,174,232,.24)] transition hover:bg-brand-dark md:inline-flex"
        >
          <PhoneCall className="h-4 w-4" />
          اتصل الآن
        </a>
        <button
          type="button"
          className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-line text-brand-deep lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </Container>
      {open ? (
        <div className="border-t border-line bg-white lg:hidden">
          <Container className="grid gap-2 py-5">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-bold text-brand-deep hover:bg-brand-soft">
                {link.label}
              </Link>
            ))}
            <a href={telUrl(primaryPhone)} className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 font-bold text-white">
              <PhoneCall className="h-4 w-4" /> اتصل الآن
            </a>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
