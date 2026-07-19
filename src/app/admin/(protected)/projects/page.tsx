import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectManager } from "@/components/admin/ProjectManager";
import { getAdminCategories, getAdminProjects } from "@/lib/data";

export default async function AdminProjectsPage() {
  const [projects, categories] = await Promise.all([getAdminProjects(), getAdminCategories()]);
  return (
    <>
      <AdminPageHeader title="الأعمال والوسائط" description="ارفع الصور والفيديوهات، حدد التصنيف، وانشرها في الجالري دون تعديل الكود." />
      <ProjectManager initialProjects={projects} categories={categories.filter((category) => category.is_active)} />
    </>
  );
}
