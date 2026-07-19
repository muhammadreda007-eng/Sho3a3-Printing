import {
  BookOpenText,
  Brush,
  Images,
  Layers3,
  MonitorUp,
  Scissors,
  type LucideIcon,
} from "lucide-react";
import type { Category, Project, SiteSettings } from "@/types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shoaa-printing.com";

export const defaultSettings: SiteSettings = {
  site_name: "شعاع للطباعة",
  tagline: "أسهل · أوفر · أسرع",
  hero_title: "من التصميم إلى الطباعة… كل ما تحتاجه في مكان واحد",
  hero_description:
    "حلول طباعة متكاملة للكتب والمطبوعات التجارية والبانرات، من أول التصميم وحتى التشطيب والتسليم.",
  phone_numbers: ["01000088470", "01000620045", "01021616872"],
  whatsapp_number: "+201025017711",
  address:
    "٤٨ شارع شريف، تقاطع شارع راغب، بجوار محطة مترو حلوان، أمام ماكدونالدز — شعاع بيت الطباعة",
  maps_url: "https://maps.app.goo.gl/mhPR7aQoNrXZvxuV6",
  working_hours: "يوميًا من 12 ظهرًا حتى 11 مساءً",
  facebook_url: null,
  instagram_url: null,
  tiktok_url: null,
  email: null,
};

export interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
  slug: string;
  number: string;
}

export const services: ServiceItem[] = [
  {
    title: "طباعة الكتب",
    description: "كتب، مذكرات، مجلات وكتيبات بمقاسات وخامات وتجليدات متنوعة.",
    icon: BookOpenText,
    slug: "books",
    number: "01",
  },
  {
    title: "أوفست وديجيتال",
    description: "حلول مناسبة للكميات الكبيرة والتنفيذ السريع مع ثبات ودقة في الألوان.",
    icon: Layers3,
    slug: "offset-digital",
    number: "02",
  },
  {
    title: "Indoor & Outdoor",
    description: "مطبوعات داخلية وخارجية بجودة تتحمل الاستخدام وبمقاسات مختلفة.",
    icon: MonitorUp,
    slug: "indoor-outdoor",
    number: "03",
  },
  {
    title: "البانرات والإعلانات",
    description: "بانرات، رول أب، لافتات ومطبوعات دعائية للفعاليات والمتاجر.",
    icon: Images,
    slug: "banners",
    number: "04",
  },
  {
    title: "تصميم جرافيك",
    description: "تجهيز وتصميم الملفات للطباعة بما يضمن نتيجة واضحة واحترافية.",
    icon: Brush,
    slug: "graphic-design",
    number: "05",
  },
  {
    title: "ما بعد الطباعة",
    description: "قص، تكعيب، دبوس، سلوفان وتشطيبات نهائية ترفع جودة المنتج.",
    icon: Scissors,
    slug: "finishing",
    number: "06",
  },
];

export const fallbackCategories: Category[] = [
  { id: "books", name: "كتب ومجلات", slug: "books", sort_order: 1, is_active: true },
  { id: "offset", name: "طباعة أوفست", slug: "offset", sort_order: 2, is_active: true },
  { id: "digital", name: "طباعة ديجيتال", slug: "digital", sort_order: 3, is_active: true },
  { id: "indoor-outdoor", name: "Indoor & Outdoor", slug: "indoor-outdoor", sort_order: 4, is_active: true },
  { id: "banners", name: "بانرات وإعلانات", slug: "banners", sort_order: 5, is_active: true },
  { id: "design", name: "تصميم جرافيك", slug: "design", sort_order: 6, is_active: true },
  { id: "finishing", name: "خدمات ما بعد الطباعة", slug: "finishing", sort_order: 7, is_active: true },
];

const now = new Date().toISOString();

export const fallbackProjects: Project[] = [
  {
    id: "demo-book",
    title: "طباعة وتجليد الكتب",
    slug: "book-printing",
    description: "تنفيذ كتب ومذكرات بجودة ألوان وتشطيب متكامل.",
    category_id: "books",
    category: fallbackCategories[0],
    media_type: "image",
    media_url: null,
    thumbnail_url: null,
    is_featured: true,
    status: "published",
    sort_order: 1,
    created_at: now,
  },
  {
    id: "demo-offset",
    title: "مطبوعات أوفست",
    slug: "offset-printing",
    description: "جودة ثابتة للكميات التجارية الكبيرة.",
    category_id: "offset",
    category: fallbackCategories[1],
    media_type: "image",
    media_url: null,
    thumbnail_url: null,
    is_featured: true,
    status: "published",
    sort_order: 2,
    created_at: now,
  },
  {
    id: "demo-banner",
    title: "بانرات وإعلانات",
    slug: "banner-printing",
    description: "طباعة مقاسات كبيرة للاستخدام الداخلي والخارجي.",
    category_id: "banners",
    category: fallbackCategories[4],
    media_type: "image",
    media_url: null,
    thumbnail_url: null,
    is_featured: true,
    status: "published",
    sort_order: 3,
    created_at: now,
  },
  {
    id: "demo-design",
    title: "تصميم وتجهيز للطباعة",
    slug: "graphic-design",
    description: "تصميمات جاهزة للتنفيذ مع مراجعة المقاسات والألوان.",
    category_id: "design",
    category: fallbackCategories[5],
    media_type: "image",
    media_url: null,
    thumbnail_url: null,
    is_featured: false,
    status: "published",
    sort_order: 4,
    created_at: now,
  },
  {
    id: "demo-finishing",
    title: "تشطيبات ما بعد الطباعة",
    slug: "finishing-services",
    description: "قص وتكعيب ودبوس وسلوفان حسب نوع المنتج.",
    category_id: "finishing",
    category: fallbackCategories[6],
    media_type: "image",
    media_url: null,
    thumbnail_url: null,
    is_featured: false,
    status: "published",
    sort_order: 5,
    created_at: now,
  },
  {
    id: "demo-video",
    title: "فيديو من مراحل التنفيذ",
    slug: "production-video",
    description: "يمكن رفع فيديوهات الأعمال ومراحل الطباعة من لوحة التحكم.",
    category_id: "digital",
    category: fallbackCategories[2],
    media_type: "video",
    media_url: null,
    thumbnail_url: null,
    is_featured: false,
    status: "published",
    sort_order: 6,
    created_at: now,
  },
];
