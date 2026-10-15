import { Megaphone } from "lucide-react";
import React from "react";

interface AnnouncementTickerProps {
  notices: string[];
  className?: string;
  icon?: React.ReactNode;
}

export function AnnouncementTicker({
  notices,
  className = "",
  icon = (
    <Megaphone
      className="size-3.5 shrink-0 text-amber-300"
      aria-hidden="true"
    />
  ),
}: AnnouncementTickerProps) {
  if (!notices || notices.length === 0) return null;

  const renderNoticeGroup = (ariaHidden?: boolean) => (
    <ul
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-10 pe-10"
    >
      {notices.map((notice, index) => (
        <li
          key={`${ariaHidden ? "hidden" : "visible"}-${index}-${notice}`}
          className="flex items-center gap-2.5 whitespace-nowrap"
        >
          {icon}
          <span>{notice}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      role="region"
      aria-label="গুরুত্বপূর্ণ নোটিশ"
      className={`overflow-hidden bg-navy py-2 text-[13px] font-medium text-white/95 ${className}`}
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center">
        {/* Main Content */}
        {renderNoticeGroup()}

        {/* Duplicate Content for Seamless Loop */}
        <div className="contents motion-reduce:hidden">
          {renderNoticeGroup(true)}
        </div>
      </div>
    </div>
  );
}
