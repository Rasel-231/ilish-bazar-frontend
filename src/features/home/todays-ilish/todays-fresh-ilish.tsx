"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Check,
  Fish,
  MapPin,
  Scale,
  ShoppingCart,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ilishData from "../../../../public/ilish.json";

export type IlishTone = "blue" | "sand" | "green";

export type FreshIlishItem = {
  slug: string;
  name: string;
  origin: string;
  weightRange: string;
  pieceWeight: string;
  rating: number;
  reviews: number;
  pricePerKg: number;
  highlight?: string;
  tag?: string;
  tone?: IlishTone;
  image?: string;
};

const toBanglaNumber = (value: number, digits = 0) =>
  new Intl.NumberFormat("bn-BD", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

function FishIllustration() {
  return (
    <svg
      viewBox="0 0 240 120"
      className="h-1/2 w-1/2 opacity-60"
      aria-hidden="true"
    >
      <path
        d="M205 60 L238 28 L232 60 L238 92 Z"
        fill="rgba(255,255,255,0.35)"
      />
      <path
        d="M10 62 C45 14 150 8 208 60 C150 112 45 108 10 62 Z"
        fill="rgba(255,255,255,0.18)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
      />
      <circle cx="42" cy="58" r="4" fill="white" />
    </svg>
  );
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

type FreshIlishCardProps = {
  product: FreshIlishItem;
  onAddToCart?: (product: FreshIlishItem) => void;
  onBuyNow?: (product: FreshIlishItem) => void;
};

function FreshIlishCard({
  product,
  onAddToCart,
  onBuyNow,
}: FreshIlishCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const href = `/ilish/${product.slug}`;
  const hasImage = product.image && !imageFailed;

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

  return (
    <motion.article
      variants={cardVariants}
      className="group relative flex flex-col overflow-hidden rounded-sm bg-card ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgba(11,37,64,0.35)] hover:ring-primary/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* ───────── Full-bleed image ───────── */}
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-navy">
        <Link
          href={href}
          aria-label={product.name}
          className="absolute inset-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
        >
          {hasImage ? (
            <Image
              src={product.image!}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={() => setImageFailed(true)}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy to-primary/70">
              <FishIllustration />
            </div>
          )}
        </Link>

        {/* Legibility gradients */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent"
          aria-hidden="true"
        />

        {/* Origin */}
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-navy shadow-sm backdrop-blur">
          <MapPin className="h-3 w-3 text-primary" aria-hidden="true" />
          {product.origin}
        </span>

        {/* Freshness */}
        {product.tag && (
          <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            {product.tag}
          </span>
        )}

        {/* Highlight */}
        {product.highlight && (
          <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-warning px-2.5 py-1 text-[11px] font-bold text-navy shadow-md">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {product.highlight}
          </span>
        )}

      </div>

      {/* ───────── Body ───────── */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1.5">
          <Link
            href={href}
            className="focus-visible:outline-none focus-visible:underline"
          >
            <h3 className="line-clamp-2 text-base font-bold leading-[1.4] text-navy transition-colors duration-200 group-hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <div
            className="flex items-center gap-1.5 text-xs text-slate-500"
            aria-label={`রেটিং ${toBanglaNumber(product.rating, 1)}, ${toBanglaNumber(product.reviews)} টি রিভিউ`}
          >
            <Star
              aria-hidden="true"
              className="size-3.5 fill-amber-400 text-amber-400"
            />
            <span className="font-semibold text-slate-700">
              {toBanglaNumber(product.rating, 1)}
            </span>
            <span>({toBanglaNumber(product.reviews)} রিভিউ)</span>
          </div>
        </div>

        {/* size + piece weight */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
            <Scale aria-hidden="true" className="size-3.5 text-navy" />
            {product.weightRange}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
            <Fish aria-hidden="true" className="size-3.5 text-navy" />
            {product.pieceWeight}
          </span>
        </div>

        {/* price */}
        <div className="flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-xl font-extrabold tabular-nums text-navy">
            ৳{toBanglaNumber(product.pricePerKg)}
          </span>
          <span className="text-xs text-slate-500">/কেজি</span>
        </div>

        {/* actions */}
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
                <Check aria-hidden="true" className="size-4" />
                যোগ হয়েছে
              </>
            ) : (
              <>
                <ShoppingCart aria-hidden="true" className="size-4" />
                কার্টে নিন
              </>
            )}
          </Button>
          {onBuyNow ? (
            <Button
              type="button"
              size="sm"
              onClick={() => onBuyNow(product)}
              className="gap-1"
            >
              <Zap aria-hidden="true" className="size-3" />
              এখনই কিনুন
            </Button>
          ) : (
            <Button
              render={<Link href={href} />}
              nativeButton={false}
              size="sm"
              className="gap-1"
            >
              <Zap aria-hidden="true" className="size-3" />
              এখনই কিনুন
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

type IlishJson = (typeof ilishData)[number];

const toFreshIlishItem = (entry: IlishJson): FreshIlishItem => ({
  slug: entry.slug,
  name: entry.name,
  origin: entry.origin,
  weightRange: entry.weightRange,
  pieceWeight: entry.pieceWeight,
  rating: entry.rating,
  reviews: entry.reviewCount,
  pricePerKg: entry.pricePerKg,
  highlight: entry.badge ?? undefined,
  tag: entry.fresh ? "ফ্রেশ" : undefined,
  tone: entry.tone as IlishTone,
  image: entry.images[0],
});

const DEFAULT_PRODUCTS: FreshIlishItem[] = ilishData
  .filter((item) => item.featured && item.inStock)
  .map(toFreshIlishItem);

const PREVIEW_COUNT = 4;

type TodaysFreshIlishProps = {
  products?: FreshIlishItem[];
  eyebrow?: string;
  title?: string;
  onAddToCart?: (product: FreshIlishItem) => void;
  onBuyNow?: (product: FreshIlishItem) => void;
};

export function TodaysFreshIlish({
  products = DEFAULT_PRODUCTS,
  eyebrow = "আজকের সেরা",
  title = "আজকের তাজা ইলিশ",
  onAddToCart,
  onBuyNow,
}: TodaysFreshIlishProps) {
  const reduceMotion = useReducedMotion();
  const [showAll, setShowAll] = useState(false);

  const visibleProducts = showAll
    ? products
    : products.slice(0, PREVIEW_COUNT);
  const canToggle = products.length > PREVIEW_COUNT;

  return (
    <section className="py-12 lg:py-16">
      <div className="container-page">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {eyebrow}
          </span>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-navy sm:text-3xl lg:text-4xl">
            {title}
          </h2>
        </div>

        {canToggle && (
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            aria-expanded={showAll}
            className="group inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-navy focus-visible:outline-none focus-visible:underline"
          >
            {showAll ? "কম দেখুন" : "সবগুলো দেখুন"}
            <span className="grid h-7 w-7 place-items-center rounded-full bg-accent transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowRight
                className={
                  showAll
                    ? "h-4 w-4 -rotate-90 transition-transform group-hover:-translate-y-0.5"
                    : "h-4 w-4 transition-transform group-hover:translate-x-0.5"
                }
                aria-hidden="true"
              />
            </span>
          </button>
        )}
      </div>

      <motion.div
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        variants={reduceMotion ? undefined : gridVariants}
        initial={reduceMotion ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {visibleProducts.map((product) => (
          <FreshIlishCard
            key={product.slug}
            product={product}
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
          />
        ))}
      </motion.div>
      </div>
    </section>
  );
}
