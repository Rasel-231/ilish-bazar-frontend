"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MessageCircle,
  PackageSearch,
  Phone,
  Printer,
  Receipt,
  StickyNote,
  Truck,
  User,
} from "lucide-react";

import { ProductImage } from "@/components/shared/product-image";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/features/order/components/payment-status-badge";
import { OrderStatusBadge } from "@/features/order/components/order-status-badge";
import type { Order } from "@/features/order/types/order.types";
import {
  getLineTotal,
  getOrderTotalItems,
} from "@/features/order/utils/order.utils";
import { ROUTES } from "@/lib/navigation";
import { cn, formatCurrency } from "@/lib/utils";

import type { OrderStatus, PaymentMethod } from "@/types/common.types";

import { getOrderProgress, OrderTimeline } from "./order-timeline";

const STATUS_META: Record<
  OrderStatus,
  { label: string; description: string; tint: string }
> = {
  PENDING: {
    label: "অপেক্ষমাণ",
    description: "আপনার অর্ডারটি আমরা পেয়েছি, শীঘ্রই নিশ্চিত করা হবে।",
    tint: "from-amber-500/90 via-amber-500/40 to-transparent",
  },
  CONFIRMED: {
    label: "নিশ্চিত হয়েছে",
    description: "অর্ডার কনফার্ম হয়েছে, প্রস্তুতি শুরু হয়েছে।",
    tint: "from-sky-500/90 via-sky-500/40 to-transparent",
  },
  PROCESSING: {
    label: "প্রস্তুত হচ্ছে",
    description: "তাজা ইলিশ পরিষ্কার করে প্যাক করা হচ্ছে।",
    tint: "from-indigo-500/90 via-indigo-500/40 to-transparent",
  },
  SHIPPED: {
    label: "পথে আছে",
    description: "আপনার অর্ডার ডেলিভারির জন্য পাঠানো হয়েছে।",
    tint: "from-violet-500/90 via-violet-500/40 to-transparent",
  },
  DELIVERED: {
    label: "ডেলিভারি সম্পন্ন",
    description: "আপনার অর্ডার সফলভাবে পৌঁছে দেওয়া হয়েছে।",
    tint: "from-emerald-500/90 via-emerald-500/40 to-transparent",
  },
  CANCELLED: {
    label: "বাতিল",
    description: "এই অর্ডারটি বাতিল করা হয়েছে।",
    tint: "from-destructive/90 via-destructive/40 to-transparent",
  },
};

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

const banglaDayShort = (value: string) =>
  new Intl.DateTimeFormat("bn-BD", { dateStyle: "long" }).format(
    new Date(value),
  );

function getEta(status: OrderStatus): { label: string; value: string } {
  switch (status) {
    case "PENDING":
    case "CONFIRMED":
      return { label: "সম্ভাব্য ডেলিভারি", value: "আগামী ২–৩ দিনের মধ্যে" };
    case "PROCESSING":
      return { label: "সম্ভাব্য ডেলিভারি", value: "আগামী ১–২ দিনের মধ্যে" };
    case "SHIPPED":
      return { label: "সম্ভাব্য ডেলিভারি", value: "আজ অথবা আগামীকাল" };
    case "DELIVERED":
      return { label: "ডেলিভার ইতিহাস", value: "সম্পন্ন হয়েছে" };
    default:
      return { label: "সর্বশেষ অবস্থা", value: "অর্ডার বাতিল করা হয়েছে" };
  }
}

