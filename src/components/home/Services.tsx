import { ArrowLeft } from "lucide-react";
import { services } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="خدماتنا"
          title="كل خدمات الطباعة تحت سقف واحد"
          description="نختار طريقة الطباعة والخامات والتشطيب الأنسب حسب الكمية والاستخدام والميزانية المطلوبة."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.slug} className="group relative overflow-hidden rounded-[1.75rem] border border-line bg-white p-6 shadow-[0_14px_45px_rgba(16,42,56,.055)] transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_22px_55px_rgba(8,174,232,.13)]">
                <span className="absolute left-5 top-5 text-5xl font-black text-brand-soft transition group-hover:text-[#d7f2fc]">{service.number}</span>
                <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand-dark transition group-hover:bg-brand group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="relative mt-5 text-xl font-black text-brand-deep">{service.title}</h3>
                <p className="relative mt-3 min-h-14 text-sm leading-7 text-muted">{service.description}</p>
                <a href="/contact" className="relative mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-dark hover:text-brand">
                  اطلب الخدمة <ArrowLeft className="h-4 w-4" />
                </a>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
