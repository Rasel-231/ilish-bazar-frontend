"use client";

import { Check, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  SIZE_OPTIONS,
  SOURCE_OPTIONS,
  toBnNumber,
} from "../utils/shop.utils";
import type { ShopSizeKey, ShopSourceKey } from "../types/shop.types";

type FilterRowProps = {
  id: string;
  label: string;
  count: number;
  checked: boolean;
  onToggle: () => void;
};

function FilterRow({ id, label, count, checked, onToggle }: FilterRowProps) {
  return (
    <label
      htmlFor={id}
      className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="grid size-[18px] shrink-0 place-items-center rounded-[6px] border border-slate-300 bg-white text-transparent transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 peer-focus-visible:ring-offset-1"
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
      <span
        className={cn(
          "text-sm text-slate-600 transition-colors group-hover:text-navy",
          checked && "font-semibold text-navy",
        )}
      >
        {label}
      </span>
      <span className="ml-auto text-xs tabular-nums text-slate-400">
        {toBnNumber(count)}
      </span>
    </label>
  );
}

export type ShopFilterPanelProps = {
  search: string;
  onSearchChange: (value: string) => void;
  selectedSources: ShopSourceKey[];
  onToggleSource: (value: ShopSourceKey) => void;
  selectedSizes: ShopSizeKey[];
  onToggleSize: (value: ShopSizeKey) => void;
  sourceCounts: Record<ShopSourceKey, number>;
  sizeCounts: Record<ShopSizeKey, number>;
  activeCount: number;
  onClear: () => void;
  idPrefix?: string;
  className?: string;
};

export function ShopFilterPanel({
  search,
  onSearchChange,
  selectedSources,
  onToggleSource,
  selectedSizes,
  onToggleSize,
  sourceCounts,
  sizeCounts,
  activeCount,
  onClear,
  idPrefix = "shop",
  className,
}: ShopFilterPanelProps) {
  const hasActiveFilters = activeCount > 0 || search.trim().length > 0;

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(11,37,64,0.04),0_10px_30px_-18px_rgba(11,37,64,0.25)]",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <SlidersHorizontal
          className="size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        <h2 className="text-sm font-bold text-navy">ফিল্টার</h2>
        {activeCount > 0 && (
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold tabular-nums text-primary">
            {toBnNumber(activeCount)}
          </span>
        )}
      </div>

      <div className="relative mt-3">
        <label htmlFor={`${idPrefix}-search`} className="sr-only">
          মাছ খুঁজুন
        </label>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <Input
          id={`${idPrefix}-search`}
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="যেমন: মাওয়া, বড় সাইজ"
          autoComplete="off"
          className="h-9 rounded-xl border-slate-200 bg-slate-50/70 pl-9 pr-8 text-sm placeholder:text-xs placeholder:text-slate-400 focus-visible:border-primary/50 focus-visible:bg-white"
        />
        {search.length > 0 && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="সার্চ মুছে ফেলুন"
            className="absolute right-1.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-navy"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      <fieldset className="mt-3.5 min-w-0 border-t border-slate-100 pt-3">
        <legend className="px-2 text-xs font-bold tracking-wide text-slate-500">
          উৎস
        </legend>
        <div className="mt-0.5 space-y-0.5">
          {SOURCE_OPTIONS.map((option) => (
            <FilterRow
              key={option.value}
              id={`${idPrefix}-source-${option.value}`}
              label={option.label}
              count={sourceCounts[option.value]}
              checked={selectedSources.includes(option.value)}
              onToggle={() => onToggleSource(option.value)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-3 min-w-0 border-t border-slate-100 pt-3">
        <legend className="px-2 text-xs font-bold tracking-wide text-slate-500">
          সাইজ
        </legend>
        <div className="mt-0.5 space-y-0.5">
          {SIZE_OPTIONS.map((option) => (
            <FilterRow
              key={option.value}
              id={`${idPrefix}-size-${option.value}`}
              label={option.label}
              count={sizeCounts[option.value]}
              checked={selectedSizes.includes(option.value)}
              onToggle={() => onToggleSize(option.value)}
            />
          ))}
        </div>
      </fieldset>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          onClick={onClear}
          className="mt-2.5 h-9 w-full rounded-xl text-sm font-semibold text-primary hover:bg-primary/5"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          সব ফিল্টার মুছে ফেলুন
        </Button>
      )}
    </div>
  );
}
