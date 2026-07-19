import { CircleGauge, Images, MessageSquareText, PlaySquare } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getDashboardStats } from "@/lib/data";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const cards = [
    { label: "إجمالي الأعمال", value: stats.projects, icon: Images },
    { label: "الأعمال المنشورة", value: stats.published, icon: CircleGauge },
    { label: "الفيديوهات", value: stats.videos, icon: PlaySquare },
    { label: "رسائل جديدة", value: stats.newMessages, icon: MessageSquareText },
  ];
  return (
    <>
      <AdminPageHeader title="نظرة عامة" description="متابعة محتوى الموقع والرسائل من مكان واحد." />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return <article key={card.label} className="rounded-[1.6rem] border border-line bg-white p-6 shadow-sm"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-dark"><Icon /></span><p className="mt-5 text-sm font-bold text-muted">{card.label}</p><p className="mt-1 text-4xl font-black text-brand-deep">{card.value}</p></article>;
        })}
      </div>
      <div className="mt-8 rounded-[1.7rem] border border-brand/20 bg-brand-soft p-6">
        <h2 className="text-lg font-black text-brand-deep">بداية الاستخدام</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">أضف تصنيفات الأعمال أولًا، ثم ارفع الصور أو الفيديوهات من صفحة الأعمال. الملفات تُرفع إلى Cloudinary وبياناتها تُحفظ في Supabase.</p>
      </div>
    </>
  );
}
