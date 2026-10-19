"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

import type { RevenuePoint } from "../types/dashboard.types";
import {
  buildSmoothPath,
  formatBanglaCurrency,
  toBanglaNumber,
  toChartPoints,
} from "../utils/dashboard.utils";

const VIEW_W = 720;
const VIEW_H = 260;
const PAD_X = 16;
const PAD_Y = 24;

type Metric = "revenue" | "orders";

type RevenueChartProps = {
  data: RevenuePoint[];
};

export function RevenueChart({ data }: RevenueChartProps) {
  const [metric, setMetric] = useState<Metric>("revenue");
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const values = useMemo(
    () => data.map((point) => (metric === "revenue" ? point.revenue : point.orders)),
    [data, metric],
  );

  const innerW = VIEW_W - PAD_X * 2;
  const innerH = VIEW_H - PAD_Y * 2;

  const points = useMemo(
    () => toChartPoints(values, innerW, innerH, 0),
    [values, innerW, innerH],
  );

  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L ${innerW} ${innerH} L 0 ${innerH} Z`;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const total = values.reduce((sum, value) => sum + value, 0);
  const average = total / values.length;

  const handleMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || data.length < 2) return;

    const rect = svg.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * innerW;
    const index = Math.round((relativeX / innerW) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, index)));
  };

  const formatValue = (value: number) =>
    metric === "revenue"
      ? formatBanglaCurrency(value)
      : `${toBanglaNumber(value)}টি`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight text-navy">
              আয়ের ধারা
            </h3>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-bold text-success">
              <ArrowUpRight className="size-3" />
              {toBanglaNumber(18.2)}%
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            গত ১২ মাসের মোট আয়{" "}
            <span className="font-semibold text-navy">
              {formatBanglaCurrency(total)}
            </span>
          </p>
        </div>

        <div className="inline-flex items-center rounded-full border border-border/70 bg-muted/40 p-0.5">
          {(
            [
              { id: "revenue", label: "আয়" },
              { id: "orders", label: "অর্ডার" },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setMetric(option.id)}
              aria-pressed={metric === option.id}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                metric === option.id
                  ? "bg-navy text-white shadow-sm"
                  : "text-muted-foreground hover:text-navy",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-5 flex-1">
        <svg
          ref={svgRef}
          viewBox={`-${PAD_X} -${PAD_Y} ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          className="h-52 w-full sm:h-64"
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
          role="img"
          aria-label="আয়ের ধারা চার্ট"
        >
          <defs>
            <linearGradient id="revenue-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.34" />
              <stop offset="70%" stopColor="var(--primary)" stopOpacity="0.06" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="revenue-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--navy)" />
              <stop offset="100%" stopColor="var(--primary)" />
            </linearGradient>
          </defs>

          {gridLines.map((ratio) => (
            <line
              key={ratio}
              x1="0"
              x2={innerW}
              y1={ratio * innerH}
              y2={ratio * innerH}
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray="4 6"
              opacity="0.7"
            />
          ))}

          <path d={areaPath} fill="url(#revenue-area)" />
          <path
            d={linePath}
            fill="none"
            stroke="url(#revenue-line)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {hover !== null && points[hover] ? (
            <>
              <line
                x1={points[hover].x}
                x2={points[hover].x}
                y1={0}
                y2={innerH}
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeDasharray="3 4"
                opacity="0.6"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={points[hover].x}
                cy={points[hover].y}
                r="5"
                fill="white"
                stroke="var(--primary)"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
            </>
          ) : null}
        </svg>

        {hover !== null && points[hover] ? (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-xl border border-border/70 bg-white/95 px-3 py-2 text-center shadow-lg shadow-navy/10 backdrop-blur"
            style={{
              left: `${((points[hover].x + PAD_X) / VIEW_W) * 100}%`,
              top: `${(points[hover].y / VIEW_H) * 100}%`,
              transform: "translate(-50%, -130%)",
            }}
          >
            <p className="text-[11px] font-medium text-muted-foreground">
              {data[hover].label}
            </p>
            <p className="text-sm font-bold text-navy">{formatValue(values[hover])}</p>
          </div>
        ) : null}

        <div className="mt-2 flex items-center justify-between gap-0.5 px-0.5">
          {data.map((point, index) => (
            <span
              key={point.label}
              className={cn(
                "text-[10px] font-medium transition-colors sm:text-xs",
                index % 2 !== 0 && "hidden sm:inline",
                hover === index ? "text-navy" : "text-muted-foreground",
              )}
            >
              {point.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border/60 pt-4 sm:grid-cols-3">
        <MiniStat label="সর্বোচ্চ" value={formatValue(max)} />
        <MiniStat label="সর্বনিম্ন" value={formatValue(min)} />
        <MiniStat label="গড়" value={formatValue(Math.round(average))} />
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-navy">{value}</p>
    </div>
  );
}
