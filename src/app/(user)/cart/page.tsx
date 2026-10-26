import type { Metadata } from "next";

import { CartPage } from "@/features/cart/components/cart-page";

export const metadata: Metadata = {
  title: "কার্ট",
  description: "আপনার পছন্দের তাজা ইলিশ কার্টে দেখুন এবং অর্ডার সম্পন্ন করুন।",
  alternates: { canonical: "/cart" },
};

export default function Page() {
  return <CartPage />;
}
