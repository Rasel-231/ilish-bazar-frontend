import type { Metadata } from "next";

import { OrderSuccess } from "@/features/checkout/components/order-success";

export const metadata: Metadata = {
  title: "অর্ডার সফল",
  description: "আপনার ইলিশ বাজারের অর্ডার সফলভাবে সম্পন্ন হয়েছে।",
  robots: { index: false, follow: false },
};

export default async function Page({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  return <OrderSuccess orderNumber={decodeURIComponent(orderNumber)} />;
}
