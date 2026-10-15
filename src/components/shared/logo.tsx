import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("text-lg font-semibold tracking-tight", className)}>
      ইলিশ<span className="text-sky-600">Bazar</span>
    </Link>
  );
}
