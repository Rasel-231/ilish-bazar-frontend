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
              className="font-bangla rounded-xl border-border bg-white"
            >
              <Filter />
              ফিল্টার
            </Button>
            <Button className="font-bangla rounded-xl bg-primary shadow-sm shadow-primary/30 hover:bg-primary/90">
              <Plus />
              নতুন অর্ডার
            </Button>
          </>
        }
      />

      <div className="rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(11,37,64,0.04),0_12px_32px_-18px_rgba(11,37,64,0.18)]">
        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
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

          <div className="inline-flex flex-wrap items-center gap-2 text-xs font-medium">
            {(
              ["সব", "অপেক্ষমাণ", "নিশ্চিত", "প্রস্তুত", "পথে", "ডেলিভার্ড", "বাতিল"] as const
            ).map((label, index) => (
              <button
                key={label}
                type="button"
                className={cn(
                  "rounded-full px-3 py-1.5 transition-colors",
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

        <div className="overflow-x-auto">
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
