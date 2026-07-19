import Image from "next/image";
import { ArrowLeft, CheckCircle2, Clock3, MapPin, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import type { SiteSettings } from "@/types";
import { whatsappUrl } from "@/lib/utils";

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative overflow-hidden bg-brand-pale">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-brand/15 blur-3xl" />
      <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-[#83d9f8]/25 blur-3xl" />
      <Container className="relative grid min-h-[720px] items-center gap-12 py-16 lg:grid-cols-[1fr_.92fr] lg:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white px-4 py-2 text-sm font-bold text-brand-dark shadow-sm">
            <Sparkles className="h-4 w-4" /> شعاع بيت الطباعة — حلوان
          </div>
          <h1 className="text-balance mt-7 max-w-3xl text-4xl font-black leading-[1.25] text-brand-deep sm:text-5xl lg:text-[4rem]">
            {settings.hero_title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">{settings.hero_description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappUrl(settings.whatsapp_number, "مرحبًا، أريد طلب عرض سعر لخدمة طباعة.")}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-brand px-7 py-3 font-bold text-white shadow-[0_15px_35px_rgba(8,174,232,.28)] transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              اطلب عرض سعر <ArrowLeft className="h-4 w-4" />
            </a>
            <LinkButton href="/gallery" variant="secondary">شاهد أعمالنا</LinkButton>
          </div>
          <div className="mt-10 grid max-w-xl gap-3 text-sm text-brand-deep sm:grid-cols-2">
            <p className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-brand" /> جودة طباعة وتشطيب متكامل</p>
            <p className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-brand" /> {settings.working_hours}</p>
            <p className="flex items-center gap-2 sm:col-span-2"><MapPin className="h-5 w-5 shrink-0 text-brand" /> بالقرب من محطة مترو حلوان</p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
          <div className="absolute -inset-5 rotate-3 rounded-[2.5rem] bg-brand/10" />
          <div className="relative overflow-hidden rounded-[2.25rem] border-[8px] border-white bg-brand shadow-[0_30px_80px_rgba(7,80,108,.22)]">
          <Image
           src="/brand/favicon.png"
           alt="خدمات شعاع للطباعة"
           width={1080}
           height={1080}
           className="h-auto w-full object-contain"
            priority
          />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/35 via-transparent to-transparent" />
          </div>
          <div className="animate-float-soft absolute -bottom-6 -right-2 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur sm:-right-7 sm:p-5">
            <p className="text-xs font-bold text-brand-dark">من الفكرة إلى التسليم</p>
            <p className="mt-1 text-lg font-black text-brand-deep">تصميم · طباعة · تشطيب</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
