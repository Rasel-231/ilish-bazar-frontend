"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  Package,
  PackageOpen,
  Search,
  ShoppingBag,
  Truck,
  Wallet,
} from "lucide-react";

import { BreadcrumbBar } from "@/components/shared/auto-breadcrumb";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { OrderCard } from "@/features/order/my-orders/order-card";
import type { Order, OrderItem } from "@/features/order/types/order.types";
import {
  readStoredOrders,
  storedOrderToOrder,
} from "@/features/checkout/utils/order-storage";
import { ROUTES } from "@/lib/navigation";
import { cn, formatCurrency } from "@/lib/utils";

import type { Meta, OrderStatus } from "@/types/common.types";

type OrdersResponse = {
  success: boolean;
  message: string;
  data: Order[];
  meta: Meta;
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "অপেক্ষমাণ",
  CONFIRMED: "নিশ্চিত",
  PROCESSING: "প্রস্তুত হচ্ছে",
  SHIPPED: "পথে আছে",
  DELIVERED: "ডেলিভারড",
  CANCELLED: "বাতিল",
};

const FILTERS: { value: OrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "সব অর্ডার" },
  ...(Object.keys(STATUS_LABELS) as OrderStatus[]).map((status) => ({
    value: status,
    label: STATUS_LABELS[status],
  })),
];

const ACTIVE_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
];

const banglaNumber = (value: number) =>
  new Intl.NumberFormat("bn-BD").format(value);

const itemMatches = (item: OrderItem, term: string) =>
  item.productName.toLowerCase().includes(term);

export function MyOrdersPage() {
  const reduce = useReducedMotion() ?? false;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "ALL">("ALL");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/orders.json");
        if (!response.ok) {
          throw new Error("অর্ডার লোড করা যায়নি।");
        }

        const result = (await response.json()) as OrdersResponse;
        const mockOrders = Array.isArray(result.data) ? result.data : [];
        const localOrders = readStoredOrders().map(storedOrderToOrder);
        const merged = new Map<string, Order>();

        for (const order of [...localOrders, ...mockOrders]) {
          merged.set(order.orderNumber, order);
        }

        if (!cancelled) {
          setOrders(
            [...merged.values()].sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            ),
          );
        }
      } catch {
        if (!cancelled) {
          setError("আপনার অর্ডারগুলো লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const active = orders.filter((order) =>
      ACTIVE_STATUSES.includes(order.status),
    ).length;
    const delivered = orders.filter(
      (order) => order.status === "DELIVERED",
    ).length;
    const spend = orders
      .filter((order) => order.status !== "CANCELLED")
      .reduce((total, order) => total + Number(order.totalAmount), 0);

    return { total: orders.length, active, delivered, spend };
  }, [orders]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        activeFilter === "ALL" || order.status === activeFilter;
      const matchesQuery =
        !term ||
        order.orderNumber.toLowerCase().includes(term) ||
        order.items.some((item) => itemMatches(item, term));

      return matchesStatus && matchesQuery;
    });
  }, [orders, activeFilter, query]);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: orders.length };

    for (const order of orders) {
      counts[order.status] = (counts[order.status] ?? 0) + 1;
    }

    return counts;
  }, [orders]);

  return (
    <div className="bg-background text-foreground">
      {/* Breadcrumb bar */}
      <BreadcrumbBar />

      <div className="container-page py-8 sm:py-10">
        {/* Page header */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="font-bangla text-2xl font-black tracking-tight text-navy sm:text-3xl">
              আমার অর্ডার
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              আপনার সব অর্ডার এক জায়গায় দেখুন, অবস্থা জানুন এবং পছন্দের অর্ডার
              আবার করুন।
            </p>
          </div>

          <Button
            render={<Link href={ROUTES.shop} />}
            nativeButton={false}
            size="lg"
            className="font-bangla rounded-full bg-primary px-6 hover:bg-primary/90"
          >
            <ShoppingBag />
            আরও কিনুন
          </Button>
        </header>

        {/* Stats */}
        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            icon={Package}
            label="মোট অর্ডার"
            value={banglaNumber(stats.total)}
            tone="navy"
          />
          <StatCard
            icon={Truck}
            label="চলমান"
            value={banglaNumber(stats.active)}
            tone="primary"
          />
          <StatCard
            icon={CheckCircle2}
            label="ডেলিভারি সম্পন্ন"
            value={banglaNumber(stats.delivered)}
            tone="success"
          />
          <StatCard
            icon={Wallet}
            label="মোট খরচ"
            value={formatCurrency(stats.spend)}
            tone="warning"
          />
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="tablist"
            aria-label="অর্ডার ফিল্টার"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0"
          >
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.value;
              const count = filterCounts[filter.value] ?? 0;

              return (
                <button
                  key={filter.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-bangla text-sm font-medium transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                      : "border-border bg-card text-foreground/70 hover:border-primary/40 hover:text-primary",
                  )}
                >
                  {filter.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] font-bold",
                      isActive
                        ? "bg-white/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {banglaNumber(count)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="অর্ডার খুঁজুন"
              placeholder="অর্ডার নম্বর বা পণ্য দিয়ে খুঁজুন…"
              className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 font-bangla text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((index) => (
                <OrderCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <ErrorState
              title="কিছু একটা ভুল হয়েছে"
              description={error}
              action={
                <Button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="font-bangla"
                >
                  আবার চেষ্টা করুন
                </Button>
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              title={
                orders.length === 0
                  ? "এখনও কোনো অর্ডার নেই"
                  : "এই ফিল্টারে কোনো অর্ডার নেই"
              }
              description={
                orders.length === 0
                  ? "আপনার প্রথম তাজা ইলিশ অর্ডার করুন এবং এখানে ট্র্যাক করুন।"
                  : "অন্য ফিল্টার বেছে নিন বা সার্চ বদলে দেখুন।"
              }
              action={
                <Button
                  render={<Link href={ROUTES.shop} />}
                  nativeButton={false}
                  className="font-bangla bg-primary hover:bg-primary/90"
                >
                  <PackageOpen />
                  ইলিশ কিনুন
                </Button>
              }
            />
          ) : (
            <motion.div layout={!reduce} className="space-y-4">
              <AnimatePresence initial={false} mode="popLayout">
                {filtered.map((order) => (
                  <OrderCard key={order.id} order={order} reduce={reduce} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  tone: "navy" | "primary" | "success" | "warning";
}) {
  const toneStyles: Record<typeof tone, string> = {
    navy: "bg-navy/10 text-navy",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm shadow-navy/5">
      <span
        className={cn(
          "grid h-10 w-10 place-items-center rounded-xl",
          toneStyles[tone],
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-3 text-xl font-black text-navy sm:text-2xl">{value}</p>
      <p className="mt-0.5 font-bangla text-xs text-muted-foreground sm:text-sm">
        {label}
      </p>
    </div>
  );
}

function OrderCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-4">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-secondary" />
          <div className="h-3 w-24 rounded bg-secondary" />
        </div>
        <div className="h-6 w-20 rounded-full bg-secondary" />
      </div>
      <div className="space-y-3 px-5 py-4">
        {[0, 1].map((index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="h-14 w-14 shrink-0 rounded-xl bg-secondary" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-secondary" />
              <div className="h-3 w-24 rounded bg-secondary" />
            </div>
            <div className="h-4 w-16 rounded bg-secondary" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
        <div className="h-5 w-28 rounded bg-secondary" />
        <div className="h-8 w-40 rounded-lg bg-secondary" />
      </div>
    </div>
  );
}
