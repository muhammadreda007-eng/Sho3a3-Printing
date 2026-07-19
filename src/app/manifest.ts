import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "شعاع للطباعة",
    short_name: "شعاع",
    description: "حلول الطباعة المتكاملة في حلوان",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#08aee8",
    lang: "ar",
    dir: "rtl",
    icons: [{ src: "/brand/logo-square.webp", sizes: "1080x1080", type: "image/webp" }],
  };
}
