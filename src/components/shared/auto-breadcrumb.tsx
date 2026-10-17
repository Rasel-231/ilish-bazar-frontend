"use client";

import { usePathname } from "next/navigation";

import { Breadcrumb } from "@/components/shared/breadcrumb";
import { buildBreadcrumbItems } from "@/lib/breadcrumbs";

type AutoBreadcrumbProps = {
  /**
   * Explicit pathname to build the trail from. Defaults to the current route.
   * e.g. `<AutoBreadcrumb pathname="/my-orders" />`.
   */
  pathname?: string;
  /**
   * Per-segment label overrides, keyed by raw URL segment.
   * Use it for dynamic routes, e.g. `{ [productSlug]: product.name }`.
   */
  overrides?: Record<string, string>;
  /** Drop the final crumb (e.g. when the page renders its own heading). */
  excludeCurrent?: boolean;
  /** Show a home link as the first crumb. */
  showHome?: boolean;
  homeLabel?: string;
  className?: string;
};

/**
 * Breadcrumb that derives its trail from a URL/route.
 * Drop it anywhere and it works: `<AutoBreadcrumb />`.
 */
export function AutoBreadcrumb({
  pathname,
  overrides,
  excludeCurrent,
  showHome,
  homeLabel,
  className,
}: AutoBreadcrumbProps) {
  const currentPathname = usePathname();
  const items = buildBreadcrumbItems(pathname ?? currentPathname, {
    overrides,
    excludeCurrent,
  });

  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb
      items={items}
      showHome={showHome}
      homeLabel={homeLabel}
      className={className}
    />
  );
}

/**
 * Ready-made breadcrumb strip with the standard bordered bar styling.
 * Drop it at the top of any page: `<BreadcrumbBar />`.
 */
export function BreadcrumbBar(props: AutoBreadcrumbProps) {
  return (
    <div className="border-b border-border bg-muted/30">
      <div className="container-page py-3.5">
        <AutoBreadcrumb {...props} />
      </div>
    </div>
  );
}
