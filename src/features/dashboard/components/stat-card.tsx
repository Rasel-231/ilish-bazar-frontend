import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { StatMetric, StatTone } from "../types/dashboard.types";
import { buildSmoothPath, toChartPoints } from "../utils/dashboard.utils";

const TONE_STYLES: Record<
  StatTone,
  { icon: string; glow: string; stroke: string; fill: string }
> = {
  primary: {
    icon: "bg-gradient-to-br from-primary to-primary/70 text-white",
    glow: "from-primary/20",
    stroke: "var(--primary)",
    fill: "var(--primary)",
  },
  navy: {
    icon: "bg-gradient-to-br from-navy to-navy/80 text-white",
    glow: "from-navy/20",
    stroke: "var(--navy)",
    fill: "var(--navy)",
  },
  success: {
    icon: "bg-gradient-to-br from-success to-success/70 text-white",
    glow: "from-success/20",
    stroke: "var(--success)",
    fill: "var(--success)",
  },
  warning: {
    icon: "bg-gradient-to-br from-warning to-warning/70 text-white",
    glow: "from-warning/20",
    stroke: "var(--warning)",
    fill: "var(--warning)",
  },
  danger: {
    icon: "bg-gradient-to-br from-destructive to-destructive/70 text-white",
    glow: "from-destructive/20",
    stroke: "var(--destructive)",
    fill: "var(--destructive)",
  },
  violet: {
    icon: "bg-gradient-to-br from-violet-500 to-violet-600 text-white",
    glow: "from-violet-500/20",
    stroke: "var(--color-violet-500, #8b5cf6)",
    fill: "var(--color-violet-500, #8b5cf6)",
  },
};

const WIDTH = 120;
const HEIGHT = 40;

type StatCardProps = {
  metric: StatMetric;
  icon: LucideIcon;
};

export function StatCard({ metric, icon: Icon }: StatCardProps) {
  const tone = TONE_STYLES[metric.tone];
  const trendingUp = metric.change >= 0;
  const good = trendingUp === (metric.goodWhenUp ?? true);

  const points = toChartPoints(metric.spark, WIDTH, HEIGHT, 6);
  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`;
  const gradientId = `spark-${metric.id}`;

  return (
    <Card className="group relative overflow-hidden p-5 transition-shadow duration-300 hover:shadow-[0_1px_2px_rgba(11,37,64,0.05),0_24px_48px_-24px_rgba(11,37,64,0.28)]">
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-gradient-to-br to-transparent opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
          tone.glow,
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-navy sm:text-[1.75rem]">
            {metric.value}
          </p>
        </div>
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-2xl shadow-sm shadow-navy/10",
            tone.icon,
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>

      <div className="relative mt-4 flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold",
              good ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            {trendingUp ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
            {Math.abs(metric.change).toLocaleString("bn-BD")}%
          </span>
          <span className="text-[11px] text-muted-foreground">{metric.caption}</span>
        </div>

        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="hidden h-10 w-[7.5rem] shrink-0 overflow-visible xs:block"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={tone.fill} stopOpacity="0.28" />
              <stop offset="100%" stopColor={tone.fill} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path
            d={linePath}
            fill="none"
            stroke={tone.stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </Card>
  );
}
