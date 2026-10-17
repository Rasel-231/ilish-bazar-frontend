"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/common.types";

import type { OrdersByStatus } from "../types/dashboard.types";
import { ORDER_STATUS_LABELS, toBanglaNumber } from "../utils/dashboard.utils";

const BAR_STYLES: Record<OrderStatus, string> = {
  PENDING: "from-amber-400 to-amber-500",
  CONFIRMED: "from-sky-400 to-sky-500",
  PROCESSING: "from-indigo-400 to-indigo-500",
  SHIPPED: "from-violet-400 to-violet-500",
  DELIVERED: "from-emerald-400 to-emerald-500",
  CANCELLED: "from-red-400 to-red-500",
};

const DOT_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500",
  CONFIRMED: "bg-sky-500",
  PROCESSING: "bg-indigo-500",
  SHIPPED: "bg-violet-500",
  DELIVERED: "bg-emerald-500",
  CANCELLED: "bg-red-500",
};

type OrdersStatusChartProps = {
  data: OrdersByStatus[];
};

export function OrdersStatusChart({ data }: OrdersStatusChartProps) {
  const [active, setActive] = useState<OrderStatus | null>(null);
  const max = Math.max(...data.map((item) => item.count));

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-52 items-end gap-2 sm:gap-3">
        {data.map((item) => {
          const heightPct = Math.max(6, (item.count / max) * 100);
          const isActive = active === item.status;

          return (
            <button
              key={item.status}
              type="button"
              onMouseEnter={() => setActive(item.status)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(item.status)}
              onBlur={() => setActive(null)}
              className="group flex flex-1 flex-col items-center gap-2 focus:outline-none"
              aria-label={`${ORDER_STATUS_LABELS[item.status]}: ${item.count}`}
            >
              <span
                className={cn(
                  "text-xs font-bold transition-all",
                  isActive ? "text-navy" : "text-muted-foreground",
                )}
              >
                {toBanglaNumber(item.count)}
              </span>

              <span className="relative flex w-full flex-1 items-end">
                <span
                  className={cn(
                    "w-full rounded-t-lg bg-gradient-to-t transition-all duration-300",
                    BAR_STYLES[item.status],
                    isActive
                      ? "opacity-100 shadow-lg shadow-navy/10"
                      : "opacity-70 group-hover:opacity-100",
                  )}
                  style={{ height: `${heightPct}%` }}
                />
              </span>

              <span
                className={cn(
                  "line-clamp-1 w-full text-center font-bangla text-[10px] leading-tight transition-colors sm:text-[11px]",
                  isActive ? "text-navy" : "text-muted-foreground",
                )}
              >
                {ORDER_STATUS_LABELS[item.status]}
              </span>
            </button>
          );
        })}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-border/60 pt-4">
        {data.map((item) => (
          <li key={item.status} className="flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", DOT_STYLES[item.status])} />
            <span className="font-bangla text-[11px] text-muted-foreground">
              {ORDER_STATUS_LABELS[item.status]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
