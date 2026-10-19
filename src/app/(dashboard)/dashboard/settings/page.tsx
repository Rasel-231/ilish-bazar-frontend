import type { Metadata } from "next";
import {
  Bell,
  CreditCard,
  Globe,
  Palette,
  ShieldCheck,
  Store,
} from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/features/dashboard/components/section-card";

export const metadata: Metadata = {
  title: "সেটিংস",
};

const SETTINGS_SECTIONS = [
  {
    id: "store",
    title: "স্টোর সেটিংস",
    description: "নাম, লোগো, ঠিকানা ও যোগাযোগ",
    icon: Store,
  },
  {
    id: "branding",
    title: "ব্র্যান্ডিং",
    description: "থিম, রং ও UI কাস্টোমাইজেশন",
    icon: Palette,
  },
  {
    id: "payments",
    title: "পেমেন্ট",
    description: "bKash, Nagad, COD ও ইন্টিগ্রেশন",
    icon: CreditCard,
  },
  {
    id: "notifications",
    title: "নোটিফিকেশন",
    description: "ইমেইল, SMS ও অ্যাপ নোটিফিকেশন",
    icon: Bell,
  },
  {
    id: "security",
    title: "সিকিউরিটি",
    description: "২FA, রোলস ও পারমিশন",
    icon: ShieldCheck,
  },
  {
    id: "seo",
    title: "SEO ও মার্কেটিং",
    description: "মেটা, OG, Schema ও ক্যাম্পেইন",
    icon: Globe,
  },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="সেটিংস"
        title="সিস্টেম সেটিংস"
        description="স্টোর কনফিগারেশন, পেমেন্ট, নিরাপত্তা ও ব্র্যান্ডিং ম্যানেজ করুন।"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SETTINGS_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <SectionCard
              key={section.id}
              title={section.title}
              description={section.description}
              className="group cursor-pointer transition-shadow hover:shadow-[0_1px_2px_rgba(11,37,64,0.05),0_18px_36px_-20px_rgba(11,37,64,0.28)]"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:-translate-y-0.5">
                  <Icon className="size-5" />
                </span>
                <span className="font-bangla text-sm font-semibold text-primary">
                  পরিচালনা করুন →
                </span>
              </div>
            </SectionCard>
          );
        })}
      </div>

      <SectionCard title="জেনারেল ইনফরমেশন" description="বেসিক স্টোর ডিটেইলস">
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { label: "স্টোর নাম", value: "ইলিশ বাজার" },
            { label: "সুপার অ্যাডমিন", value: "ariful@example.com" },
            { label: "কন্টাক্ট নাম্বার", value: "+৮৮০ ১৭০০-০০০০০০" },
            { label: "ডেলিভারি জোন", value: "ঢাকা মহানগরী" },
            { label: "কারেন্সি", value: "বাংলাদেশী টাকা (BDT)" },
            { label: "মিনিমাম অর্ডার", value: "৳১,০০০" },
          ].map((field) => (
            <div key={field.label} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {field.label}
              </label>
              <div className="flex min-h-10 items-center rounded-xl border border-border/70 bg-muted/40 px-3 py-2 text-sm text-foreground/80">
                {field.value}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
