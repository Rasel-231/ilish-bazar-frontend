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

const FILTERS = ["সব পণ্য", "একটিভ", "ইনঅ্যাকটিভ", "স্টক কম"] as const;

function stockClasses(stock: number) {
  if (stock <= 10) return "bg-red-100 text-red-700 ring-red-600/20";
  if (stock > 0 && stock <= 25) return "bg-warning/10 text-warning ring-warning/30";
  return "bg-success/10 text-success ring-success/30";
}

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
              size="lg"
              className="font-bangla rounded-xl border-border bg-white"
            >
              <Download />
              এক্সপোর্ট
            </Button>
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
              নতুন পণ্য
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
              placeholder="পণ্যের নাম দিয়ে খুঁজুন…"
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
          {ADMIN_PRODUCTS.map((product) => (
            <li key={product.id} className="flex flex-col gap-3 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col">
                  <span className="font-bangla font-medium text-navy">
                    {product.name}
                  </span>
                  <span className="mt-0.5 text-xs text-muted-foreground">
                    {product.category} · {product.unit}
                  </span>
                </div>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-bangla text-xs font-semibold ring-1",
                    stockClasses(product.stock),
                  )}
                >
                  {toBanglaNumber(product.stock)} কেজি
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-navy">
                  {formatBanglaCurrency(product.price)}
                </span>
                <span className="font-bangla text-muted-foreground">
                  {toBanglaNumber(product.sold)} বিক্রি
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 font-bangla font-semibold",
                    product.isActive
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {product.isActive ? "একটিভ" : "ইনঅ্যাকটিভ"}
                </span>
                <span className="font-semibold text-primary">সম্পাদনা</span>
              </div>
            </li>
          ))}
        </ul>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto border-t border-border/60 md:block">
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
              {ADMIN_PRODUCTS.map((product) => (
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
                        stockClasses(product.stock),
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
