"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Menu, Plus, Search, X } from "lucide-react";

import { AutoBreadcrumb } from "@/components/shared/auto-breadcrumb";
import { cn } from "@/lib/utils";

type AdminTopbarProps = {
  onOpenMobile: () => void;
};

const NOTIFICATIONS = [
  { id: "n1", title: "নতুন অর্ডার #IB-24107", time: "২ মিনিট আগে", unread: true },
  { id: "n2", title: "স্টক কম: তাজা ইলিশ প্যাক", time: "১ ঘণ্টা আগে", unread: true },
  { id: "n3", title: "পেমেন্ট নিশ্চিত হয়েছে", time: "৩ ঘণ্টা আগে", unread: false },
];

export function AdminTopbar({ onOpenMobile }: AdminTopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-30 border-b border-border/70 bg-white/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-6">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="মেনু খুলুন"
          className="grid size-10 shrink-0 place-items-center rounded-xl text-navy transition-colors hover:bg-primary/10 lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        {/* Breadcrumb (desktop) */}
        <div className="hidden min-w-0 lg:block">
          <AutoBreadcrumb
            showHome={false}
            overrides={{ dashboard: "ড্যাশবোর্ড", overview: "ওভারভিউ" }}
          />
        </div>

        {/* Brand (mobile / tablet, when no breadcrumb) */}
        <div className="flex min-w-0 items-center gap-2 lg:hidden">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-white shadow-sm shadow-primary/30 font-bold text-sm">
            ই
          </span>
          <span className="font-bangla truncate text-base font-bold tracking-tight text-navy">
            ইলিশ বাজার
          </span>
        </div>

        {/* Search (desktop / tablet) */}
        <div className="relative mx-auto hidden w-full max-w-md md:block">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            name="admin-search"
            aria-label="অ্যাডমিন সার্চ"
            placeholder="অর্ডার, পণ্য বা গ্রাহক খুঁজুন…"
            className="h-10 w-full rounded-xl border border-border/70 bg-muted/40 pl-10 pr-16 font-bangla text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-border bg-white px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:flex">
            Ctrl K
          </kbd>
        </div>

        {/* Actions */}
        <div className="ms-auto flex shrink-0 items-center gap-0.5 sm:gap-1.5">
          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            aria-label={searchOpen ? "সার্চ বন্ধ করুন" : "সার্চ খুলুন"}
            aria-expanded={searchOpen}
            className="grid size-10 place-items-center rounded-xl text-navy transition-colors hover:bg-primary/10 md:hidden"
          >
            {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
          </button>

          <button
            type="button"
            aria-label="নতুন পণ্য"
            className="hidden h-9 items-center gap-1.5 rounded-xl bg-primary px-3 font-bangla text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/30 transition-all hover:bg-primary/90 active:scale-[0.97] md:inline-flex"
          >
            <Plus className="size-4" />
            নতুন পণ্য
          </button>

          <NotificationBell />

          <span className="mx-1 hidden h-7 w-px bg-border sm:block" />

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-muted sm:pr-2"
            aria-label="প্রোফাইল মেনু"
          >
            <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-navy to-primary text-sm font-bold text-white">
              আ
            </span>
            <span className="hidden flex-col items-start leading-tight xl:flex">
              <span className="font-bangla text-sm font-semibold text-navy">
                আরিফুল ইসলাম
              </span>
              <span className="text-[11px] text-muted-foreground">
                সুপার অ্যাডমিন
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Search (mobile) */}
      {searchOpen ? (
        <div className="border-t border-border/70 px-3 py-2.5 md:hidden">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              name="admin-search-mobile"
              aria-label="অ্যাডমিন সার্চ"
              autoFocus
              placeholder="অর্ডার, পণ্য বা গ্রাহক খুঁজুন…"
              className="h-10 w-full rounded-xl border border-border/70 bg-muted/40 pl-10 pr-4 font-bangla text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointer = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="নোটিফিকেশন"
        aria-expanded={open}
        className={cn(
          "relative grid size-10 place-items-center rounded-xl text-navy transition-colors hover:bg-primary/10",
          open && "bg-primary/10",
        )}
      >
        <Bell className="size-5" />
        <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-white" />
      </button>

      <div
        className={cn(
          "absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-1.5rem)] origin-top-right rounded-2xl border border-border/70 bg-white p-2 shadow-xl shadow-navy/10 transition-all duration-150",
          open
            ? "visible scale-100 opacity-100"
            : "pointer-events-none invisible scale-95 opacity-0",
        )}
      >
        <div className="flex items-center justify-between px-3 py-2">
          <p className="text-sm font-semibold text-navy">নোটিফিকেশন</p>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            {NOTIFICATIONS.filter((item) => item.unread).length} নতুন
          </span>
        </div>

        <ul className="flex flex-col gap-0.5">
          {NOTIFICATIONS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
              >
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    item.unread ? "bg-primary" : "bg-border",
                  )}
                />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-bangla text-sm text-foreground/90">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {item.time}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
