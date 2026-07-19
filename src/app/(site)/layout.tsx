import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { getSettings } from "@/lib/data";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <div className="min-h-screen bg-white">
      <Header primaryPhone={settings.phone_numbers[0]} />
      <main>{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton number={settings.whatsapp_number} />
    </div>
  );
}
