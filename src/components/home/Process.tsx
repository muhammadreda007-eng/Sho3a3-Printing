import { CheckCheck, FileSearch, MessageSquareText, PackageCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  { icon: MessageSquareText, number: "01", title: "أرسل تفاصيل طلبك", description: "الخدمة، الكمية، المقاس والموعد المطلوب." },
  { icon: FileSearch, number: "02", title: "نراجع الملف", description: "نتأكد من المقاسات والجودة والألوان قبل التنفيذ." },
  { icon: CheckCheck, number: "03", title: "الطباعة والتشطيب", description: "تنفيذ مناسب لنوع العمل مع متابعة الجودة." },
  { icon: PackageCheck, number: "04", title: "الاستلام", description: "تجهيز الطلب للاستلام أو التنسيق للتوصيل." },
];

export function Process() {
  return (
    <section className="bg-brand-pale py-20 sm:py-24">
      <Container>
        <SectionHeading align="center" eyebrow="خطوات واضحة" title="طلبك من غير تعقيد" description="من أول استلام التفاصيل وحتى التسليم، كل مرحلة واضحة وسريعة." />
        <div className="relative mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="absolute right-[12%] top-10 hidden h-px w-[76%] bg-brand/20 lg:block" />
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.number} className="relative rounded-[1.6rem] border border-line bg-white p-6 text-center shadow-sm">
                <span className="relative mx-auto grid h-20 w-20 place-items-center rounded-full border-[7px] border-brand-pale bg-brand text-white shadow-lg">
                  <Icon className="h-7 w-7" />
                </span>
                <p className="mt-4 text-xs font-black tracking-[0.18em] text-brand">{step.number}</p>
                <h3 className="mt-2 text-lg font-black text-brand-deep">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
