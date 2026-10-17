import type { BreadcrumbItem } from "@/components/shared/breadcrumb";

/**
 * Human-friendly labels for known route segments.
 * Keys are the raw URL segment (without slashes).
 */
export const BREADCRUMB_LABELS: Record<string, string> = {
  ilish: "সব ইলিশ",
  shop: "ইলিশ কিনুন",
  products: "ইলিশ কিনুন",
  "track-order": "অর্ডার ট্র্যাক",
  "my-orders": "আমার অর্ডার",
  "refund-policy": "রিফান্ড নীতি",
  cart: "কার্ট",
  checkout: "চেকআউট",
  login: "লগইন",
  register: "রেজিস্টার",
  terms: "শর্তাবলী",
  privacy: "গোপনীয়তা নীতি",
  "how-it-works": "কীভাবে কাজ করে",
  dashboard: "ড্যাশবোর্ড",
  profile: "প্রোফাইল",
};

/** Turn a raw slug such as `padma-ilish` into `Padma Ilish` as a fallback. */
function prettifySegment(segment: string): string {
  return decodeURIComponent(segment)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

type BuildBreadcrumbOptions = {
  /**
   * Per-segment label overrides, keyed by raw URL segment.
   * Useful for dynamic routes (e.g. a product slug → product name).
   */
  overrides?: Record<string, string>;
  /** Drop the final crumb (e.g. when the page renders its own H1). */
  excludeCurrent?: boolean;
};

/**
 * Build breadcrumb items from a pathname, e.g. `/my-orders` →
 * `[{ label: "আমার অর্ডার", href: "/my-orders" }]`.
 */
export function buildBreadcrumbItems(
  pathname: string,
  { overrides, excludeCurrent = false }: BuildBreadcrumbOptions = {},
): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const target = excludeCurrent ? segments.slice(0, -1) : segments;

  return target.map((segment, index) => ({
    label:
      overrides?.[segment] ??
      BREADCRUMB_LABELS[segment] ??
      prettifySegment(segment),
    href: `/${target.slice(0, index + 1).join("/")}`,
  }));
}
