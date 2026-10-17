import type { Metadata } from "next";
import { Download, Filter, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

import { ADMIN_PRODUCTS } from "@/features/dashboard/data/dashboard.data";
import { formatBanglaCurrency, toBanglaNumber } from "@/features/dashboard/utils/dashboard.utils";

export const metadata: Metadata = {
  title: "পণ্য ব্যবস্থাপনা",
};

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="পণ্য"
        title="পণ্য ম্যানেজমেন্ট"
        description="ক্যাটালগ ব্যবস্থাপনা করুন, স্টক আপডেট করুন এবং নতুন পণ্য যুক্ত করুন।"
        actions={
          <>
            <Button
              variant="outline"
              className="font-bangla rounded-xl border-border bg-white"
            >
              <Download />
              এক্সপোর্ট
            </Button>
            <Button
              variant="outline"
              className="font-bangla rounded-xl border-border bg-white"
            >
              <Filter />
              ফিল্টার
            </Button>
            <Button className="font-bangla rounded-xl bg-primary shadow-sm shadow-primary/30 hover:bg-primary/90">
              <Plus />
              নতুন পণ্য
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
              placeholder="পণ্যের নাম দিয়ে খুঁজুন…"
              className="h-10 w-full rounded-xl border border-border/70 bg-muted/40 pl-10 pr-4 font-bangla text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="inline-flex flex-wrap items-center gap-2 text-xs font-medium">
            {["সব পণ্য", "একটিভ", "ইনঅ্যাকটিভ", "স্টক কম"].map((label, index) => (
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
          <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">পণ্য</th>
                <th className="px-5 py-3 font-medium">ক্যাটাগরি</th>
                <th className="px-5 py-3 font-medium">দাম</th>
                <th className="px-5 py-3 font-medium">স্টক</th>
                <th className="px-5 py-3 font-medium">বিক্রি</th>
                <th className="px-5 py-3 font-medium">স্ট্যাটাস</th>
                <th className="px-5 py-3 font-medium text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {ADMIN_PRODUCTS.map((product) => {
                const stockLow = product.stock <= 10;
                const stockMid = product.stock > 0 && product.stock <= 25;

                return (
                  <tr
                    key={product.id}
                    className="group border-t border-border/60 transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-3.5">
                      <span className="flex flex-col">
                        <span className="font-bangla font-medium text-navy">
                          {product.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {product.unit}
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bangla text-xs text-muted-foreground">
                      {product.category}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-navy">
                      {formatBanglaCurrency(product.price)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                          stockLow
                            ? "bg-red-100 text-red-700 ring-red-600/20"
                            : stockMid
                              ? "bg-warning/10 text-warning ring-warning/30"
                              : "bg-success/10 text-success ring-success/30",
                        )}
                      >
                        {toBanglaNumber(product.stock)} কেজি
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bangla text-xs text-muted-foreground">
                      {toBanglaNumber(product.sold)} বিক্রি
                    </td>
                    <td className="px-5 py-3.5 font-bangla text-xs text-muted-foreground">
                      {product.isActive ? "একটিভ" : "ইনঅ্যাকটিভ"}
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs font-semibold text-primary">
                      সম্পাদনা
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
