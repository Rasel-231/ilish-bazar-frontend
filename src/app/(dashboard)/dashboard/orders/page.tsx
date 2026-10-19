import type { Metadata } from "next";
import { Filter, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

import { ADMIN_ORDERS } from "@/features/dashboard/data/dashboard.data";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONE,
  formatBanglaCurrency,
} from "@/features/dashboard/utils/dashboard.utils";

export const metadata: Metadata = {
  title: "অর্ডার ব্যবস্থাপনা",
};

const FILTERS = [
  "সব",
  "অপেক্ষমাণ",
  "নিশ্চিত",
  "প্রস্তুত",
  "পথে",
  "ডেলিভার্ড",
  "বাতিল",
] as const;

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="অর্ডার"
        title="অর্ডার ম্যানেজমেন্ট"
        description="সমস্ত গ্রাহকের অর্ডার দেখুন, অবস্থা পরিবর্তন করুন এবং অনুসন্ধান করুন।"
        actions={
          <>
            <Button
              variant="outline"
              size="lg"
              className="font-bangla rounded-xl border-border bg-white"
            >
              <Filter />
              ফিল্টার
            </Button>
            <Button
              size="lg"
              className="font-bangla rounded-xl bg-primary shadow-sm shadow-primary/30 hover:bg-primary/90"
            >
              <Plus />
              নতুন অর্ডার
            </Button>
          </>
        }
      />

      <div className="rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(11,37,64,0.04),0_12px_32px_-18px_rgba(11,37,64,0.18)]">
        <div className="flex flex-col gap-3 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              placeholder="অর্ডার নম্বর বা গ্রাহকের নাম দিয়ে খুঁজুন…"
              className="h-10 w-full rounded-xl border border-border/70 bg-muted/40 pl-10 pr-4 font-bangla text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 text-xs font-medium sm:mx-0 sm:flex-wrap sm:px-0">
            {FILTERS.map((label, index) => (
              <button
                key={label}
                type="button"
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 transition-colors",
                  index === 0
                    ? "bg-navy text-white shadow-sm"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-navy",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile cards */}
        <ul className="divide-y divide-border/60 border-t border-border/60 md:hidden">
          {ADMIN_ORDERS.map((order) => (
            <li key={order.id} className="flex flex-col gap-3 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col">
                  <span className="font-mono text-xs font-semibold text-foreground/80">
                    {order.orderNumber}
                  </span>
                  <span className="mt-1 truncate font-medium text-navy">
                    {order.customer}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {order.email}
                  </span>
                </div>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-bangla text-xs font-semibold ring-1",
                    ORDER_STATUS_TONE[order.status],
                  )}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-navy">
                  {formatBanglaCurrency(order.amount)}
                </span>
                <span className="font-bangla text-muted-foreground">
                  পেমেন্ট: {order.paymentStatus}
                </span>
                <span className="font-bangla text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                </span>
                <span className="font-semibold text-primary">বিস্তারিত</span>
              </div>
            </li>
          ))}
        </ul>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto border-t border-border/60 md:block">
          <table className="w-full min-w-[50rem] border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">অর্ডার</th>
                <th className="px-5 py-3 font-medium">গ্রাহক</th>
                <th className="px-5 py-3 font-medium">পরিমাণ</th>
                <th className="px-5 py-3 font-medium">অবস্থা</th>
                <th className="px-5 py-3 font-medium">পেমেন্ট</th>
                <th className="px-5 py-3 font-medium">তারিখ</th>
                <th className="px-5 py-3 font-medium text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {ADMIN_ORDERS.map((order) => (
                <tr
                  key={order.id}
                  className="group border-t border-border/60 transition-colors hover:bg-muted/40"
                >
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-semibold text-foreground/80">
                      {order.orderNumber}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex flex-col">
                      <span className="font-medium text-navy">{order.customer}</span>
                      <span className="text-xs text-muted-foreground">
                        {order.email}
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-navy">
                    {formatBanglaCurrency(order.amount)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bangla text-xs font-semibold ring-1",
                        ORDER_STATUS_TONE[order.status],
                      )}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bangla text-xs text-muted-foreground">
                    {order.paymentStatus}
                  </td>
                  <td className="px-5 py-3.5 font-bangla text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs font-semibold text-primary">
                    বিস্তারিত
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
