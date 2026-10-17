import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "সব ইলিশ",
  description:
    "পদ্মা-মেঘনার তাজা ইলিশ, ঢাকায় আপনার দরজায়। উৎস, সাইজ ও দাম অনুযায়ী বেছে নিন।",
  alternates: { canonical: "/shop" },
};

export default function IlishPage() {
  redirect("/shop");
}
