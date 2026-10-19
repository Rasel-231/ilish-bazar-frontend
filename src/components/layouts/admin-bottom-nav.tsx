"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartColumn,
  LayoutDashboard,
  Menu,
  Package,
  ShoppingBag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { ADMIN_ROUTES } from "@/lib/navigation";

type BottomNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const BOTTOM_ITEMS: BottomNavItem[] = [
  { href: ADMIN_ROUTES.dashboard, label: "ওভারভিউ", icon: LayoutDashboard },
  { href: ADMIN_ROUTES.orders, label: "অর্ডার", icon: ShoppingBag },
  { href: ADMIN_ROUTES.products, label: "পণ্য", icon: Package },
  { href: ADMIN_ROUTES.analytics, label: "বিশ্লেষণ", icon: ChartColumn },
];

type AdminBottomNavProps = {
  onOpenMenu: () => void;
};

export function AdminBottomNav({ onOpenMenu }: AdminBottomNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === ADMIN_ROUTES.dashboard
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <nav
      aria-label="দ্রুত নেভিগেশন"
      className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-white/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-16px_rgba(11,37,64,0.35)] lg:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between gap-1 px-2 py-1.5">
        {BOTTOM_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-xl transition-colors",
                    active ? "bg-primary/10" : "bg-transparent",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-bangla text-[10px] font-medium leading-none">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}

        <li className="flex-1">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex w-full flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-muted-foreground transition-colors"
          >
            <span className="grid size-9 place-items-center rounded-xl">
              <Menu className="size-5" aria-hidden="true" />
            </span>
            <span className="font-bangla text-[10px] font-medium leading-none">
              আরও
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
