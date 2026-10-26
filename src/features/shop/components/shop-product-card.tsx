"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Check,
  MapPin,
  Minus,
  Plus,
  Scale,
  ShoppingCart,
  Star,
  Zap,
} from "lucide-react";

import { ProductImage } from "@/components/shared/product-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { SOURCE_LABELS } from "../data/shop-products";
import type { FishArtVariant, ShopProduct } from "../types/shop.types";
import {
  formatRating,
  formatReviewCount,
  formatTaka,
  formatWeight,
  toBnNumber,
} from "../utils/shop.utils";

const ART_BACKGROUND: Record<FishArtVariant, string> = {
  blue: "bg-art-blue",
  yellow: "bg-art-yellow",
  green: "bg-art-green",
};

const CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export type ShopProductCardProps = {
  product: ShopProduct;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
};

export function ShopProductCard({
  product,
  quantity,
  onIncrement,
  onDecrement,
  onAddToCart,
  onBuyNow,
}: ShopProductCardProps) {
  const detailHref = `/shop/${product.slug}`;
  const outOfStock = !product.inStock;

  return (
    <motion.article
      variants={CARD_VARIANTS}
      whileHover={{
        y: -4,
        transition: { type: "spring", stiffness: 380, damping: 24 },
      }}
      className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[0_1px_2px_rgba(11,37,64,0.04),0_12px_28px_-18px_rgba(11,37,64,0.22)] transition-shadow duration-300 hover:shadow-[0_2px_4px_rgba(11,37,64,0.05),0_22px_44px_-22px_rgba(11,37,64,0.32)]"
    >
      <Link
        href={detailHref}
        aria-label={`${product.name} বিস্তারিত দেখুন`}
        className={cn(
          "relative mb-3 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl px-3",
          ART_BACKGROUND[product.art],
        )}
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 480px) 50vw, 100vw"
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          <span className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold text-navy shadow-sm backdrop-blur">
            {SOURCE_LABELS[product.source]}
          </span>
          {product.tag && (
            <span className="rounded-full bg-amber-400/95 px-2.5 py-1 text-[11px] font-bold text-amber-950 shadow-sm">
              {product.tag}
            </span>
          )}
        </div>

        <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-600/95 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
          <Check className="size-3" strokeWidth={3} aria-hidden="true" />
          {product.fresh ? "ফ্রেশ" : "স্টক সীমিত"}
        </span>

        {outOfStock && (
          <span className="absolute inset-0 grid place-items-center bg-navy/55 text-sm font-bold text-white backdrop-blur-[1px]">
            স্টক শেষ
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 px-1 pb-1">
        <div>
          <Link href={detailHref}>
            <h3 className="line-clamp-2 min-h-[2.75em] text-[15px] font-bold leading-snug text-navy transition-colors hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{product.origin}</span>
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
            <Star
              className="size-3.5 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
            <span
              aria-label={`রেটিং ${formatRating(product.rating)}`}
              className="tabular-nums"
            >
              {formatRating(product.rating)}
            </span>
            <span className="font-normal text-slate-400">
              ({formatReviewCount(product.reviews)})
            </span>
          </span>
          <span className="inline-flex items-center gap-1 text-slate-500">
            <Scale className="size-3.5 shrink-0" aria-hidden="true" />
            {formatWeight(product.weightG)}
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-xl font-extrabold tabular-nums text-navy">
            {formatTaka(product.pricePerKg)}
          </span>
          <span className="text-xs font-medium text-slate-500">/ কেজি</span>
        </div>

        <div className="mt-auto space-y-2 pt-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-0.5">
              <button
                type="button"
                onClick={onDecrement}
                disabled={quantity <= 1}
                aria-label={`${product.name} এর পরিমাণ কমান`}
                className="grid size-7 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-white hover:text-navy disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500"
              >
                <Minus className="size-3.5" aria-hidden="true" />
              </button>
              <span className="min-w-8 text-center text-sm font-bold tabular-nums text-navy">
                {toBnNumber(quantity)} পিস
              </span>
              <button
                type="button"
                onClick={onIncrement}
                aria-label={`${product.name} এর পরিমাণ বাড়ান`}
                className="grid size-7 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-white hover:text-navy"
              >
                <Plus className="size-3.5" aria-hidden="true" />
              </button>
            </div>

            <Link
              href={detailHref}
              className="shrink-0 text-xs font-semibold text-primary underline-offset-2 hover:underline"
            >
              বিস্তারিত
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onAddToCart}
              disabled={outOfStock}
              className="h-9 rounded-xl border-slate-200 text-[13px] font-bold text-navy transition-transform hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:translate-y-px"
            >
              <ShoppingCart className="size-4" aria-hidden="true" />
              কার্টে নিন
            </Button>

            <Button
              type="button"
              onClick={onBuyNow}
              disabled={outOfStock}
              className="h-9 rounded-xl text-[13px] font-bold shadow-sm transition-transform active:translate-y-px"
            >
              <Zap className="size-4" aria-hidden="true" />
              এখনই কিনুন
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
