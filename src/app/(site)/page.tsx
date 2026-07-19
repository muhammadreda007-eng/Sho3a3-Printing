import { Cta } from "@/components/home/Cta";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Hero } from "@/components/home/Hero";
import { Process } from "@/components/home/Process";
import { Services } from "@/components/home/Services";
import { getCategories, getPublishedProjects, getSettings } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, categories, projects] = await Promise.all([
    getSettings(),
    getCategories(),
    getPublishedProjects({ featured: true, limit: 6 }),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <Services />
      <Process />
      <FeaturedWork projects={projects} categories={categories} />
      <Cta settings={settings} />
    </>
  );
}
