import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MessageManager } from "@/components/admin/MessageManager";
import { getAdminMessages } from "@/lib/data";

export default async function AdminMessagesPage() {
  const messages = await getAdminMessages();
  return <><AdminPageHeader title="رسائل العملاء" description="راجع طلبات العملاء الواردة من نموذج التواصل وحدّث حالتها." /><MessageManager initialMessages={messages} /></>;
}
