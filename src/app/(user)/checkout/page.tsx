import type { Metadata } from "next";

import { CheckoutPage } from "@/features/checkout/components/checkout-page";
import { getShopProduct } from "@/features/shop/data/shop-products";

export const metadata: Metadata = {
  title: "চেকআউট",
  description:
    "মাছের বিস্তারিত দেখুন, বুকিং তথ্য দিন এবং পেমেন্ট মাধ্যম বেছে নিয়ে অর্ডার সম্পন্ন করুন।",
  alternates: { canonical: "/checkout" },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ buy?: string; qty?: string }>;
}) {
  const { buy, qty } = await searchParams;
  const product = buy ? getShopProduct(buy) : undefined;
  const quantity = Number(qty);

  return (
    <CheckoutPage
      buyNowProduct={product}
      initialQuantity={Number.isFinite(quantity) && quantity > 0 ? quantity : 1}
    />
  );
}
