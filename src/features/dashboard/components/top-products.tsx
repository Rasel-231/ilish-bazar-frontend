import { Fish, Star } from "lucide-react";

import { cn } from "@/lib/utils";

import type { TopProduct } from "../types/dashboard.types";
import { formatBanglaCurrency, toBanglaNumber } from "../utils/dashboard.utils";

type TopProductsProps = {
  products: TopProduct[];
};

const STOCK_TONE = (stock: number) => {
  if (stock <= 10) return { label: "স্টক কম", dot: "bg-red-500", text: "text-red-600" };
  if (stock <= 25) return { label: "সীমিত", dot: "bg-warning", text: "text-warning" };
  return { label: "স্টকে আছে", dot: "bg-success", text: "text-success" };
};

export function TopProducts({ products }: TopProductsProps) {
  const maxRevenue = Math.max(...products.map((product) => product.revenue));

  return (
    <ul className="flex flex-col divide-y divide-border/60">
      {products.map((product, index) => {
        const stock = STOCK_TONE(product.stock);
        const barPct = (product.revenue / maxRevenue) * 100;

        return (
          <li key={product.id} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-art-blue to-art-green text-primary">
              <Fish className="size-5" aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-bangla text-sm font-semibold text-navy">
                  {product.name}
                </p>
                <span className="shrink-0 text-sm font-bold text-navy">
                  {formatBanglaCurrency(product.revenue)}
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  {toBanglaNumber(product.rating, { maximumFractionDigits: 1 })}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  · {toBanglaNumber(product.sold)} কেজি বিক্রি
                </span>
                <span className={cn("ms-auto inline-flex items-center gap-1 text-[11px]", stock.text)}>
                  <span className={cn("size-1.5 rounded-full", stock.dot)} />
                  {stock.label}
                </span>
              </div>

              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-navy to-primary transition-all duration-500"
                  style={{ width: `${barPct}%` }}
                />
              </div>
            </div>

            <span className="sr-only">{index + 1}</span>
          </li>
        );
      })}
    </ul>
  );
}
