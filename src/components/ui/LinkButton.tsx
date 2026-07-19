import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: "primary" | "secondary" | "white";
}

export function LinkButton({ className, variant = "primary", ...props }: LinkButtonProps) {
  return (
    <Link
      className={cn(
        "focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition duration-200",
        variant === "primary" && "bg-brand text-white shadow-[0_12px_30px_rgba(8,174,232,.28)] hover:-translate-y-0.5 hover:bg-brand-dark",
        variant === "secondary" && "border border-line bg-white text-brand-deep hover:border-brand hover:text-brand-dark",
        variant === "white" && "bg-white text-brand-deep shadow-lg hover:-translate-y-0.5",
        className,
      )}
      {...props}
    />
  );
}
