import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/navigation";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  /** Show a home link as the first crumb. */
  showHome?: boolean;
  homeLabel?: string;
  className?: string;
};

export function Breadcrumb({
  items,
  showHome = true,
  homeLabel = "হোম",
  className,
}: BreadcrumbProps) {
  return (
    <nav aria-label="ব্রেডক্রাম্ব" className={cn("font-bangla", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {showHome && (
          <li className="flex items-center gap-1.5">
            <Link
              href={ROUTES.home}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <Home className="size-3.5" aria-hidden="true" />
              {homeLabel}
            </Link>
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const crumbKey = `${item.label}-${index}`;

          return (
            <li key={crumbKey} className="flex items-center gap-1.5">
              <ChevronRight
                className="size-3.5 text-muted-foreground/50"
                aria-hidden="true"
              />
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="font-semibold text-navy"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
