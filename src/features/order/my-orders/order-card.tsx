"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  CreditCard,
  MapPin,
  Package,
  Phone,
  RotateCcw,
  StickyNote,
  Truck,
} from "lucide-react";

import { ProductImage } from "@/components/shared/product-image";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/features/order/components/payment-status-badge";
import { OrderStatusBadge } from "@/features/order/components/order-status-badge";
import type { Order } from "@/features/order/types/order.types";
import { canCancelOrder, getOrderTotalItems } from "@/features/order/utils/order.utils";
import { ROUTES } from "@/lib/navigation";
import { cn, formatCurrency } from "@/lib/utils";

import type { PaymentMethod } from "@/types/common.types";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  COD: "ক্যাশ অন ডেলিভারি",
  SSLCOMMERZ: "কার্ড / SSLCommerz",
  BKASH: "বিকাশ",
  NAGAD: "নগদ",
  STRIPE: "Stripe",
};

const banglaNumber = (value: number) =>
  new Intl.NumberFormat("bn-BD").format(value);

const banglaDate = (value: string) =>
  new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));

type OrderCardProps = {
  order: Order;
  /** Disable entrance animation when the user prefers reduced motion. */
  reduce?: boolean;
};

export function OrderCard({ order, reduce = false }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const totalItems = getOrderTotalItems(order);
  const cancellable = canCancelOrder(order);

  return (
    <motion.article
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm shadow-navy/5 transition-shadow hover:shadow-md hover:shadow-navy/10"
    >
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3.5 sm:px-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-primary">
              <Package className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="truncate text-sm font-bold text-navy">
              #{order.orderNumber}
            </p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {banglaDate(order.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </header>

      {/* Body */}
      <div className="px-4 py-4 sm:px-5">
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary">
                {item.productImage ? (
                  <ProductImage
                    src={item.productImage}
                    alt={item.productName}
                    sizes="56px"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <Package className="h-5 w-5" aria-hidden="true" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                {item.productSlug ? (
                  <Link
                    href={`${ROUTES.shop}/${item.productSlug}`}
                    className="line-clamp-1 text-sm font-semibold text-navy transition-colors hover:text-primary"
                  >
                    {item.productName}
                  </Link>
                ) : (
                  <p className="line-clamp-1 text-sm font-semibold text-navy">
                    {item.productName}
                  </p>
                )}
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatCurrency(item.unitPrice)} × {banglaNumber(item.quantity)}
                </p>
              </div>

              <p className="shrink-0 text-sm font-bold text-navy">
                {formatCurrency(item.lineTotal)}
              </p>
            </li>
          ))}
        </ul>

        {/* Expandable details */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
                <DetailRow
                  icon={MapPin}
                  label="ডেলিভারি ঠিকানা"
                  value={order.shippingAddress}
                />
                <DetailRow
                  icon={Phone}
                  label="ফোন"
                  value={order.phone}
                />
                <DetailRow
                  icon={CreditCard}
                  label="পেমেন্ট মাধ্যম"
                  value={PAYMENT_METHOD_LABELS[order.paymentMethod ?? "COD"]}
                />
                <DetailRow
                  icon={Truck}
                  label="ডেলিভারি চার্জ"
                  value={
                    Number(order.shippingFee) === 0
                      ? "ফ্রি"
                      : formatCurrency(order.shippingFee)
                  }
                />
                {order.note ? (
                  <div className="sm:col-span-2">
                    <DetailRow
                      icon={StickyNote}
                      label="বিশেষ নির্দেশনা"
                      value={order.note}
                    />
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3.5 sm:px-5">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground">
            {banglaNumber(totalItems)}টি পণ্য · সর্বমোট
          </span>
          <span className="text-lg font-black text-navy">
            {formatCurrency(order.totalAmount)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="font-bangla text-foreground/70"
          >
            বিস্তারিত
            <ChevronDown
              className={cn(
                "transition-transform duration-300",
                expanded && "rotate-180",
              )}
            />
          </Button>

          <Button
            render={<Link href={ROUTES.track} />}
            nativeButton={false}
            variant="outline"
            size="sm"
            className="font-bangla"
          >
            <Truck />
            ট্র্যাক করুন
          </Button>

          {cancellable ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="font-bangla"
            >
              বাতিল করুন
            </Button>
          ) : (
            <Button
              render={<Link href={ROUTES.shop} />}
              nativeButton={false}
              size="sm"
              className="font-bangla bg-primary hover:bg-primary/90"
            >
              <RotateCcw />
              আবার অর্ডার
            </Button>
          )}
        </div>
      </footer>
    </motion.article>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon
        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
        aria-hidden="true"
      />
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 break-words text-sm font-semibold text-navy">
          {value}
        </p>
      </div>
    </div>
  );
}
