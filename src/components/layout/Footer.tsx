import { Clock3, MapPin, Phone, Send } from "lucide-react";
import Link from "next/link";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { Container } from "@/components/ui/Container";
import type { SiteSettings } from "@/types";
import { telUrl, whatsappUrl } from "@/lib/utils";

export function Footer({ settings }: { settings: SiteSettings }) {
  const facebookLink = "https://www.facebook.com/Muhammad.Reedaa";

  return (
    <footer className="relative overflow-hidden bg-brand-deep text-white">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <Container className="relative grid gap-10 py-14 md:grid-cols-[1.1fr_.8fr_1.1fr]">
        <div>
          <SiteLogo inverted />

          <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
            حلول طباعة متكاملة للأفراد والشركات، من تجهيز التصميم وحتى الطباعة
            والتشطيب والتسليم.
          </p>
        </div>

        <div>
          <h2 className="font-black">روابط سريعة</h2>

          <div className="mt-5 grid gap-3 text-sm text-white/75">
            <Link href="/#services" className="hover:text-white">
              خدماتنا
            </Link>

            <Link href="/gallery" className="hover:text-white">
              معرض الأعمال
            </Link>

            <Link href="/contact" className="hover:text-white">
              تواصل معنا
            </Link>

            <Link href="/admin/login" className="hover:text-white">
              دخول الإدارة
            </Link>
          </div>
        </div>

        <div>
          <h2 className="font-black">بيانات التواصل</h2>

          <div className="mt-5 grid gap-4 text-sm text-white/75">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <span>{settings.address}</span>
            </p>

            <p className="flex gap-3">
              <Clock3 className="h-5 w-5 shrink-0 text-brand" />
              <span>{settings.working_hours}</span>
            </p>

            <div className="flex gap-3">
              <Phone className="h-5 w-5 shrink-0 text-brand" />

              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {settings.phone_numbers.map((number) => (
                  <a
                    key={number}
                    href={telUrl(number)}
                    className="hover:text-white"
                    dir="ltr"
                  >
                    {number}
                  </a>
                ))}
              </div>
            </div>

            <a
              href={whatsappUrl(settings.whatsapp_number)}
              target="_blank"
              rel="noreferrer"
              className="flex gap-3 hover:text-white"
            >
              <Send className="h-5 w-5 shrink-0 text-brand" />
              واتساب: <span dir="ltr">{settings.whatsapp_number}</span>
            </a>
          </div>
        </div>
      </Container>

      <div className="relative border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} جميع الحقوق محفوظة {" "}
            <a
              href="https://www.facebook.com/Muhammad.Reedaa"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-white underline-offset-4 hover:underline"
            >
              سـيـزر إيجينسي
            </a>
          </p>

          <p>
            تصميم وتطوير:{" "}
            <a
              href="https://www.facebook.com/Muhammad.Reedaa"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-white underline-offset-4 hover:underline"
            >
              Muhammad Cesare
            </a>
          </p>
        </Container>
      </div>
    </footer>
  );
}