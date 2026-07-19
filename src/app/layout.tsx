import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { SITE_URL } from "@/data/site";
import "./globals.css";

const arabicFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "شعاع للطباعة | أسهل · أوفر · أسرع",
    template: "%s | شعاع للطباعة",
  },
  description:
    "شعاع بيت الطباعة في حلوان: طباعة كتب، أوفست وديجيتال، بانرات، Indoor & Outdoor، تصميم جرافيك وخدمات ما بعد الطباعة.",
  keywords: [
    "شعاع للطباعة",
    "مطبعة حلوان",
    "طباعة كتب",
    "طباعة أوفست",
    "طباعة ديجيتال",
    "طباعة بانرات",
    "تصميم جرافيك",
  ],
  authors: [{ name: "شعاع للطباعة" }],
  creator: "شعاع للطباعة",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: SITE_URL,
    siteName: "شعاع للطباعة",
    title: "شعاع للطباعة | أسهل · أوفر · أسرع",
    description: "حلول الطباعة المتكاملة من التصميم وحتى التشطيب والتسليم.",
    images: [{ url: "/brand/og-image.jpg", width: 1200, height: 1200, alt: "شعاع للطباعة" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "شعاع للطباعة",
    description: "حلول الطباعة المتكاملة في حلوان.",
    images: ["/brand/og-image.jpg"],
  },
  icons: {
    icon: "/brand/favicon.png",
    apple: "/brand/logo-square.webp",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08aee8",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${arabicFont.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}