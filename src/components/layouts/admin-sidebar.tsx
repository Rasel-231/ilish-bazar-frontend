"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Fish,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Store,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ADMIN_ROUTES } from "@/lib/navigation";

import { ADMIN_NAV } from "@/features/dashboard/components/admin-nav";

type AdminSidebarProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === ADMIN_ROUTES.dashboard
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={onCloseMobile}
        className={cn(
          "fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex max-w-[85vw] flex-col bg-[linear-gradient(180deg,#0b2540_0%,#0a1c33_100%)] text-white shadow-2xl shadow-navy/30 transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:max-w-none lg:translate-x-0",
          collapsed ? "w-20" : "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(14,124,134,0.35),transparent)]"
        />

        {/* Brand */}
        <div
          className={cn(
            "relative flex h-16 shrink-0 items-center border-b border-white/10",
            collapsed ? "justify-center px-3" : "justify-between px-4",
          )}
        >
          <Link
            href={ADMIN_ROUTES.dashboard}
            onClick={onCloseMobile}
            className="flex items-center gap-2.5"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-white shadow-lg shadow-primary/30">
              <Fish className="size-5" strokeWidth={2.2} />
            </span>
            {!collapsed && (
              <span className="flex min-w-0 flex-col leading-none">
                <span className="font-bangla text-lg font-bold tracking-tight">
                  ইলিশ বাজার
                </span>
                <span className="mt-0.5 text-[11px] font-medium text-white/50">
                  অ্যাডমিন কনসোল
                </span>
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="মেনু বন্ধ করুন"
            className="grid size-9 place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="অ্যাডমিন নেভিগেশন"
          className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-5 no-scrollbar"
        >
          {ADMIN_NAV.map((group) => (
            <div key={group.label} className="flex flex-col gap-1.5">
              {!collapsed && (
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                  {group.label}
                </p>
              )}

              {group.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all duration-200",
                      collapsed ? "justify-center px-0" : "px-3",
                      active
                        ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                        : "text-white/65 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-primary to-primary/50 shadow-[0_0_12px_rgba(14,124,134,0.9)]" />
                    )}

                    <Icon
                      className={cn(
                        "size-5 shrink-0 transition-colors",
                        active
                          ? "text-primary"
                          : "text-white/55 group-hover:text-white",
                      )}
                      aria-hidden="true"
                    />

                    {!collapsed && (
                      <>
                        <span className="font-bangla flex-1 truncate">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-bold",
                              active
                                ? "bg-primary text-white"
                                : "bg-white/10 text-white/70",
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}

                    {collapsed && item.badge && (
                      <span className="absolute right-2 top-1.5 size-2 rounded-full bg-primary shadow-[0_0_6px_rgba(14,124,134,0.9)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="relative flex flex-col gap-3 border-t border-white/10 p-3">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium text-white/65 transition-colors hover:bg-white/5 hover:text-white",
              collapsed ? "justify-center px-0" : "px-3",
            )}
            title={collapsed ? "স্টোর দেখুন" : undefined}
          >
            <Store className="size-5 shrink-0" aria-hidden="true" />
            {!collapsed && <span className="font-bangla">স্টোর দেখুন</span>}
          </Link>

          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-sm font-bold">
                আ
              </span>
              <span className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="truncate font-bangla text-sm font-semibold">
                  আরিফুল ইসলাম
                </span>
                <span className="truncate text-[11px] text-white/50">
                  সুপার অ্যাডমিন
                </span>
              </span>
              <button
                type="button"
                aria-label="লগআউট"
                className="grid size-8 shrink-0 place-items-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label="লগআউট"
              className="grid place-items-center rounded-xl py-2.5 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut className="size-5" />
            </button>
          )}

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "সাইডবার প্রসারিত করুন" : "সাইডবার সংকুচিত করুন"}
            className="hidden items-center justify-center gap-2 rounded-xl border border-white/10 py-2 text-xs font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white lg:flex"
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <>
                <PanelLeftClose className="size-4" />
                সংকুচিত করুন
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
