import { CircleDollarSign, Package, ShoppingBag, UserPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { ActivityItem } from "../types/dashboard.types";

const ICONS: Record<ActivityItem["type"], LucideIcon> = {
  order: ShoppingBag,
  payment: CircleDollarSign,
  user: UserPlus,
  stock: Package,
};

const TONES: Record<ActivityItem["type"], string> = {
  order: "bg-primary/10 text-primary",
  payment: "bg-success/10 text-success",
  user: "bg-violet-500/10 text-violet-600",
  stock: "bg-warning/10 text-warning",
};

type ActivityFeedProps = {
  items: ActivityItem[];
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <ol className="relative flex flex-col gap-5">
      <span
        aria-hidden="true"
        className="absolute left-[1.15rem] top-2 bottom-2 w-px bg-border"
      />
      {items.map((item) => {
        const Icon = ICONS[item.type];
        return (
          <li key={item.id} className="relative flex gap-3.5">
            <span
              className={`z-10 grid size-9 shrink-0 place-items-center rounded-full ring-4 ring-card ${TONES[item.type]}`}
            >
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="font-bangla text-sm font-semibold text-navy">
                {item.title}
              </p>
              <p className="truncate font-bangla text-xs text-muted-foreground">
                {item.description}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground/80">
                {item.time}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
