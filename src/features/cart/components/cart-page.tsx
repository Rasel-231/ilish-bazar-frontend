"use client";

import Link from "next/link";
import {
  ArrowRight,
  Minus,
  PackageOpen,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { ProductImage } from "@/components/shared/product-image";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/core/hooks";

import {
  removeItem,
  selectCartHydrated,
  selectCartItems,
  setItemQuantity,
} from "../store/cart-slice";
import {
  FREE_DELIVERY_THRESHOLD,
  cartItemLineTotal,
  cartItemUnitPrice,
  cartItemWeightKg,
  cartSubtotal,
  cartTotalPieces,
} from "../utils/cart.utils";
import {
  formatTaka,
  toBnNumber,
} from "@/features/shop/utils/shop.utils";

export function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const hydrated = useAppSelector(selectCartHydrated);

  const subtotal = cartSubtotal(items);
  const pieces = cartTotalPieces(items);
  const remaining = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);
  const progress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  if (!hydrated) {
    return (
      <div className="container-page py-10">
        <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="bg-canvas">
      <div className="container-page pb-14 pt-5 sm:pt-6">
        <Breadcrumb items={[{ label: "কার্ট" }]} />

        <header className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              আপনার কার্ট
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {pieces > 0
                ? `${toBnNumber(pieces)} পিস মাছ কার্টে আছে`
                : "কার্টে এখনো কোনো মাছ নেই"}
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-navy shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ShoppingBag className="size-4" />
            আরও ইলিশ দেখুন
          </Link>
        </header>

        {items.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="কার্ট খালি"
              description="পছন্দের তাজা ইলিশ বেছে নিয়ে কার্টে যোগ করুন, তারপর এক জায়গায় অর্ডার সম্পন্ন করুন।"
              action={
                <Button
                  render={<Link href="/shop" />}
                  nativeButton={false}
                  className="rounded-xl bg-primary px-5"
                >
                  <PackageOpen />
                  ইলিশ কিনুন
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <section className="space-y-3" aria-label="কার্টের পণ্য">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:gap-4 sm:p-4"
                >
                  <Link
                    href={`/shop/${item.slug}`}
                    className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-art-blue sm:size-28"
                  >
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      sizes="112px"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/shop/${item.slug}`}
                          className="line-clamp-1 text-sm font-bold text-navy hover:text-primary sm:text-base"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {item.origin} · {item.weightRange}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          প্রতি পিস আনুমানিক {formatTaka(cartItemUnitPrice(item))}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => dispatch(removeItem(item.id))}
                        aria-label={`${item.name} কার্ট থেকে সরান`}
                        className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex flex-wrap items-end justify-between gap-2">
                      <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              setItemQuantity({
                                id: item.id,
                                quantity: item.quantity - 1,
                              }),
                            )
                          }
                          disabled={item.quantity <= 1}
                          aria-label="পরিমাণ কমান"
                          className="grid size-8 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-white hover:text-navy disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-12 text-center text-sm font-bold text-navy">
                          {toBnNumber(item.quantity)} পিস
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              setItemQuantity({
                                id: item.id,
                                quantity: item.quantity + 1,
                              }),
                            )
                          }
                          aria-label="পরিমাণ বাড়ান"
                          className="grid size-8 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-white hover:text-navy"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-500">
                          আনুমানিক {toBnNumber(Number(cartItemWeightKg(item).toFixed(2)))} কেজি
                        </p>
                        <p className="text-base font-extrabold text-navy">
                          {formatTaka(cartItemLineTotal(item))}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-base font-bold text-navy">অর্ডার সারাংশ</h2>

              <div className="mt-4 rounded-xl bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Truck className="size-4 text-primary" />
                  {remaining === 0 ? (
                    <span className="font-semibold text-success">
                      ডেলিভারি ফ্রি পাচ্ছেন
                    </span>
                  ) : (
                    <span>
                      আর <strong>{formatTaka(remaining)}</strong> যোগ করলে
                      ডেলিভারি ফ্রি
                    </span>
                  )}
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">মোট পিস</dt>
                  <dd className="font-semibold text-navy">
                    {toBnNumber(pieces)} পিস
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">সাবটোটাল</dt>
                  <dd className="font-semibold text-navy">
                    {formatTaka(subtotal)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">ডেলিভারি</dt>
                  <dd className="font-medium text-slate-600">
                    চেকআউটে নির্ধারিত হবে
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex items-baseline justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-semibold text-navy">মোট</span>
                <span className="text-2xl font-extrabold text-primary">
                  {formatTaka(subtotal)}
                </span>
              </div>

              <Button
                render={<Link href="/checkout" />}
                nativeButton={false}
                className="mt-5 h-11 w-full rounded-xl text-sm font-bold shadow-sm"
              >
                চেকআউট করুন
                <ArrowRight className="size-4" />
              </Button>

              <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
                নিরাপদ অর্ডার। পেমেন্ট মাধ্যম চেকআউট পেজে বেছে নিতে পারবেন।
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
