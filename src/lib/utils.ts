import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-");
}

export function formatArabicDate(value: string) {
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatFileSize(bytes?: number | null) {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function whatsappUrl(number: string, message?: string) {
  const normalized = number.replace(/\D/g, "");
  const base = `https://wa.me/${normalized}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telUrl(number: string) {
  return `tel:${number.replace(/\s/g, "")}`;
}

export function videoPosterFromCloudinary(url?: string | null) {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/video/upload/")) return null;
  return url
    .replace("/video/upload/", "/video/upload/so_0,q_auto,f_jpg/")
    .replace(/\.[a-zA-Z0-9]+$/, ".jpg");
}
