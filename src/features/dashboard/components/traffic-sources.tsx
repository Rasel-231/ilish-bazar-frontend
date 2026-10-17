import { cn } from "@/lib/utils";

import type { TrafficSource } from "../types/dashboard.types";
import { toBanglaNumber } from "../utils/dashboard.utils";

const BAR_STYLES: Record<TrafficSource["tone"], string> = {
  primary: "bg-primary",
  navy: "bg-navy",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  violet: "bg-violet-500",
};

type TrafficSourcesProps = {
  sources: TrafficSource[];
};

export function TrafficSources({ sources }: TrafficSourcesProps) {
  return (
    <ul className="flex flex-col gap-4">
      {sources.map((source) => (
        <li key={source.id}>
          <div className="flex items-center justify-between gap-3">
            <span className="font-bangla text-sm font-medium text-foreground/80">
              {source.label}
            </span>
            <span className="text-sm font-semibold text-navy">
              {toBanglaNumber(source.share)}%
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full transition-all duration-500", BAR_STYLES[source.tone])}
                style={{ width: `${source.share}%` }}
              />
            </div>
            <span className="w-20 shrink-0 text-right text-[11px] text-muted-foreground">
              {toBanglaNumber(source.sessions)} সেশন
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
