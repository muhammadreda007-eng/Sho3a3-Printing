import { fallbackCategories, fallbackProjects, defaultSettings } from "@/data/site";
import { hasSupabaseAdminEnv, hasSupabasePublicEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import type { Category, ContactMessage, DashboardStats, Project, SiteSettings } from "@/types";

export async function getSettings(): Promise<SiteSettings> {
  if (!hasSupabasePublicEnv) return defaultSettings;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
    if (error || !data) return defaultSettings;
    return { ...defaultSettings, ...(data as SiteSettings) };
  } catch {
    return defaultSettings;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!hasSupabasePublicEnv) return fallbackCategories;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return fallbackCategories;
    return data as Category[];
  } catch {
    return fallbackCategories;
  }
}

export async function getPublishedProjects(options?: {
  featured?: boolean;
  limit?: number;
}): Promise<Project[]> {
  if (!hasSupabasePublicEnv) {
    const source = options?.featured ? fallbackProjects.filter((item) => item.is_featured) : fallbackProjects;
    return source.slice(0, options?.limit ?? source.length);
  }

  try {
    const supabase = createPublicClient();
    let query = supabase
      .from("projects")
      .select("*, category:categories(id,name,slug)")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (options?.featured) query = query.eq("is_featured", true);
    if (options?.limit) query = query.limit(options.limit);

    const { data, error } = await query;
    if (error || !data?.length) {
      const source = options?.featured ? fallbackProjects.filter((item) => item.is_featured) : fallbackProjects;
      return source.slice(0, options?.limit ?? source.length);
    }
    return data as Project[];
  } catch {
    return fallbackProjects;
  }
}

export async function getAdminProjects(): Promise<Project[]> {
  if (!hasSupabaseAdminEnv) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("projects")
    .select("*, category:categories(id,name,slug)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return (data ?? []) as Project[];
}

export async function getAdminCategories(): Promise<Category[]> {
  if (!hasSupabaseAdminEnv) return fallbackCategories;
  const supabase = createAdminClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return (data ?? []) as Category[];
}

export async function getAdminMessages(): Promise<ContactMessage[]> {
  if (!hasSupabaseAdminEnv) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as ContactMessage[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!hasSupabaseAdminEnv) return { projects: 0, published: 0, videos: 0, newMessages: 0 };
  const supabase = createAdminClient();
  const [projects, published, videos, messages] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("media_type", "video"),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  return {
    projects: projects.count ?? 0,
    published: published.count ?? 0,
    videos: videos.count ?? 0,
    newMessages: messages.count ?? 0,
  };
}
