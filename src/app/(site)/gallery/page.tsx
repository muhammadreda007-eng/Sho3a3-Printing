import type { Metadata } from "next";
import { Images } from "lucide-react";
import { MediaGallery } from "@/components/gallery/MediaGallery";
import { Container } from "@/components/ui/Container";
import { getCategories, getPublishedProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "معرض الأعمال",
  description: "شاهد نماذج من أعمال شعاع للطباعة: كتب، أوفست، ديجيتال، بانرات ومطبوعات داخلية وخارجية.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const [projects, categories] = await Promise.all([getPublishedProjects(), getCategories()]);

  return (
    <>
      <section className="relative overflow-hidden bg-brand-pale py-16 sm:py-20">
        <div className="absolute inset-0 grid-pattern" />
        <Container className="relative text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white shadow-lg"><Images /></span>
          <p className="mt-5 text-sm font-bold text-brand-dark">معرض شعاع</p>
          <h1 className="mt-2 text-balance text-4xl font-black text-brand-deep sm:text-5xl">نماذج من أعمالنا</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted">مجموعة من أعمال شعاع في الطباعة، التصميم، التشطيب، والمطبوعات الدعائية.</p>
        </Container>
      </section>
      <section className="py-16 sm:py-20">
        <Container>
          <MediaGallery projects={projects} categories={categories} />
        </Container>
      </section>
    </>
  );
}
