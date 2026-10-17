import type { OrderStatus } from "@/types/common.types";

/** Format a number with Bangla (bn-BD) digits. */
export function toBanglaNumber(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("bn-BD", options).format(value);
}

/** Compact Bangla number, e.g. ১.২ হাজার / ৪.৮ লাখ. */
export function toCompactBangla(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Currency in Bangla numerals, e.g. ৳৪,৮৫,২০০. */
export function formatBanglaCurrency(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(value);
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "অপেক্ষমাণ",
  CONFIRMED: "নিশ্চিত",
  PROCESSING: "প্রস্তুত হচ্ছে",
  SHIPPED: "পথে আছে",
  DELIVERED: "ডেলিভারড",
  CANCELLED: "বাতিল",
};

export const ORDER_STATUS_TONE: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700 ring-amber-600/20",
  CONFIRMED: "bg-sky-100 text-sky-700 ring-sky-600/20",
  PROCESSING: "bg-indigo-100 text-indigo-700 ring-indigo-600/20",
  SHIPPED: "bg-violet-100 text-violet-700 ring-violet-600/20",
  DELIVERED: "bg-emerald-100 text-emerald-700 ring-emerald-600/20",
  CANCELLED: "bg-red-100 text-red-700 ring-red-600/20",
};

/** Build a smooth (Catmull-Rom → cubic bezier) SVG path through points. */
export function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

/** Map a numeric series to evenly spaced chart points within a viewport. */
export function toChartPoints(
  values: number[],
  width: number,
  height: number,
  padding = 8,
) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const stepX = values.length > 1 ? width / (values.length - 1) : 0;

  return values.map((value, index) => ({
    x: index * stepX,
    y: padding + (1 - (value - min) / range) * (height - padding * 2),
  }));
}
