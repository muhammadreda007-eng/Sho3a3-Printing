import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "اكتب الاسم بشكل صحيح").max(80),
  phone: z.string().trim().min(8, "اكتب رقم هاتف صحيح").max(20),
  email: z.union([z.string().trim().email("البريد الإلكتروني غير صحيح"), z.literal("")]).optional(),
  service: z.string().trim().min(2, "اختر الخدمة").max(100),
  message: z.string().trim().min(10, "اكتب تفاصيل أكثر عن الطلب").max(1500),
  website: z.string().max(0).optional(),
});

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(150),
  description: z.string().trim().max(600).nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  media_type: z.enum(["image", "video"]),
  media_url: z.string().url().nullable().optional(),
  thumbnail_url: z.string().url().nullable().optional(),
  cloudinary_public_id: z.string().max(300).nullable().optional(),
  cloudinary_resource_type: z.enum(["image", "video"]).nullable().optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  duration: z.number().nonnegative().nullable().optional(),
  file_size: z.number().int().nonnegative().nullable().optional(),
  is_featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  sort_order: z.number().int().min(0).default(0),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(100),
  description: z.string().trim().max(300).nullable().optional(),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export const settingsSchema = z.object({
  site_name: z.string().trim().min(2).max(100),
  tagline: z.string().trim().min(2).max(100),
  hero_title: z.string().trim().min(5).max(180),
  hero_description: z.string().trim().min(10).max(500),
  phone_numbers: z.array(z.string().trim().min(5).max(25)).min(1).max(5),
  whatsapp_number: z.string().trim().min(8).max(25),
  address: z.string().trim().min(10).max(400),
  maps_url: z.string().url(),
  working_hours: z.string().trim().min(3).max(150),
  facebook_url: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  instagram_url: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  tiktok_url: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  email: z.union([z.string().email(), z.literal(""), z.null()]).optional(),
});
