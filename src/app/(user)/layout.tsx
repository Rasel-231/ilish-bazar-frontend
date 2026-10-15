import UserFooter from "@/components/layouts/footer";
import UserHeader from "@/components/layouts/userHeader";
import { AnnouncementTicker } from "@/components/shared/announcement-ticker";

const notices = [
  "সারা দেশে ডেলিভারি দেওয়া হয়।",
  "৩০০০ টাকার উপরে অর্ডারে ডেলিভারি চার্জ ফ্রি।",
  "তাজা ইলিশ সরাসরি চাঁদপুর থেকে।",
];

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <AnnouncementTicker notices={notices} />
      <UserHeader />

      <main className="flex flex-1 flex-col">{children}</main>
      <UserFooter />
    </>
  );
}
