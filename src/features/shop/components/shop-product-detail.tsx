"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  Minus,
  PackageCheck,
  Plus,
  Scale,
  ShoppingCart,
  Snowflake,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";

import { ProductImage } from "@/components/shared/product-image";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import { addItem } from "@/features/cart/store/cart-slice";
import {
  cartItemFromProduct,
  cartItemWeightKg,
} from "@/features/cart/utils/cart.utils";
import { useAppDispatch } from "@/redux/core/hooks";

import type { ShopProduct } from "../types/shop.types";
import {
  formatRating,
  formatReviewCount,
  formatTaka,
  formatWeight,
  toBnNumber,
} from "../utils/shop.utils";

type Props = {
  product: ShopProduct;
  related: ShopProduct[];
};

export function ShopProductDetail({ product, related }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);

  const estimatedWeight = cartItemWeightKg({
    quantity,
    weightG: product.weightG,
  });
  const estimatedTotal = Math.round(estimatedWeight * product.pricePerKg);
  const outOfStock = !product.inStock;

  const addToCart = () => {
    dispatch(addItem(cartItemFromProduct(product, quantity)));
    toast.success(
      `${toBnNumber(quantity)} পিস ${product.name} কার্টে যোগ হয়েছে`,
    );
  };

  const buyNow = () => {
    router.push(
      `/checkout?buy=${encodeURIComponent(product.slug)}&qty=${quantity}`,
    );
  };

  return (
    <div className="bg-canvas">
      <div className="container-page pb-14 pt-5 sm:pt-6">
        <div className="flex items-center justify-between gap-3">
          <Breadcrumb
            items={[
              { label: "তাজা ইলিশ", href: "/shop" },
              { label: product.name },
            ]}
          />
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            সব ইলিশ
          </Link>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
          {/* Gallery */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[0_1px_2px_rgba(11,37,64,0.04),0_16px_36px_-22px_rgba(11,37,64,0.28)]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-art-blue">
              <ProductImage
                src={activeImage}
                alt={product.name}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
              <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
                {product.tag && (
                  <span className="rounded-full bg-amber-400/95 px-3 py-1 text-xs font-bold text-amber-950 shadow-sm">
                    {product.tag}
                  </span>
                )}
                {product.fresh && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/95 px-3 py-1 text-xs font-bold text-white shadow-sm">
                    <Check className="size-3.5" strokeWidth={3} />
                    ফ্রেশ সংগ্রহ
                  </span>
                )}
              </div>
              {outOfStock && (
                <span className="absolute inset-0 grid place-items-center bg-navy/55 text-lg font-bold text-white backdrop-blur-[1px]">
                  স্টক শেষ
                </span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    aria-label={`ছবি ${toBnNumber(index + 1)}`}
                    className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 transition hover:border-primary"
                  >
                    <ProductImage src={image} alt="" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info + actions */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                <MapPin className="size-3.5" aria-hidden="true" />
                {product.origin}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                <Scale className="size-3.5" aria-hidden="true" />
                {product.weightRange}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                {formatRating(product.rating)}
                <span className="font-normal text-slate-400">
                  ({formatReviewCount(product.reviews)})
                </span>
              </span>
              <span aria-hidden="true">•</span>
              <span>{product.pieceWeight}</span>
              <span aria-hidden="true">•</span>
              <span
                className={
                  outOfStock ? "font-semibold text-destructive" : "text-success"
                }
              >
                {outOfStock ? "স্টক শেষ" : "স্টকে আছে"}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-x-2 border-y border-slate-100 py-4">
              <span className="text-3xl font-extrabold tabular-nums text-navy">
                {formatTaka(product.pricePerKg)}
              </span>
              <span className="text-sm font-medium text-slate-500">/ কেজি</span>
              <span className="w-full text-xs text-slate-500">
                আনুমানিক প্রতি পিস {formatTaka(Math.round((product.weightG / 1000) * product.pricePerKg))}
              </span>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-navy">
                কত পিস নিতে চান?
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex h-11 items-stretch overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    disabled={quantity <= 1}
                    aria-label="এক পিস কমান"
                    className="grid w-11 place-items-center bg-slate-50 text-navy transition hover:bg-slate-100 disabled:opacity-40"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span
                    aria-live="polite"
                    className="grid min-w-20 place-items-center px-3 text-sm font-bold text-navy"
                  >
                    {toBnNumber(quantity)} পিস
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.min(99, value + 1))}
                    aria-label="এক পিস বাড়ান"
                    className="grid w-11 place-items-center bg-slate-50 text-navy transition hover:bg-slate-100"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <div className="rounded-xl bg-accent px-3 py-2 text-xs text-accent-foreground">
                  আনুমানিক ওজন{" "}
                  <strong className="font-bold text-navy">
                    {toBnNumber(Number(estimatedWeight.toFixed(2)))} কেজি
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-end justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
              <span className="text-sm text-slate-600">আনুমানিক মোট</span>
              <span className="text-2xl font-extrabold text-primary">
                {formatTaka(estimatedTotal)}
              </span>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                onClick={addToCart}
                disabled={outOfStock}
                className="h-11 rounded-xl border-slate-300 text-sm font-bold text-navy hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              >
                <ShoppingCart className="size-4" />
                কার্টে যোগ করুন
              </Button>
              <Button
                type="button"
                onClick={buyNow}
                disabled={outOfStock}
                className="h-11 rounded-xl text-sm font-bold shadow-sm"
              >
                <Zap className="size-4" />
                এখনই কিনুন
              </Button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
              <InfoPill icon={Snowflake} label="বরফ-ঠান্ডা প্যাকিং" />
              <InfoPill icon={Truck} label="ঢাকায় দ্রুত ডেলিভারি" />
              <InfoPill icon={PackageCheck} label="১০০% ফ্রেশ গ্যারান্টি" />
              <InfoPill icon={Clock} label="অর্ডার কাট-অফ রাত ১০টা" />
            </div>
          </div>
        </div>

        {/* Description + related */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-navy">এই ইলিশ সম্পর্কে</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {product.name} সরাসরি {product.origin} ঘাট থেকে সংগ্রহ করা হয়।
              প্রতিটি পিসের ওজন প্রায় {formatWeight(product.weightG)} এবং দাম{" "}
              {formatTaka(product.pricePerKg)} প্রতি কেজি। অর্ডারের পর মাছ
              পরিষ্কার করে বরফ-ঠান্ডা প্যাকেজিংয়ে আপনার ঠিকানায় পাঠানো হয়।
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DetailRow label="উৎস" value={product.origin} />
              <DetailRow label="সাইজ" value={product.weightRange} />
              <DetailRow label="প্রতি পিস" value={product.pieceWeight} />
              <DetailRow label="দাম" value={`${formatTaka(product.pricePerKg)} / কেজি`} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-navy">ডেলিভারি তথ্য</h2>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              <li className="flex gap-2">
                <Truck className="mt-0.5 size-4 shrink-0 text-primary" />
                ঢাকার ভেতরে অর্ডারকৃত মাছ দ্রুত ডেলিভারি করা হয়।
              </li>
              <li className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                ৩,০০০ টাকার বেশি অর্ডারে ডেলিভারি ফ্রি।
              </li>
              <li className="flex gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                প্রতিদিন রাত ১০টা পর্যন্ত অর্ডার নেওয়া হয়।
              </li>
            </ul>
          </section>
        </div>

        {related.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-navy">এগুলোও দেখতে পারেন</h2>
              <Link
                href="/shop"
                className="text-sm font-semibold text-primary hover:underline"
              >
                সব ইলিশ
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/shop/${item.slug}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-art-blue">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-1 text-sm font-bold text-navy">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.origin} · {item.weightRange}
                    </p>
                    <p className="mt-2 text-sm font-extrabold text-primary">
                      {formatTaka(item.pricePerKg)}{" "}
                      <span className="text-xs font-medium text-slate-500">
                        / কেজি
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function InfoPill({
  icon: Icon,
  label,
}: {
  icon: typeof Truck;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 font-medium text-slate-600">
      <Icon className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
      {label}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-navy">{value}</p>
    </div>
  );
}
