# شعاع للطباعة — Full‑Stack Website

موقع عربي RTL لمطبعة **شعاع للطباعة** مبني باستخدام:

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- Supabase: Authentication + PostgreSQL
- Cloudinary: تخزين وتحسين الصور والفيديوهات

## المزايا

- Home احترافية، الخدمات، خطوات التنفيذ، أعمال مميزة وCTA.
- Gallery تدعم الصور والفيديوهات والتصفية حسب التصنيف.
- Contact Form يحفظ الرسائل داخل لوحة التحكم.
- زر واتساب ثابت، الاتصال المباشر، مواعيد العمل، العنوان والخريطة.
- Dashboard محمية لإدارة:
  - الصور والفيديوهات.
  - نشر الأعمال أو حفظها كمسودة.
  - الأعمال المميزة والترتيب.
  - التصنيفات.
  - رسائل العملاء.
  - أرقام التواصل والعنوان والمواعيد ونصوص الموقع.
- Signed Cloudinary uploads من المتصفح دون كشف المفتاح السري.
- RLS وسياسات قراءة عامة محدودة في Supabase.
- SEO، Sitemap، Robots، Manifest، Security Headers وResponsive Design.

## 1. التشغيل محليًا

```bash
npm install
cp .env.example .env.local
npm run dev
```

افتح: `http://localhost:3000`

بدون مفاتيح الخدمات سيعمل الجزء العام ببيانات تجريبية، لكن تسجيل الدخول والحفظ والرفع يحتاجان الربط التالي.

## 2. إعداد Supabase

1. أنشئ مشروعًا جديدًا في Supabase.
2. افتح **SQL Editor** ونفّذ الملف كاملًا:

```text
supabase/schema.sql
```

3. من **Project Settings > API** انسخ:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Publishable key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY`
4. من **Authentication > Users** أنشئ مستخدم الأدمن بالبريد وكلمة المرور.
5. انسخ UUID الخاص به ثم نفّذ في SQL Editor:

```sql
insert into public.admin_users (user_id, display_name)
values ('USER_UUID_HERE', 'مدير شعاع');
```

## 3. إعداد Cloudinary

1. أنشئ حسابًا/Cloud جديدًا في Cloudinary.
2. من Dashboard/API Keys انسخ:
   - Cloud name → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET`

الرفع يتم بتوقيع يولده السيرفر من `/api/cloudinary/sign`، لذلك API Secret لا يصل إلى المتصفح.

## 4. ملف البيئة

أنشئ `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET
```

لا ترفع `.env.local` إلى GitHub.

## 5. لوحة التحكم

بعد الربط:

```text
http://localhost:3000/admin/login
```

- الصور: حتى 15MB.
- الفيديوهات: حتى 100MB.
- يفضل WebP/AVIF للصور وMP4 H.264 للفيديو.
- عند حذف العمل يتم حذف ملفه من Cloudinary أيضًا.

## 6. الاختبار والبناء

```bash
npm run lint
npm run build
npm run start
```

## 7. النشر على Vercel

1. ارفع المشروع على GitHub.
2. Import Project داخل Vercel.
3. أضف جميع Environment Variables.
4. غيّر `NEXT_PUBLIC_SITE_URL` إلى رابط الدومين النهائي.
5. Deploy.
6. من Supabase Authentication > URL Configuration أضف رابط الموقع في Site URL وRedirect URLs.

## ملاحظات إنتاجية

- Rate limiting الحالي داخل الذاكرة مناسب كبداية. عند ارتفاع الزيارات يفضل Upstash Redis أو Vercel Firewall لنموذج التواصل.
- الفيديوهات الكبيرة يجب ضغطها قبل الرفع للحفاظ على سرعة المشاهدة واستهلاك الباقة.
- `SUPABASE_SERVICE_ROLE_KEY` و`CLOUDINARY_API_SECRET` مفاتيح Server‑only ولا يجب وضع `NEXT_PUBLIC_` قبلهما.
