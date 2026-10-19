"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AdminBottomNav } from "./admin-bottom-nav";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [previousPathname, setPreviousPathname] = useState(pathname);

  // Close the mobile drawer on client-side navigation (render-phase adjustment).
  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    setMobileOpen(false);
  }

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-dvh w-full bg-[#f6f8fb]">
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((value) => !value)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onOpenMobile={() => setMobileOpen(true)} />

        <main className="flex flex-1 flex-col p-4 pb-28 sm:p-6 sm:pb-28 lg:p-8 lg:pb-8">
          <div className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col">
            {children}
          </div>
        </main>
      </div>

      <AdminBottomNav onOpenMenu={() => setMobileOpen(true)} />
    </div>
  );
}
