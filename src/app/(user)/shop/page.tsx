import type { Metadata } from "next";

import Shopingpage from "@/features/shop/components/Shopingpage";
import { SHOP_PRODUCTS } from "@/features/shop/data/shop-products";

export const metadata: Metadata = {
  title: "তাজা ইলিশ",
  description:
    "ঘাট থেকে সরাসরি তাজা ইলিশ — উৎস, সাইজ ও দাম অনুযায়ী বেছে নিন। ১০০% ফ্রেশ ডেলিভারি, ঢাকাসহ সারা দেশে।",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

  return (
    <Shopingpage products={SHOP_PRODUCTS} initialSearch={search ?? ""} />
  );
}
