"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import {
  DEFAULT_ILISH_PRODUCTS,
  DEFAULT_PACKAGING,
} from "./ilish-showcase.data";
import type { IlishShowcaseProps } from "./ilish-showcase.types";
import { IlishCard } from "./ilish-card";
import { PackagingCard } from "./packaging-card";

/** The sketch shows exactly one row of 3 fish cards on desktop. */
const VISIBLE_PRODUCTS = 3;
/** The sketch shows 2 package cards side by side. */
const VISIBLE_PACKAGING = 2;

export function IlishShowcase({
  products = DEFAULT_ILISH_PRODUCTS,
  packaging = DEFAULT_PACKAGING,
  viewAllHref = "/products",
  onAddToCart,
  onBuyNow,
  onWishlistChange,
}: IlishShowcaseProps) {
  const reduce = useReducedMotion() ?? false;
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const toggleWishlist = (id: string) => {
    const wished = !wishlist.has(id);
    setWishlist((prev) => {
      const next = new Set(prev);
      if (wished) next.add(id);
      else next.delete(id);
      return next;
    });
    onWishlistChange?.(id, wished);
  };

  const staggerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
  };

  return (
    <section aria-labelledby="ilish-heading" className="py-2">
      <div className="container-page">
        {/* ---------- heading: eyebrow · 2-line title · 1-line subtitle ---------- */}
        <motion.header
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-8 sm:mb-10"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-navy/5 px-3.5 py-1.5 text-xs font-bold tracking-wide text-navy sm:text-sm">
            <span aria-hidden className="size-1.5 rounded-full bg-sky-500" />
            ইলিশ বাজার · সরাসরি ঘাট থেকে
          </span>
          <h2
            id="ilish-heading"
            className="mt-4 text-2xl font-extrabold leading-[1.35] text-navy sm:text-3xl lg:text-4xl"
          >
            পদ্মা-মেঘনার{" "}
            <span className="bg-gradient-to-r from-sky-700 to-cyan-500 bg-clip-text text-transparent">
              তাজা ইলিশ,
            </span>
            <br />
            সরাসরি আপনার দরজায়
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            জেলেদের কাছ থেকে সংগ্রহ করা, বাছাই করা ও বরফ-ঠান্ডা প্যাকেজিংয়ে
            পৌঁছে দেওয়া হয় — যেন স্বাদে থাকে নদীর সেই আসল ঘ্রাণ।
          </p>
        </motion.header>

        {/* ---------- OUTER BOX (100%) → two panels: 70% · 30% ---------- */}
        <div>
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            {/* ===== LEFT PANEL (70%): title + See All, then 3 fish cards ===== */}
            <div className="rounded-sm lg:w-[calc(65%-8px)]">
              <div className="mb-3 flex min-h-10 items-center justify-between gap-3">
                <h3 className="text-base font-extrabold text-navy sm:text-lg">
                  সেরা ইলিশ-
                </h3>
                <Link
                  href={viewAllHref}
                  className="group inline-flex w-fit items-center gap-2 rounded-full border border-navy/20 px-4 py-2 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
                >
                  সব দেখুন
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>

              {/* 1 col mobile · 2 tablet · 3 desktop */}
              <motion.div
                variants={staggerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.08 }}
                className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3"
              >
                {products.slice(0, VISIBLE_PRODUCTS).map((product) => (
                  <IlishCard
                    key={product.id}
                    product={product}
                    wished={wishlist.has(product.id)}
                    reduce={reduce}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                    onAddToCart={onAddToCart}
                    onBuyNow={onBuyNow}
                  />
                ))}
              </motion.div>
            </div>

            {/* ===== RIGHT PANEL (30%): title, then 2 package cards side by side ===== */}
            <div className="flex flex-col rounded-sm lg:w-[calc(35%-8px)]">
              <div className="mb-3 flex min-h-10 items-center">
                <h3 className="text-base font-extrabold text-navy sm:text-lg">
                  প্যাকেজিং-
                </h3>
              </div>

              <motion.aside
                aria-label="প্যাকেজিং"
                variants={staggerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.08 }}
                className="grid flex-1 grid-cols-2 gap-3"
              >
                {packaging.slice(0, VISIBLE_PACKAGING).map((item) => (
                  <PackagingCard key={item.id} item={item} reduce={reduce} />
                ))}
              </motion.aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
