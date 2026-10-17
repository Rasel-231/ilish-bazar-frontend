import type { ReactNode } from "react";

import { AdminShell } from "@/components/layouts/admin-shell";

export const metadata = {
  title: {
    default: "অ্যাডমিন",
    template: "%s · ইলিশ বাজার অ্যাডমিন",
  },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
