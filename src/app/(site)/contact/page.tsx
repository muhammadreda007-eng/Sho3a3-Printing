import type { Metadata } from "next";
import { Clock3, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";
import { getSettings } from "@/lib/data";
import { telUrl, whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "تواصل مع شعاع للطباعة في حلوان واطلب عرض سعر لخدمات الطباعة والتصميم والتشطيب.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await getSettings();
  const mapQuery = encodeURIComponent("48 Sherif Street, Helwan, Cairo, Egypt");

  return (
    <>
      <section className="relative overflow-hidden bg-brand-pale py-16 sm:py-20">
        <div className="absolute inset-0 grid-pattern" />
        <Container className="relative text-center">
          <p className="text-sm font-bold text-brand-dark">تواصل معنا</p>
          <h1 className="mt-2 text-balance text-4xl font-black text-brand-deep sm:text-5xl">خلينا نعرف تفاصيل طلبك</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted">تواصل معنا مباشرة أو املأ النموذج وسنراجع تفاصيل الخدمة المطلوبة.</p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
            <div className="space-y-5">
              <article className="rounded-[1.6rem] border border-line bg-white p-6 shadow-sm">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-dark"><PhoneCall /></span>
                <h2 className="mt-4 text-lg font-black text-brand-deep">أرقام التواصل</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {settings.phone_numbers.map((number) => <a key={number} href={telUrl(number)} dir="ltr" className="rounded-full bg-brand-pale px-4 py-2 text-sm font-bold text-brand-dark hover:bg-brand-soft">{number}</a>)}
                </div>
              </article>
              <article className="rounded-[1.6rem] border border-line bg-white p-6 shadow-sm">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e9fbef] text-[#159447]"><MessageCircle /></span>
                <h2 className="mt-4 text-lg font-black text-brand-deep">واتساب</h2>
                <a href={whatsappUrl(settings.whatsapp_number, "مرحبًا، أريد الاستفسار عن خدمات الطباعة.")} target="_blank" rel="noreferrer" dir="ltr" className="mt-3 inline-block font-bold text-brand-dark hover:text-brand">{settings.whatsapp_number}</a>
              </article>
              <article className="rounded-[1.6rem] border border-line bg-white p-6 shadow-sm">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-dark"><MapPin /></span>
                <h2 className="mt-4 text-lg font-black text-brand-deep">العنوان</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{settings.address}</p>
                <a href={settings.maps_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark">فتح اللوكيشن</a>
              </article>
              <article className="rounded-[1.6rem] border border-line bg-white p-6 shadow-sm">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-dark"><Clock3 /></span>
                <h2 className="mt-4 text-lg font-black text-brand-deep">مواعيد العمل</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{settings.working_hours}</p>
              </article>
            </div>
            <div>
              <ContactForm />
              <div className="mt-6 overflow-hidden rounded-[2rem] border border-line bg-brand-pale shadow-sm">
                <iframe title="موقع شعاع للطباعة على الخريطة" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[360px] w-full border-0" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
