import { ArrowLeft, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { SiteSettings } from "@/types";
import { whatsappUrl } from "@/lib/utils";

export function Cta({ settings }: { settings: SiteSettings }) {
  return (
    <section className="pb-20 sm:pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2.25rem] bg-brand px-6 py-12 text-white shadow-[0_30px_80px_rgba(8,174,232,.25)] sm:px-10 lg:px-14">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="absolute -left-16 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold text-white/75">جاهز نبدأ؟</p>
              <h2 className="mt-2 text-balance text-3xl font-black sm:text-4xl">عندك فكرة جاهزة للطباعة؟</h2>
              <p className="mt-3 max-w-2xl leading-7 text-white/80">ابعت تفاصيل طلبك على واتساب وسنساعدك في اختيار نوع الطباعة والخامات والتشطيب المناسب.</p>
            </div>
            <a href={whatsappUrl(settings.whatsapp_number, "مرحبًا، لدي طلب طباعة وأريد معرفة التفاصيل والتكلفة.")} target="_blank" rel="noreferrer" className="focus-ring inline-flex min-h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 font-black text-brand-deep shadow-xl transition hover:-translate-y-0.5">
              <MessageCircle className="h-5 w-5" /> تواصل عبر واتساب <ArrowLeft className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
