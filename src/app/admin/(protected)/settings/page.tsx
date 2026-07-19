import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/data";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return <><AdminPageHeader title="إعدادات الموقع" description="عدّل أرقام التواصل والعنوان والمواعيد والنصوص دون فتح الكود." /><SettingsForm initialSettings={settings} /></>;
}
