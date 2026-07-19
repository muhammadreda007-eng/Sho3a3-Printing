export type MediaType = "image" | "video";
export type PublishStatus = "draft" | "published";
export type MessageStatus = "new" | "reviewed" | "closed";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  category_id?: string | null;
  category?: Pick<Category, "id" | "name" | "slug"> | null;
  media_type: MediaType;
  media_url?: string | null;
  thumbnail_url?: string | null;
  cloudinary_public_id?: string | null;
  cloudinary_resource_type?: MediaType | null;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  file_size?: number | null;
  is_featured: boolean;
  status: PublishStatus;
  sort_order: number;
  created_at: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  service: string;
  message: string;
  status: MessageStatus;
  created_at: string;
}

export interface SiteSettings {
  id?: string;
  site_name: string;
  tagline: string;
  hero_title: string;
  hero_description: string;
  phone_numbers: string[];
  whatsapp_number: string;
  address: string;
  maps_url: string;
  working_hours: string;
  facebook_url?: string | null;
  instagram_url?: string | null;
  tiktok_url?: string | null;
  email?: string | null;
  updated_at?: string;
}

export interface DashboardStats {
  projects: number;
  published: number;
  videos: number;
  newMessages: number;
}
