import type { Metadata } from "next";

import { TrackOrderPage } from "@/features/order/track-order/track-order-page";

export const metadata: Metadata = {
  title: "অর্ডার ট্র্যাক | ইলিশ বাজার",
  description:
    "অর্ডার নম্বর দিয়ে আপনার ইলিশ ডেলিভারির লাইভ অবস্থা ও সম্পূর্ণ অর্ডার বিবরণ দেখুন।",
};

export default function Page() {
  return <TrackOrderPage />;
}
