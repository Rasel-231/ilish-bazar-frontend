"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  PackageOpen,
  Phone,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { ProductImage } from "@/components/shared/product-image";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import { formatTaka, toBnNumber } from "@/features/shop/utils/shop.utils";

import type { CheckoutPaymentMethod, StoredOrder } from "../types/checkout.types";
import { ORDERS_STORAGE_KEY } from "../utils/order-storage";

const PAYMENT_LABELS: Record<CheckoutPaymentMethod, string> = {
  cod: "ক্যাশ অন ডেলিভারি",
  bkash: "বিকাশ",
  nagad: "নগদ",
  card: "কার্ড পেমেন্ট",
};

function subscribeToOrders(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getOrdersSnapshot() {
  try {
    return window.localStorage.getItem(ORDERS_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function OrderSuccess({ orderNumber }: { orderNumber: string }) {
  const rawOrders = useSyncExternalStore(
    subscribeToOrders,
    getOrdersSnapshot,
    () => null,
  );

  const order = useMemo(() => {
    if (!rawOrders) return null;

    try {
      const stored = JSON.parse(rawOrders) as StoredOrder[];
      return stored.find((item) => item.orderNumber === orderNumber) ?? null;
    } catch {
      return null;
    }
  }, [orderNumber, rawOrders]);

  if (rawOrders === null) {
    return (
      <div className="container-page py-10">
        <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="bg-canvas">
        <div className="container-page pb-14 pt-5 sm:pt-6">
          <Breadcrumb items={[{ label: "অর্ডার সম্পন্ন" }]} />
          <div className="mt-6">
            <EmptyState
              title="অর্ডারটি খুঁজে পাওয়া যায়নি"
              description="অর্ডারটি হয়তো অন্য ব্রাউজারে করা হয়েছে। আপনার অর্ডার তালিকা দেখুন অথবা নতুন করে অর্ডার করুন।"
              action={
                <Button
                  render={<Link href="/my-orders" />}
                  nativeButton={false}
                  className="rounded-xl bg-primary px-5"
                >
                  আমার অর্ডার
                </Button>
              }
            />
          </div>
        </div>
      </div>
    );
  }

  const pieces = order.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="bg-canvas">
      <div className="container-page pb-14 pt-5 sm:pt-6">
        <Breadcrumb items={[{ label: "অর্ডার সম্পন্ন" }]} />

        <section className="mx-auto mt-6 max-w-3xl">
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 text-center shadow-sm sm:p-8">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
              <CheckCircle2 className="size-9" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold text-navy sm:text-3xl">
              অর্ডার সফল হয়েছে!
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              ধন্যবাদ {order.customer.name}। আপনার অর্ডার নিশ্চিত করা হয়েছে।
              আমাদের প্রতিনিধি শীঘ্রই কল দিয়ে ডেলিভারি নিশ্চিত করবেন।
            </p>

            <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm">
              <span className="text-slate-500">
                অর্ডার নম্বর:{" "}
                <strong className="font-bold text-navy">
                  {order.orderNumber}
                </strong>
              </span>
              <span className="text-slate-500">
                মোট:{" "}
                <strong className="font-bold text-primary">
                  {formatTaka(order.total)}
                </strong>
              </span>
              <span className="text-slate-500">
                পেমেন্ট:{" "}
                <strong className="font-bold text-navy">
                  {PAYMENT_LABELS[order.paymentMethod]}
                </strong>
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-bold text-navy">অর্ডারের মাছ</h2>
            <ul className="mt-3 divide-y divide-slate-100">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-art-blue">
                    <ProductImage src={item.image} alt={item.name} sizes="64px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-bold text-navy">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.origin} · {toBnNumber(item.quantity)} পিস
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-navy">
                    {formatTaka(
                      Math.round(
                        (item.weightG / 1000) *
                          item.pricePerKg *
                          item.quantity,
                      ),
                    )}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">
                  সাবটোটাল ({toBnNumber(pieces)} পিস)
                </dt>
                <dd className="font-semibold text-navy">
                  {formatTaka(order.subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">ডেলিভারি চার্জ</dt>
                <dd className="font-semibold text-navy">
                  {order.deliveryFee === 0
                    ? "ফ্রি"
                    : formatTaka(order.deliveryFee)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <dt className="font-semibold text-navy">সর্বমোট</dt>
                <dd className="text-lg font-extrabold text-primary">
                  {formatTaka(order.total)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoCard
              icon={MapPin}
              title="ডেলিভারি ঠিকানা"
              lines={[order.customer.address, order.customer.areaLabel]}
            />
            <InfoCard
              icon={Truck}
              title="ডেলিভারির সময়"
              lines={[order.customer.slotLabel, `কাটিং: ${order.customer.cuttingLabel}`]}
            />
            <InfoCard
              icon={Phone}
              title="মোবাইল"
              lines={[order.customer.phone]}
            />
            <InfoCard
              icon={CreditCard}
              title="পেমেন্ট"
              lines={[
                PAYMENT_LABELS[order.paymentMethod],
                order.paymentStatus === "PAID" ? "পেমেন্ট সম্পন্ন" : "ডেলিভারির সময় পরিশোধ",
              ]}
            />
          </div>

          {order.customer.note && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <Clock className="mt-0.5 size-4 shrink-0" />
              বিশেষ নির্দেশনা: {order.customer.note}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button
              render={<Link href="/my-orders" />}
              nativeButton={false}
              className="h-11 flex-1 rounded-xl text-sm font-bold"
            >
              <ShoppingBag className="size-4" />
              আমার অর্ডার দেখুন
            </Button>
            <Button
              render={<Link href="/shop" />}
              nativeButton={false}
              variant="outline"
              className="h-11 flex-1 rounded-xl border-slate-300 text-sm font-bold text-navy"
            >
              <PackageOpen className="size-4" />
              আরও ইলিশ কিনুন
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  lines,
}: {
  icon: typeof MapPin;
  title: string;
  lines: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Icon className="size-4 text-primary" />
        {title}
      </div>
      {lines.filter(Boolean).map((line) => (
        <p key={line} className="mt-1 text-sm font-semibold text-navy">
          {line}
        </p>
      ))}
    </div>
  );
}
