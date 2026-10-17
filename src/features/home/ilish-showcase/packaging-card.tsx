"use client";

import { motion } from "framer-motion";
import { Snowflake } from "lucide-react";

import { ProductImage } from "@/components/shared/product-image";

import type { PackagingItem } from "./ilish-showcase.types";

export interface PackagingCardProps {
  item: PackagingItem;
  /** true when the user prefers reduced motion */
  reduce?: boolean;
}

/**
 * One package card: photo with a dark gradient, badge, title and (on wide cards) description.
 * Uses the parent's "hidden" / "show" motion variants for the stagger-in.
 */
export function PackagingCard({ item, reduce = false }: PackagingCardProps) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: "easeOut" },
        },
      }}
      className="group relative isolate h-[260px] overflow-hidden rounded-sm bg-navy text-white shadow-sm"
    >
      <ProductImage
        src={item.image}
        alt={item.title}
        sizes="(min-width:1024px) 15vw, (min-width:640px) 45vw, 50vw"
        className="transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/5" />

      <div className="relative flex h-full min-h-[260px] flex-col justify-end gap-1.5 p-3 sm:p-4">
        <span className="inline-flex w-fit items-center gap-1 rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md sm:text-[11px]">
          <Snowflake aria-hidden className="size-3" />
          প্রিমিয়াম
        </span>
        <h3 className="text-sm font-bold leading-[1.4] sm:text-base">
          {item.title}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-white/80 sm:text-sm">
          {item.description}
        </p>
      </div>
    </motion.article>
  );
}
