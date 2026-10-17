"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import type { CategorySlice } from "../types/dashboard.types";
import { toBanglaNumber } from "../utils/dashboard.utils";

const SIZE = 180;
const STROKE = 22;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type CategoryDonutProps = {
  data: CategorySlice[];
};

export function CategoryDonut({ data }: CategoryDonutProps) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  const segments = data.map((slice, index) => {
    const fraction = slice.value / total;
    const preceding = data
      .slice(0, index)
      .reduce((sum, previous) => sum + previous.value, 0);

    return {
      ...slice,
      index,
      fraction,
      dash: fraction * CIRCUMFERENCE,
      offset: (preceding / total) * CIRCUMFERENCE,
    };
  });

  const focused = active !== null ? segments[active] : null;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
      <div className="relative shrink-0">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="size-44 -rotate-90"
          role="img"
          aria-label="ক্যাটাগরি অনুযায়ী বিক্রয়"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={STROKE}
          />
          {segments.map((segment) => (
            <circle
              key={segment.label}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={segment.color}
              strokeWidth={active === segment.index ? STROKE + 6 : STROKE}
              strokeDasharray={`${segment.dash} ${CIRCUMFERENCE - segment.dash}`}
              strokeDashoffset={-segment.offset}
              strokeLinecap="butt"
              opacity={active === null || active === segment.index ? 1 : 0.35}
              onMouseEnter={() => setActive(segment.index)}
              onMouseLeave={() => setActive(null)}
              className="cursor-pointer transition-all duration-200"
            />
          ))}
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-navy">
            {focused
              ? `${toBanglaNumber(Math.round(focused.fraction * 100))}%`
              : toBanglaNumber(total)}
          </span>
          <span className="font-bangla text-[11px] text-muted-foreground">
            {focused ? focused.label : "মোট অর্ডার"}
          </span>
        </div>
      </div>

      <ul className="flex w-full flex-col gap-2.5 sm:w-auto">
        {segments.map((segment) => (
          <li
            key={segment.label}
            onMouseEnter={() => setActive(segment.index)}
            onMouseLeave={() => setActive(null)}
            className={cn(
              "flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-2 transition-colors",
              active === segment.index ? "bg-muted/60" : "hover:bg-muted/40",
            )}
          >
            <span className="flex items-center gap-2.5">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="font-bangla text-sm text-foreground/80">
                {segment.label}
              </span>
            </span>
            <span className="text-sm font-bold text-navy">
              {toBanglaNumber(segment.value)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
