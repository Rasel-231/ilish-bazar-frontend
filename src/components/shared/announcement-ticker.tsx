import { Megaphone } from "lucide-react";
import React from "react";

type AnnouncementTickerProps = {
  notices: string[];
  className?: string;
};

export function AnnouncementTicker({
  notices,
  className = "",
}: AnnouncementTickerProps) {
  if (!notices || notices.length === 0) return null;

  const renderNoticeGroup = (ariaHidden?: boolean) => (
    <ul
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-7 pe-7 sm:gap-9 sm:pe-9"
    >
      {notices.map((notice, index) => (
        <li
          key={`${ariaHidden ? "hidden" : "visible"}-${index}-${notice}`}
          className="flex items-center gap-2.5 whitespace-nowrap"
        >
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rotate-45 bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.7)]"
          />
          <span>{notice}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      role="region"
      aria-label="গুরুত্বপূর্ণ নোটিশ"
      className={`relative overflow-hidden border-b border-white/10 bg-navy text-[13px] font-medium text-white/95 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(14,124,134,0.16)_45%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />

      <div className="relative flex items-stretch">
        <div className="z-10 flex shrink-0 items-center ps-3 pe-4 sm:ps-4 sm:pe-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/25 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-amber-300 uppercase">
            <Megaphone className="size-3" aria-hidden="true" />
            নোটিশ
          </span>
        </div>

        <div className="min-w-0 flex-1 overflow-hidden py-2.5 [mask-image:linear-gradient(to_right,transparent,black_4%,black_94%,transparent)] motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:py-2 motion-reduce:[mask-image:none]">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:justify-center">
            {renderNoticeGroup()}

            <div className="contents motion-reduce:hidden">
              {renderNoticeGroup(true)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnnouncementTickerSkeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden border-b border-white/10 bg-navy py-2.5 ${className}`}
    >
      <div className="flex items-center gap-3 ps-3 sm:ps-4">
        <span className="h-[22px] w-16 shrink-0 rounded-full bg-white/10" />
        <span className="h-[22px] w-44 rounded-full bg-white/10 sm:w-80" />
        <span className="hidden h-[22px] flex-1 rounded-full bg-white/5 sm:block" />
      </div>
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </div>
  );
}
