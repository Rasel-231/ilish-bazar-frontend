"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  BadgePercent,
  Calendar,
  Download,
  Plus,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  UserPlus,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { ADMIN_ROUTES } from "@/lib/navigation";

import { ActivityFeed } from "./activity-feed";
import { CategoryDonut } from "./category-donut";
import { OrdersStatusChart } from "./orders-status-chart";
import { RecentOrders } from "./recent-orders";
import { RevenueChart } from "./revenue-chart";
import { SectionCard } from "./section-card";
import { StatCard } from "./stat-card";
import { TopProducts } from "./top-products";
import { TrafficSources } from "./traffic-sources";
import {
  ACTIVITY_FEED,
  CATEGORY_SPLIT,
  DASHBOARD_STATS,
  ORDERS_BY_STATUS,
  RECENT_ORDERS,
  REVENUE_SERIES,
  TOP_PRODUCTS,
  TRAFFIC_SOURCES,
} from "../data/dashboard.data";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const STAT_ICONS = {
  revenue: Wallet,
  orders: ShoppingBag,
  customers: UserPlus,
  refund: BadgePercent,
} as const;

export function DashboardOverview() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      <motion.div variants={item}>
        <PageHeader
          eyebrow="ওভারভিউ"
          title="সালাম, আরিফুল 👋"
          description="আজকের বাজারের সামগ্রিক চিত্র এক নজরে দেখুন। গত ৩০ দিনের তুলনামূলক পরিসংখ্যান নিচে দেওয়া হলো।"
          actions={
            <>
              <Button
                variant="outline"
                className="font-bangla rounded-xl border-border bg-white"
              >
                <Calendar className="size-4" />
                <span className="hidden xs:inline">এ মাস</span>
              </Button>
              <Button
                variant="outline"
                className="font-bangla rounded-xl border-border bg-white"
              >
                <RefreshCw className="size-4" />
                <span className="hidden xs:inline">রিফ্রেশ</span>
              </Button>
              <Button
                variant="outline"
                className="font-bangla rounded-xl border-border bg-white"
              >
                <Download className="size-4" />
                <span className="hidden xs:inline">রিপোর্ট</span>
              </Button>
              <Button
                render={<Link href={ADMIN_ROUTES.products} />}
                nativeButton={false}
                className="font-bangla rounded-xl bg-primary shadow-sm shadow-primary/30 hover:bg-primary/90"
              >
                <Plus className="size-4" />
                <span className="hidden xs:inline">নতুন পণ্য</span>
              </Button>
            </>
          }
        />
      </motion.div>

      {/* KPI stats */}
      <motion.section
        variants={item}
        aria-label="মূল পরিসংখ্যান"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {DASHBOARD_STATS.map((metric) => (
          <StatCard
            key={metric.id}
            metric={metric}
            icon={STAT_ICONS[metric.id as keyof typeof STAT_ICONS] ?? Wallet}
          />
        ))}
      </motion.section>

      {/* Revenue + category split */}
      <motion.div
        variants={item}
        className="grid gap-4 xl:grid-cols-3"
      >
        <SectionCard
          title="আয় ও অর্ডারের ধারা"
          description="মাসভিত্তিক পারফরম্যান্স"
          className="xl:col-span-2"
        >
          <RevenueChart data={REVENUE_SERIES} />
        </SectionCard>

        <SectionCard
          title="ক্যাটাগরি অনুযায়ী বিক্রয়"
          description="বিক্রয়ের শতাংশ"
        >
          <CategoryDonut data={CATEGORY_SPLIT} />
        </SectionCard>
      </motion.div>

      {/* Orders status + traffic */}
      <motion.div variants={item} className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="অর্ডার অবস্থা"
          description="সব অর্ডারের বর্তমান বিভাজন"
        >
          <OrdersStatusChart data={ORDERS_BY_STATUS} />
        </SectionCard>

        <SectionCard
          title="ট্রাফিক সোর্স"
          description="গ্রাহক কোথা থেকে আসছে"
        >
          <TrafficSources sources={TRAFFIC_SOURCES} />
        </SectionCard>

        <SectionCard title="সাম্প্রতিক কার্যক্রম" description="সর্বশেষ আপডেট">
          <ActivityFeed items={ACTIVITY_FEED} />
        </SectionCard>
      </motion.div>

      {/* Recent orders + top products */}
      <motion.div variants={item} className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="সাম্প্রতিক অর্ডার"
          description="সর্বশেষ ৬টি অর্ডার"
          className="xl:col-span-2"
          flush
          action={
            <Button
              render={<Link href={ADMIN_ROUTES.orders} />}
              nativeButton={false}
              variant="ghost"
              className="font-bangla rounded-xl text-primary hover:bg-primary/10"
            >
              সব দেখুন
            </Button>
          }
        >
          <div className="border-t border-border/60">
            <RecentOrders orders={RECENT_ORDERS} />
          </div>
        </SectionCard>

        <SectionCard
          title="শীর্ষ বিক্রীত পণ্য"
          description="আয় অনুযায়ী সেরা"
          action={
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
              <TrendingUp className="size-3.5" />
              সাপ্তাহিক
            </span>
          }
        >
          <TopProducts products={TOP_PRODUCTS} />
        </SectionCard>
      </motion.div>
    </motion.div>
  );
}
