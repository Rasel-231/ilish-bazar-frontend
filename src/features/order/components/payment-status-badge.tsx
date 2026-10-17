import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@/types/common.types";

const STATUS_STYLES: Record<PaymentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-slate-200 text-slate-700",
};

const STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "অপরিশোধিত",
  PAID: "পরিশোধিত",
  FAILED: "ব্যর্থ",
  REFUNDED: "ফেরত",
};

type PaymentStatusBadgeProps = {
  status: PaymentStatus;
  className?: string;
};

export function PaymentStatusBadge({
  status,
  className,
}: PaymentStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
