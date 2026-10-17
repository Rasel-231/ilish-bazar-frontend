import type { Metadata } from "next";

import Shopingpage from "@/features/shop/components/Shopingpage";

export const metadata: Metadata = {
  title: "তাজা ইলিশ",
  description:
    "ঘাট থেকে সরাসরি তাজা ইলিশ — উৎস, সাইজ ও দাম অনুযায়ী বেছে নিন। ১০০% ফ্রেশ ডেলিভারি, ঢাকাসহ সারা দেশে।",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return <Shopingpage />;
}
