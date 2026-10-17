"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import {
  ChevronDown,
  RotateCcw,
  ShoppingBasket,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";

import { EmptyState } from "@/components/feedback/empty-state";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";

import { SHOP_PRODUCTS, SOURCE_LABELS } from "../data/shop-products";
import type {
  ShopProduct,
  ShopSizeKey,
  ShopSortKey,
  ShopSourceKey,
} from "../types/shop.types";
import {
  SORT_OPTIONS,
  formatWeight,
  sizeKeyOf,
  toBnNumber,
} from "../utils/shop.utils";
import { ShopFilterPanel } from "./shop-filter-panel";
import { ShopProductCard } from "./shop-product-card";

const EMPTY_SOURCE_COUNTS: Record<ShopSourceKey, number> = {
  sea: 0,
  farm: 0,
  barishal: 0,
};

const EMPTY_SIZE_COUNTS: Record<ShopSizeKey, number> = {
  mid: 0,
  large: 0,
  xl: 0,
};

const GRID_VARIANTS = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

export default function Shopingpage() {
  const [search, setSearch] = useState("");
  const [sources, setSources] = useState<ShopSourceKey[]>([]);
  const [sizes, setSizes] = useState<ShopSizeKey[]>([]);
  const [sort, setSort] = useState<ShopSortKey>("featured");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [cartCount, setCartCount] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeCount = sources.length + sizes.length;

  const searchedProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return SHOP_PRODUCTS;

    return SHOP_PRODUCTS.filter((product) =>
      `${product.name} ${product.origin} ${SOURCE_LABELS[product.source]} ${formatWeight(product.weightG)}`
        .toLowerCase()
        .includes(term),
    );
  }, [search]);

  const sourceCounts = useMemo(() => {
    const counts = { ...EMPTY_SOURCE_COUNTS };
    for (const product of searchedProducts) {
      if (sizes.length > 0 && !sizes.includes(sizeKeyOf(product.weightG))) continue;
      counts[product.source] += 1;
    }
    return counts;
  }, [searchedProducts, sizes]);

  const sizeCounts = useMemo(() => {
    const counts = { ...EMPTY_SIZE_COUNTS };
    for (const product of searchedProducts) {
      if (sources.length > 0 && !sources.includes(product.source)) continue;
      counts[sizeKeyOf(product.weightG)] += 1;
    }
    return counts;
  }, [searchedProducts, sources]);

  const visibleProducts = useMemo(() => {
    const filtered = searchedProducts.filter((product) => {
      const matchesSource =
        sources.length === 0 || sources.includes(product.source);
      const matchesSize =
        sizes.length === 0 || sizes.includes(sizeKeyOf(product.weightG));
      return matchesSource && matchesSize;
    });

    const sorted = [...filtered];
    if (sort === "price-asc") {
      sorted.sort((a, b) => a.pricePerKg - b.pricePerKg);
    } else if (sort === "price-desc") {
      sorted.sort((a, b) => b.pricePerKg - a.pricePerKg);
    } else {
      sorted.sort((a, b) => b.popularity - a.popularity);
    }
    return sorted;
  }, [searchedProducts, sources, sizes, sort]);

  const toggleSource = useCallback((value: ShopSourceKey) => {
    setSources((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  }, []);

  const toggleSize = useCallback((value: ShopSizeKey) => {
    setSizes((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSources([]);
    setSizes([]);
  }, []);

  const changeQuantity = useCallback((productId: string, delta: number) => {
    setQuantities((prev) => {
      const next = Math.max(1, (prev[productId] ?? 1) + delta);
      return { ...prev, [productId]: next };
    });
  }, []);

  const addToCart = useCallback(
    (product: ShopProduct) => {
      const quantity = quantities[product.id] ?? 1;
      setCartCount((count) => count + quantity);
      toast.success(
        quantity > 1
          ? `${toBnNumber(quantity)}টি ${product.name} কার্টে যোগ হয়েছে`
          : `${product.name} কার্টে যোগ হয়েছে`,
      );
    },
    [quantities],
  );

  const showCartSummary = useCallback(() => {
    if (cartCount > 0) {
      toast.info(`আপনার কার্টে মোট ${toBnNumber(cartCount)}টি পণ্য আছে`);
    } else {
      toast.info("আপনার কার্ট এখনো খালি।");
    }
  }, [cartCount]);

  const filterPanel = (idPrefix: string, className?: string) => (
    <ShopFilterPanel
      idPrefix={idPrefix}
      className={className}
      search={search}
      onSearchChange={setSearch}
      selectedSources={sources}
      onToggleSource={toggleSource}
      selectedSizes={sizes}
      onToggleSize={toggleSize}
      sourceCounts={sourceCounts}
      sizeCounts={sizeCounts}
      activeCount={activeCount}
      onClear={clearFilters}
    />
  );

  const gridKey = `${sort}:${visibleProducts.map((product) => product.id).join("-")}`;

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-canvas">
        <div className="container-page pb-16 pt-5 sm:pt-6">
          <header className="flex items-center justify-between gap-4">
            <Breadcrumb items={[{ label: "মাছ ইলিশ" }]} />

            <button
              type="button"
              onClick={showCartSummary}
              aria-label={
                cartCount > 0
                  ? `কার্ট দেখুন, মোট ${toBnNumber(cartCount)}টি পণ্য`
                  : "কার্ট দেখুন, কার্ট খালি"
              }
              className="relative grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-navy shadow-sm transition-colors hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <ShoppingBasket className="size-5" aria-hidden="true" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 480, damping: 18 }}
                  className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold leading-5 text-white shadow"
                >
                  {toBnNumber(cartCount)}
                </motion.span>
              )}
            </button>
          </header>

          <div className="mt-6 max-w-2xl sm:mt-7">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/70 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
              <Sparkles className="size-3.5" aria-hidden="true" />
              আজকের তাজা সংগ্রহ
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              তাজা ইলিশ
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
              ঘাট থেকে সরাসরি, ১০০% ফ্রেশ ডেলিভারি।
            </p>
          </div>

          <div className="mt-7 grid items-start gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <aside className="hidden self-start lg:sticky lg:top-24 lg:block">
              {filterPanel("shop")}
            </aside>

            <section className="min-w-0 space-y-4" aria-label="ইলিশের তালিকা">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-3.5 py-2.5 shadow-[0_1px_2px_rgba(11,37,64,0.03)] backdrop-blur">
                <p
                  role="status"
                  aria-live="polite"
                  className="text-sm text-slate-600"
                >
                  মোট{" "}
                  <span className="font-bold text-navy">
                    {toBnNumber(visibleProducts.length)}
                  </span>
                  টি ইলিশ পাওয়া গেছে
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setFiltersOpen((open) => !open)}
                    aria-expanded={filtersOpen}
                    aria-controls="shop-mobile-filters"
                    className="h-9 rounded-xl border-slate-200 font-semibold text-navy hover:border-primary/40 hover:text-primary lg:hidden"
                  >
                    <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                    ফিল্টার
                    {activeCount > 0 && (
                      <span className="ml-0.5 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold leading-5 text-white">
                        {toBnNumber(activeCount)}
                      </span>
                    )}
                  </Button>

                  <div className="relative">
                    <label htmlFor="shop-sort" className="sr-only">
                      ইলিশ সাজান
                    </label>
                    <select
                      id="shop-sort"
                      value={sort}
                      onChange={(event) =>
                        setSort(event.target.value as ShopSortKey)
                      }
                      className="h-9 cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-9 text-[13px] font-semibold text-navy shadow-sm transition-colors hover:border-slate-300 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              <div id="shop-mobile-filters" className="lg:hidden">
                {filtersOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    {filterPanel("shop-mobile")}
                  </motion.div>
                )}
              </div>

              {visibleProducts.length === 0 ? (
                <EmptyState
                  title="কোনো মাছ পাওয়া যায়নি।"
                  description="অন্য কোনো নাম দিয়ে খুঁজুন, নয়তো ফিল্টারগুলো একটু কমিয়ে দেখুন।"
                  action={
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearFilters}
                      className="h-9 rounded-xl border-slate-200 font-semibold text-primary hover:border-primary/40 hover:bg-primary/5"
                    >
                      <RotateCcw className="size-3.5" aria-hidden="true" />
                      সব ফিল্টার মুছে ফেলুন
                    </Button>
                  }
                />
              ) : (
                <motion.div
                  key={gridKey}
                  initial="hidden"
                  animate="show"
                  variants={GRID_VARIANTS}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {visibleProducts.map((product) => (
                    <ShopProductCard
                      key={product.id}
                      product={product}
                      quantity={quantities[product.id] ?? 1}
                      onIncrement={() => changeQuantity(product.id, 1)}
                      onDecrement={() => changeQuantity(product.id, -1)}
                      onAddToCart={() => addToCart(product)}
                    />
                  ))}
                </motion.div>
              )}
            </section>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
