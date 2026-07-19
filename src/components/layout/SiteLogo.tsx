import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteLogo({ inverted = false, compact = false }: { inverted?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className="focus-ring inline-flex items-center gap-3 rounded-xl" aria-label="شعاع للطباعة - الرئيسية">
      <span
        className={cn(
          "relative grid shrink-0 place-items-center overflow-hidden rounded-2xl",
          compact ? "h-12 w-12" : "h-14 w-14",
          inverted ? "bg-white/10" : "bg-brand",
        )}
      >
        <Image src="/brand/logo-white.png" alt="" fill sizes="56px" className="scale-[1.55] object-contain" priority />
      </span>
      <span className="hidden sm:block">
        <span className={cn("block text-lg font-black", inverted ? "text-white" : "text-brand-deep")}>شعاع للطباعة</span>
        <span className={cn("mt-0.5 block text-xs font-bold", inverted ? "text-white/70" : "text-brand-dark")}>أسهل · أوفر · أسرع</span>
      </span>
    </Link>
  );
}
