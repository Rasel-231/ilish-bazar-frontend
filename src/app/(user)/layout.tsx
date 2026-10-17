import { UserFooter } from "@/components/layouts/user-footer";
import { UserHeader } from "@/components/layouts/user-header";
import { AnnouncementTicker } from "@/components/shared/announcement-ticker";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

const ANNOUNCEMENTS = [
  "সারা দেশে ডেলিভারি দেওয়া হয়।",
  "৩০০০ টাকার উপরে অর্ডারে ডেলিভারি চার্জ ফ্রি।",
  "তাজা ইলিশ সরাসরি চাঁদপুর থেকে।",
];

export default function UserLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <AnnouncementTicker notices={ANNOUNCEMENTS} />
      <UserHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <UserFooter />
      <WhatsAppButton />
    </>
  );
}