export function TrackResult({ order }: { order: Order }) {
  const meta = STATUS_META[order.status];
  const totalItems = getOrderTotalItems(order);
  const progress = getOrderProgress(order.status);
  const eta = getEta(order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="space-y-6">
      {/* Status banner */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-navy p-6 text-white shadow-xl shadow-navy/25 sm:p-8"
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
            meta.tint,
          )}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="font-bangla text-xs font-semibold uppercase tracking-widest text-white/60">
              অর্ডার নম্বর
            </p>
            <h2 className="mt-1 font-mono text-2xl font-black tracking-tight text-white sm:text-3xl">
              #{order.orderNumber}
            </h2>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <OrderStatusBadge status={order.status} className="ring-1 ring-white/20" />
              <PaymentStatusBadge
                status={order.paymentStatus}
                className="ring-1 ring-white/20"
              />
            </div>

            <p className="mt-4 max-w-md font-bangla text-sm leading-relaxed text-white/75">
              {meta.description}
            </p>
          </div>

          <div className="w-full max-w-sm shrink-0 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
            <p className="font-bangla text-xs font-medium text-white/60">
              {eta.label}
            </p>
            <p className="mt-1 font-bangla text-lg font-bold text-white">
              {eta.value}
            </p>

            <div className="mt-4 flex items-center justify-between font-bangla text-xs text-white/70">
              <span>ডেলিভারি অগ্রগতি</span>
              <span className="font-bold text-white">
                {banglaNumber(progress)}%
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-300 to-cyan-200"
                initial={{ width: 0 }}
                animate={{ width: `${isCancelled ? 0 : progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
              <div>
                <dt className="font-bangla text-[11px] text-white/55">পণ্য</dt>
                <dd className="font-bangla text-sm font-bold text-white">
                  {banglaNumber(totalItems)}টি
                </dd>
              </div>
              <div>
                <dt className="font-bangla text-[11px] text-white/55">
                  সর্বমোট
                </dt>
                <dd className="font-bangla text-sm font-bold text-white">
                  {formatCurrency(order.totalAmount)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </motion.section>

      {/* Detail grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <Card title="ডেলিভারি অগ্রগতি" icon={Truck}>
            <OrderTimeline status={order.status} />
          </Card>

          <Card
            title="অর্ডারকৃত পণ্য"
            icon={PackageSearch}
            action={
              <span className="rounded-full bg-muted px-2.5 py-0.5 font-bangla text-xs font-semibold text-muted-foreground">
                {banglaNumber(totalItems)}টি
              </span>
            }
          >
            <ul className="divide-y divide-border">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary">
                    {item.productImage ? (
                      <ProductImage
                        src={item.productImage}
                        alt={item.productName}
                        sizes="64px"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <PackageSearch className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    {item.productSlug ? (
                      <Link
                        href={`${ROUTES.shop}/${item.productSlug}`}
                        className="line-clamp-1 font-bangla text-sm font-semibold text-navy transition-colors hover:text-primary"
                      >
                        {item.productName}
                      </Link>
                    ) : (
                      <p className="line-clamp-1 font-bangla text-sm font-semibold text-navy">
                        {item.productName}
                      </p>
                    )}
                    <p className="mt-0.5 font-bangla text-xs text-muted-foreground">
                      {formatCurrency(item.unitPrice)} ×{" "}
                      {banglaNumber(item.quantity)}
                    </p>
                  </div>

                  <p className="shrink-0 font-bangla text-sm font-bold text-navy">
                    {getLineTotal(item)}
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="ডেলিভারি তথ্য" icon={Truck}>
            <div className="grid gap-5 sm:grid-cols-2">
              <InfoRow
                icon={User}
                label="গ্রহণকারী"
                value={order.user.name}
              />
              <InfoRow icon={Phone} label="ফোন" value={order.phone} />
              <div className="sm:col-span-2">
                <InfoRow
                  icon={Receipt}
                  label="ডেলিভারি ঠিকানা"
                  value={order.shippingAddress}
                />
              </div>
              {order.note ? (
                <div className="sm:col-span-2">
                  <InfoRow
                    icon={StickyNote}
                    label="বিশেষ নির্দেশনা"
                    value={order.note}
                  />
                </div>
              ) : null}
            </div>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <Card title="পেমেন্ট সারসংক্ষেপ" icon={CreditCard}>
            <dl className="space-y-3 font-bangla text-sm">
              <SummaryRow label="সাবটোটাল" value={formatCurrency(order.subtotal)} />
              <SummaryRow
                label="ডেলিভারি চার্জ"
                value={
                  Number(order.shippingFee) === 0
                    ? "ফ্রি"
                    : formatCurrency(order.shippingFee)
                }
              />
              <div className="border-t border-dashed border-border pt-3">
                <div className="flex items-center justify-between">
                  <dt className="font-bold text-navy">সর্বমোট</dt>
                  <dd className="text-lg font-black text-primary">
                    {formatCurrency(order.totalAmount)}
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-5 space-y-3 rounded-xl bg-muted/50 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bangla text-xs text-muted-foreground">
                  পেমেন্ট মাধ্যম
                </span>
                <span className="font-bangla text-sm font-semibold text-navy">
                  {PAYMENT_METHOD_LABELS[order.paymentMethod ?? "COD"]}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-bangla text-xs text-muted-foreground">
                  পেমেন্ট অবস্থা
                </span>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
            </div>
          </Card>

          <Card title="অর্ডার তথ্য" icon={CalendarDays}>
            <dl className="space-y-4">
              <InfoRow
                icon={CalendarDays}
                label="অর্ডার করা হয়েছে"
                value={banglaDate(order.createdAt)}
              />
              <InfoRow
                icon={CheckCircle2}
                label="সর্বশেষ আপডেট"
                value={banglaDayShort(order.updatedAt)}
              />
              <InfoRow
                icon={Receipt}
                label="ট্র্যাকিং আইডি"
                value={order.orderNumber}
              />
            </dl>
          </Card>

          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-accent to-card p-5">
            <h3 className="font-bangla text-base font-bold text-navy">
              সাহায্য দরকার?
            </h3>
            <p className="mt-1 font-bangla text-sm leading-relaxed text-muted-foreground">
              অর্ডার নিয়ে কোনো প্রশ্ন থাকলে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ
              করুন।
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button
                render={<a href="tel:+8801000000000" />}
                nativeButton={false}
                variant="outline"
                className="justify-start gap-2 rounded-xl bg-card font-bangla"
              >
                <Phone className="text-primary" />
                কল করুন
              </Button>
              <Button
                render={<Link href={ROUTES.myOrders} />}
                nativeButton={false}
                className="justify-start gap-2 rounded-xl font-bangla"
              >
                <PackageSearch />
                আমার সব অর্ডার
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:p-5"
      >
        <p className="font-bangla text-sm text-muted-foreground">
          অর্ডার সম্পর্কে আরও জানতে চান বা আবার কিনতে চান?
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="gap-2 rounded-xl font-bangla no-print"
            onClick={() => window.print()}
          >
            <Printer />
            প্রিন্ট করুন
          </Button>
          <Button
            variant="outline"
            className="gap-2 rounded-xl font-bangla"
            render={<a href="https://wa.me/8801000000000" target="_blank" rel="noreferrer" />}
            nativeButton={false}
          >
            <MessageCircle />
            সাপোর্ট
          </Button>
          <Button
            render={<Link href={ROUTES.shop} />}
            nativeButton={false}
            className="gap-2 rounded-xl bg-primary font-bangla hover:bg-primary/90"
          >
            আরও কিনুন
            <ArrowRight />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  action,
  children,
  className,
}: {
  title: string;
  icon: typeof Truck;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(11,37,64,0.04),0_12px_32px_-18px_rgba(11,37,64,0.18)] sm:p-6",
        className,
      )}
    >
      <header className="mb-5 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2.5 font-bangla text-base font-bold text-navy">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          {title}
        </h3>
        {action}
      </header>
      {children}
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Truck;
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
        <p className="font-bangla text-xs font-medium text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 break-words font-bangla text-sm font-semibold text-navy">
          {value}
        </p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-navy">{value}</dd>
    </div>
  );
}
