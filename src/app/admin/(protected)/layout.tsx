import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <div className="min-h-screen bg-[#f5f9fb]">
      <AdminSidebar />
      <main className="min-h-screen lg:mr-72">
        <header className="border-b border-line bg-white px-5 py-5 sm:px-8 lg:px-10">
          <div className="mr-14 lg:mr-0">
            <p className="text-xs font-bold text-brand-dark">لوحة تحكم شعاع</p>
            <p className="mt-1 text-sm text-muted">مرحبًا، {user.display_name || user.email}</p>
          </div>
        </header>
        <div className="p-5 sm:p-8 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
