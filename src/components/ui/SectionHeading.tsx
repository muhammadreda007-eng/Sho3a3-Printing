import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "right" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "right",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-bold tracking-[0.16em] text-brand-dark">{eyebrow}</p>
      ) : null}
      <h2 className="text-balance text-3xl font-black leading-tight text-brand-deep sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-muted sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
