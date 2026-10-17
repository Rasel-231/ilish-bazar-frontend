import type { Metadata } from "next";

import { TermsPage } from "@/features/terms/TermsPage";

export const metadata: Metadata = {
  title: "ব্যবহারের শর্তাবলী",
  description:
    "ইলিশ বাজার ওয়েবসাইট ব্যবহার ও কেনাকাটার শর্তাবলী — অর্ডার, পেমেন্ট, ডেলিভারি ও রিফান্ডের নিয়ম জানুন।",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <TermsPage />;
}
