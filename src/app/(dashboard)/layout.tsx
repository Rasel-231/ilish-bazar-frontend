import type { ReactNode } from "react";

import { Sidebar } from "@/components/layouts/sidebar";
import { Logo } from "@/components/shared/logo";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b border-foreground/10 px-6 md:hidden">
          <Logo />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
