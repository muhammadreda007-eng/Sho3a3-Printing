import { ArrowLeft } from "lucide-react";
import { MediaGallery } from "@/components/gallery/MediaGallery";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Category, Project } from "@/types";

export function FeaturedWork({ projects, categories }: { projects: Project[]; categories: Category[] }) {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
         <SectionHeading
           eyebrow="نماذج من أعمالنا"
           title="شغلنا بيتكلم عنّا"
          />
          <LinkButton href="/gallery" variant="secondary" className="shrink-0">كل الأعمال <ArrowLeft className="h-4 w-4" /></LinkButton>
        </div>
        <div className="mt-10">
          <MediaGallery projects={projects} categories={categories} showFilters={false} compact />
        </div>
      </Container>
    </section>
  );
}
