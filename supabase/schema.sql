-- Shoaa Printing database schema for Supabase
-- Run this entire file in Supabase > SQL Editor.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category_id uuid references public.categories(id) on delete restrict,
  media_type text not null check (media_type in ('image', 'video')),
  media_url text,
  thumbnail_url text,
  cloudinary_public_id text,
  cloudinary_resource_type text check (cloudinary_resource_type in ('image', 'video')),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  duration numeric check (duration is null or duration >= 0),
  file_size bigint check (file_size is null or file_size >= 0),
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  service text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'reviewed', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null,
  tagline text not null,
  hero_title text not null,
  hero_description text not null,
  phone_numbers text[] not null default '{}',
  whatsapp_number text not null,
  address text not null,
  maps_url text not null,
  working_hours text not null,
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_status_idx on public.projects(status);
create index if not exists projects_category_idx on public.projects(category_id);
create index if not exists projects_featured_idx on public.projects(is_featured) where is_featured = true;
create index if not exists messages_status_idx on public.contact_messages(status);

create or replace trigger categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create or replace trigger projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create or replace trigger messages_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();

create or replace trigger settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.projects enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;

-- Visitors can only read public content.
drop policy if exists "Public read active categories" on public.categories;
create policy "Public read active categories" on public.categories
for select to anon, authenticated
using (is_active = true);

drop policy if exists "Public read published projects" on public.projects;
create policy "Public read published projects" on public.projects
for select to anon, authenticated
using (status = 'published');

drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings" on public.site_settings
for select to anon, authenticated
using (true);

-- An authenticated user can verify only their own admin record.
drop policy if exists "Admin user can read own record" on public.admin_users;
create policy "Admin user can read own record" on public.admin_users
for select to authenticated
using (auth.uid() = user_id);

-- Contact messages and all writes are performed by protected server routes
-- using the Supabase service role key. The service role bypasses RLS.

insert into public.categories (name, slug, description, sort_order, is_active)
values
  ('كتب ومجلات', 'books', 'طباعة الكتب والمذكرات والمجلات والكتيبات', 1, true),
  ('طباعة أوفست', 'offset', 'أعمال الطباعة الأوفست والكميات التجارية', 2, true),
  ('طباعة ديجيتال', 'digital', 'أعمال الطباعة الديجيتال والتنفيذ السريع', 3, true),
  ('Indoor & Outdoor', 'indoor-outdoor', 'المطبوعات الداخلية والخارجية', 4, true),
  ('بانرات وإعلانات', 'banners', 'البانرات واللافتات والمطبوعات الدعائية', 5, true),
  ('تصميم جرافيك', 'design', 'تصميم وتجهيز الملفات للطباعة', 6, true),
  ('خدمات ما بعد الطباعة', 'finishing', 'القص والتكعيب والدبوس والسلوفان', 7, true)
on conflict (slug) do nothing;

insert into public.site_settings (
  site_name,
  tagline,
  hero_title,
  hero_description,
  phone_numbers,
  whatsapp_number,
  address,
  maps_url,
  working_hours
)
select
  'شعاع للطباعة',
  'أسهل · أوفر · أسرع',
  'من التصميم إلى الطباعة… كل ما تحتاجه في مكان واحد',
  'حلول طباعة متكاملة للكتب والمطبوعات التجارية والبانرات، من أول التصميم وحتى التشطيب والتسليم.',
  array['01000088470', '01000620045', '01021616872'],
  '+201025017711',
  '٤٨ شارع شريف، تقاطع شارع راغب، بجوار محطة مترو حلوان، أمام ماكدونالدز — شعاع بيت الطباعة',
  'https://maps.app.goo.gl/mhPR7aQoNrXZvxuV6',
  'يوميًا من 12 ظهرًا حتى 11 مساءً'
where not exists (select 1 from public.site_settings);

-- After creating an admin user from Supabase Authentication > Users,
-- replace the UUID below and run this separately:
-- insert into public.admin_users (user_id, display_name)
-- values ('YOUR_AUTH_USER_UUID', 'مدير شعاع');
