import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/utils";

export function WhatsAppButton({ number }: { number: string }) {
  return (
    <a
      href={whatsappUrl(number, "مرحبًا، أريد الاستفسار عن خدمات الطباعة وطلب عرض سعر.")}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="animate-pulse-ring focus-ring fixed bottom-5 left-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:-translate-y-1 sm:bottom-7 sm:left-7 sm:h-16 sm:w-16"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </a>
  );
}
