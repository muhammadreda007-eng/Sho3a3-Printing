import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { getAdminCategories } from "@/lib/data";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();
  return <><AdminPageHeader title="التصنيفات" description="نظم الجالري في أقسام يمكن إظهارها أو إخفاؤها وترتيبها." /><CategoryManager initialCategories={categories} /></>;
}
