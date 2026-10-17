import {
  ChartColumn,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ADMIN_ROUTES } from "@/lib/navigation";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "ড্যাশবোর্ড",
    items: [
      { href: ADMIN_ROUTES.dashboard, label: "ওভারভিউ", icon: LayoutDashboard },
      { href: ADMIN_ROUTES.analytics, label: "অ্যানালিটিক্স", icon: ChartColumn },
    ],
  },
  {
    label: "বাজার",
    items: [
      { href: ADMIN_ROUTES.orders, label: "অর্ডার", icon: ShoppingBag, badge: "২৪" },
      { href: ADMIN_ROUTES.products, label: "পণ্য", icon: Package, badge: "১২৮" },
      { href: ADMIN_ROUTES.customers, label: "গ্রাহক", icon: Users },
    ],
  },
  {
    label: "সিস্টেম",
    items: [{ href: ADMIN_ROUTES.settings, label: "সেটিংস", icon: Settings }],
  },
];
