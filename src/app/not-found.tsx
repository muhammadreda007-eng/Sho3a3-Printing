import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-brand-pale p-5 text-center"><div><p className="text-8xl font-black text-brand">404</p><h1 className="mt-4 text-3xl font-black text-brand-deep">الصفحة غير موجودة</h1><p className="mt-3 text-muted">الرابط الذي فتحته غير صحيح أو تم نقله.</p><Link href="/" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-6 font-bold text-white"><ArrowRight className="h-4 w-4" />العودة للرئيسية</Link></div></main>;
}
