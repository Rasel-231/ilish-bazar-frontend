import { MoreHorizontal } from "lucide-react";

import { cn, getInitials } from "@/lib/utils";

import type { AdminOrder } from "../types/dashboard.types";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONE,
  formatBanglaCurrency,
} from "../utils/dashboard.utils";

type RecentOrdersProps = {
  orders: AdminOrder[];
};

const AVATAR_TONES = [
  "bg-primary/10 text-primary",
  "bg-navy/10 text-navy",
  "bg-violet-500/10 text-violet-600",
  "bg-warning/10 text-warning",
  "bg-success/10 text-success",
];

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
        <thead>
          <tr className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <th className="px-5 py-3 font-medium">গ্রাহক</th>
            <th className="px-5 py-3 font-medium">অর্ডার</th>
            <th className="px-5 py-3 font-medium">পরিমাণ</th>
            <th className="px-5 py-3 font-medium">অবস্থা</th>
            <th className="px-5 py-3 font-medium text-right">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={order.id}
              className="group border-t border-border/60 transition-colors hover:bg-muted/40"
            >
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-full font-bangla text-xs font-bold",
                      AVATAR_TONES[index % AVATAR_TONES.length],
                    )}
                  >
                    {getInitials(order.customer)}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-medium text-navy">
                      {order.customer}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {order.email}
                    </span>
                  </span>
                </div>
              </td>
              <td className="px-5 py-3.5">
                <span className="font-mono text-xs font-semibold text-foreground/80">
                  {order.orderNumber}
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
              <td className="px-5 py-3.5 text-right">
                <button
                  type="button"
                  aria-label={`${order.orderNumber} অ্যাকশন`}
                  className="inline-grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-navy"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
