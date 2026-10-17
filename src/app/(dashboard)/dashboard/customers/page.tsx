import type { Metadata } from "next";
import {
  Filter,
  Mail,
  Phone,
  Plus,
  Search,
  UserCheck,
  UserPlus,
  UserX,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { cn, getInitials } from "@/lib/utils";

import { ADMIN_CUSTOMERS } from "@/features/dashboard/data/dashboard.data";
import { formatBanglaCurrency, toBanglaNumber } from "@/features/dashboard/utils/dashboard.utils";

export const metadata: Metadata = {
  title: "গ্রাহক ব্যবস্থাপনা",
};

const AVATAR_TONES = [
  "bg-primary/10 text-primary",
  "bg-navy/10 text-navy",
  "bg-violet-500/10 text-violet-600",
  "bg-warning/10 text-warning",
  "bg-success/10 text-success",
];

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="গ্রাহক"
        title="গ্রাহক তালিকা"
        description="অর্ডার, বিলিং এবং স্ট্যাটাস অনুযায়ী গ্রাহকদের দেখুন।"
        actions={
          <>
            <Button
              variant="outline"
              className="font-bangla rounded-xl border-border bg-white"
            >
              <Filter />
              ফিল্টার
            </Button>
            <Button className="font-bangla rounded-xl bg-primary shadow-sm shadow-primary/30 hover:bg-primary/90">
              <Plus />
              নতুন গ্রাহক
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "মোট গ্রাহক", value: "৩৪২", icon: Users, tone: "bg-primary/10 text-primary" },
          { label: "নতুন এই মাসে", value: "৫৬", icon: UserPlus, tone: "bg-success/10 text-success" },
          { label: "সক্রিয় গ্রাহক", value: "২৯৮", icon: UserCheck, tone: "bg-navy/10 text-navy" },
          { label: "নিষ্ক্রিয়", value: "৪৪", icon: UserX, tone: "bg-warning/10 text-warning" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_2px_rgba(11,37,64,0.04),0_12px_32px_-18px_rgba(11,37,64,0.18)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-2xl font-black tracking-tight text-navy">
                    {stat.value}
                  </p>
                </div>
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-2xl",
                    stat.tone,
                  )}
                >
                  <Icon className="size-5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(11,37,64,0.04),0_12px_32px_-18px_rgba(11,37,64,0.18)]">
        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              placeholder="নাম বা ইমেইল দিয়ে খুঁজুন…"
              className="h-10 w-full rounded-xl border border-border/70 bg-muted/40 pl-10 pr-4 font-bangla text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-medium">
            <button
              type="button"
              className="rounded-full bg-navy px-3 py-1.5 text-white shadow-sm"
            >
              সকল
            </button>
            <button
              type="button"
              className="rounded-full bg-muted/40 px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-navy"
            >
              অ্যাডমিন
            </button>
            <button
              type="button"
              className="rounded-full bg-muted/40 px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-navy"
            >
              অ্যাকটিভ
            </button>
          </div>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
          {ADMIN_CUSTOMERS.map((customer, index) => (
            <div
              key={customer.id}
              className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-white/80 p-4 shadow-sm shadow-navy/5 transition-shadow hover:shadow-[0_1px_2px_rgba(11,37,64,0.05),0_18px_36px_-20px_rgba(11,37,64,0.28)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid size-11 place-items-center rounded-full font-bangla text-sm font-bold",
                      AVATAR_TONES[index % AVATAR_TONES.length],
                    )}
                  >
                    {getInitials(customer.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-bangla text-sm font-semibold text-navy">
                      {customer.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {customer.email}
                    </p>
                  </div>
                </div>

                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                    customer.isActive
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning",
                  )}
                >
                  {customer.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">অর্ডার</p>
                  <p className="mt-1 text-sm font-bold text-navy">
                    {toBanglaNumber(customer.orders)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">মোট খরচ</p>
                  <p className="mt-1 text-sm font-bold text-navy">
                    {formatBanglaCurrency(customer.spent)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ভূমিকা</p>
                  <p className="mt-1 text-sm font-bold text-navy">
                    {customer.role === "ADMIN" ? "অ্যাডমিন" : "গ্রাহক"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/40 px-2 py-1">
                  <Mail className="size-3.5" />
                  {customer.email}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/40 px-2 py-1">
                  <Phone className="size-3.5" />
                  +৮৮০ ১০০০০০০০০
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
