import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "دخول الإدارة", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-brand-pale p-5">
      <div className="absolute inset-0 grid-pattern" />
      <section className="relative w-full max-w-md rounded-[2rem] border border-line bg-white p-7 shadow-[0_30px_90px_rgba(7,80,108,.16)] sm:p-9">
        <SiteLogo />
        <h1 className="mt-8 text-3xl font-black text-brand-deep">دخول الإدارة</h1>
        <p className="mt-2 text-sm leading-7 text-muted">لوحة التحكم مخصصة لإدارة الأعمال، الصور، الفيديوهات، الرسائل وبيانات الموقع.</p>
        <LoginForm />
        <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-dark hover:text-brand"><ArrowRight className="h-4 w-4" />العودة إلى الموقع</Link>
      </section>
    </main>
  );
}
