import { Suspense } from "react";

import { UserFooter } from "@/components/layouts/user-footer";
import { UserHeader } from "@/components/layouts/user-header";
import {
  AnnouncementTicker,
  AnnouncementTickerSkeleton,
} from "@/components/shared/announcement-ticker";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

const FALLBACK_NOTICES = [
  "সারা দেশে ডেলিভারি দেওয়া হয়।",
  "৩০০০ টাকার উপরে অর্ডারে ডেলিভারি চার্জ ফ্রি।",
  "তাজা ইলিশ সরাসরি চাঁদপুর থেকে।",
];

type SiteSettingResponse = {
  success?: boolean;
  data?: {
    marqueeEnabled?: boolean;
    notices?: string[];
  };
};

async function SiteAnnouncement() {
  let notices = FALLBACK_NOTICES;
  let enabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      cache: "no-store",
    });

    if (response.ok) {
      const json = (await response.json()) as SiteSettingResponse;

      if (json.data) {
        notices = Array.isArray(json.data.notices)
          ? json.data.notices
          : FALLBACK_NOTICES;
        enabled = json.data.marqueeEnabled ?? true;
      }
    }
  } catch {
    notices = FALLBACK_NOTICES;
  }

  if (!enabled || notices.length === 0) return null;

  return <AnnouncementTicker notices={notices} />;
}

export default function UserLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Suspense fallback={<AnnouncementTickerSkeleton />}>
        <SiteAnnouncement />
      </Suspense>
      <UserHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <UserFooter />
      <WhatsAppButton />
    </>
  );
}
