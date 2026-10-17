"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Clock,
  Heart,
  MapPin,
  Scale,
  ShoppingCart,
  Star,
  Zap,
} from "lucide-react";

import { ProductImage } from "@/components/shared/product-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { IlishProduct } from "./ilish-showcase.types";

const toBanglaNumber = (value: number, options?: Intl.NumberFormatOptions) =>
  value.toLocaleString("bn-BD", options);
const formatTaka = (value: number) => `৳${toBanglaNumber(value)}`;

export interface IlishCardProps {
  product: IlishProduct;
  wished: boolean;
  /** true when the user prefers reduced motion */
  reduce?: boolean;
  onToggleWishlist: () => void;
  onAddToCart?: (product: IlishProduct) => void;
  onBuyNow?: (product: IlishProduct) => void;
}

/**
 * One fish card: image · price · weight · source · wishlist · add to cart · buy now.
 * Uses the parent's "hidden" / "show" motion variants, so a parent
 * <motion.div variants=… initial="hidden" whileInView="show"> staggers it in.
 */
export function IlishCard({
  product,
  wished,
  reduce = false,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
}: IlishCardProps) {
  const [addedToCart, setAddedToCart] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const handleAdd = () => {
    onAddToCart?.(product);
    setAddedToCart(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAddedToCart(false), 1800);
  };

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;
  const perKg = Math.round(product.price / product.weightKg);
  const stockLeft = product.stockLeft;
  const lowStock = stockLeft !== undefined && stockLeft <= 5;

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      }}
      whileHover={reduce ? undefined : { y: -6 }}
      className="group flex h-full flex-col overflow-hidden rounded-sm border shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-navy/10"
    >
      {/* ---------- image ---------- */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(min-width:1280px) 22vw, (min-width:768px) 45vw, 100vw"
          className="transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />

        {/* badges */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              {toBanglaNumber(discount)}% ছাড়
            </span>
          )}
          {product.badge && (
            <span className="rounded-full bg-navy/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur">
              {product.badge}
            </span>
          )}
        </div>

        {/* wishlist */}
        <motion.button
          type="button"
          onClick={onToggleWishlist}
          whileTap={{ scale: 0.85 }}
          aria-pressed={wished}
          aria-label={wished ? "উইশলিস্ট থেকে সরান" : "উইশলিস্টে যোগ করুন"}
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
        >
          <motion.span
            key={wished ? "on" : "off"}
            initial={reduce ? false : { scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="grid place-items-center"
          >
            <Heart
              aria-hidden
              className={cn(
                "size-[18px] transition-colors",
                wished ? "fill-rose-500 text-rose-500" : "text-slate-600",
              )}
            />
          </motion.span>
        </motion.button>

        {/* low-stock urgency */}
        {lowStock && (
          <span className="absolute bottom-3 left-3 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-amber-950 shadow-sm">
            মাত্র {toBanglaNumber(stockLeft ?? 0)}টি বাকি
          </span>
        )}
      </div>

      {/* ---------- body ---------- */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1.5">
          <h3 className="line-clamp-2 text-base font-bold leading-[1.4] text-navy">
            {product.name}
          </h3>
          <div
            className="flex items-center gap-1.5 text-xs text-slate-500"
            aria-label={`রেটিং ${toBanglaNumber(product.rating, { minimumFractionDigits: 1 })}`}
          >
            <Star
              aria-hidden
              className="size-3.5 fill-amber-400 text-amber-400"
            />
            <span className="font-semibold text-slate-700">
              {toBanglaNumber(product.rating, { minimumFractionDigits: 1 })}
            </span>
            <span>({toBanglaNumber(product.reviews)} রিভিউ)</span>
          </div>
        </div>

        {/* weight + source */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
            <Scale aria-hidden className="size-3.5 text-navy" />
            {toBanglaNumber(product.weightKg)} কেজি
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
            <MapPin aria-hidden className="size-3.5 text-navy" />
            {product.source}
          </span>
        </div>

        {/* price */}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-xl font-extrabold tabular-nums text-navy">
            {formatTaka(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm tabular-nums text-slate-400 line-through">
              {formatTaka(product.oldPrice)}
            </span>
          )}
          <span className="w-full text-xs text-slate-500">
            কেজি প্রতি প্রায় {formatTaka(perKg)}
          </span>
        </div>

        {product.delivery && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            <Clock aria-hidden className="size-3.5" />
            {product.delivery}
          </p>
        )}

        {/* actions – stacked in the narrow 3-col desktop layout, side by side elsewhere */}
        <div className="mt-auto grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            aria-live="polite"
            className={cn(
              "gap-1.5 border-navy/30 text-navy transition-colors hover:bg-navy/5",
              addedToCart && "border-emerald-500 bg-emerald-50 text-emerald-700",
            )}
          >
            {addedToCart ? (
              <>
                <Check aria-hidden className="size-4" />
                যোগ হয়েছে
              </>
            ) : (
              <>
                <ShoppingCart aria-hidden className="size-4" />
                কার্টে নিন
              </>
            )}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onBuyNow?.(product)}
            className="gap-1"
          >
            <Zap aria-hidden className="size-3" />
            এখনই কিনুন
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
