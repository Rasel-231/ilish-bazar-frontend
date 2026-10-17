import type { Metadata } from "next";

import { MyOrdersPage } from "@/features/order/my-orders/my-orders-page";

export const metadata: Metadata = {
  title: "আমার অর্ডার | ইলিশ বাজার",
  description:
    "আপনার সব অর্ডারের তালিকা, অবস্থা ও বিস্তারিত তথ্য এক জায়গায় দেখুন।",
};

export default function Page() {
  return <MyOrdersPage />;
}
