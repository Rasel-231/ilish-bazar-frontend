import type { Metadata } from "next";
import { BarChart3, Download, Filter, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/features/dashboard/components/section-card";
import { RevenueChart } from "@/features/dashboard/components/revenue-chart";
import { OrdersStatusChart } from "@/features/dashboard/components/orders-status-chart";
import { CategoryDonut } from "@/features/dashboard/components/category-donut";
import { TrafficSources } from "@/features/dashboard/components/traffic-sources";
import {
  CATEGORY_SPLIT,
  ORDERS_BY_STATUS,
  REVENUE_SERIES,
  TRAFFIC_SOURCES,
} from "@/features/dashboard/data/dashboard.data";

export const metadata: Metadata = {
  title: "অ্যানালিটিক্স",
};

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="অ্যানালিটিক্স"
        title="বাজার বিশ্লেষণ"
        description="বিক্রয়, ট্রাফিক এবং গ্রাহকের আচরণ বিশ্লেষণ করে সিদ্ধান্ত নিন।"
        actions={
          <>
            <Button
              variant="outline"
              size="lg"
              className="font-bangla rounded-xl border-border bg-white"
            >
              <Filter />
              সময়কাল
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="font-bangla rounded-xl border-border bg-white"
            >
              <RefreshCw />
              রিফ্রেশ
            </Button>
            <Button
              size="lg"
              className="font-bangla rounded-xl bg-primary shadow-sm shadow-primary/30 hover:bg-primary/90"
            >
              <Download />
              এক্সপোর্ট
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="আয় ও বিক্রয়ের ধারা"
          description="গত ১২ মাসের প্রবণতা"
          className="lg:col-span-2"
        >
          <RevenueChart data={REVENUE_SERIES} />
        </SectionCard>

        <SectionCard title="ট্রাফিক সোর্স" description="সেশন অনুযায়ী উৎস">
          <TrafficSources sources={TRAFFIC_SOURCES} />
        </SectionCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SectionCard
          title="অর্ডার অবস্থা"
          description="বিভাজন ও পরিমাণ"
        >
          <OrdersStatusChart data={ORDERS_BY_STATUS} />
        </SectionCard>

        <SectionCard title="ক্যাটাগরি পারফরম্যান্স" description="বিক্রয়ের শেয়ার">
          <CategoryDonut data={CATEGORY_SPLIT} />
        </SectionCard>

        <SectionCard
          title="রিপোর্ট ও ইনসাইট"
          description="কার্যকরী সুপারিশ"
        >
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
              <BarChart3 className="size-6" />
            </span>
            <h4 className="text-base font-semibold text-navy">
              AI ইনসাইট শীঘ্রই আসছে
            </h4>
            <p className="max-w-sm text-sm text-muted-foreground">
              বিক্রয় পূর্বাভাস, চাহিদা প্রেডিকশন এবং গ্রাহক মূল্যায়ন এখানে দেখানো হবে।
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
