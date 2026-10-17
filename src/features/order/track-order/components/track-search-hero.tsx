"use client";

import type { FormEvent } from "react";
import { Loader2, Radar, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

type TrackSearchHeroProps = {
  value: string;
  loading: boolean;
  samples: string[];
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSample: (value: string) => void;
};

export function TrackSearchHero({
  value,
  loading,
  samples,
  onChange,
  onSubmit,
  onSample,
}: TrackSearchHeroProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-primary/40 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-sky-500/25 blur-[100px]"
      />
      {/* Blueprint grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:44px_44px]"
      />
      {/* Faint wave */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-white/5"
      >
        <path
          fill="currentColor"
          d="M0 120 C240 60 480 180 720 120 C960 60 1200 180 1440 120 L1440 200 L0 200 Z"
        />
      </svg>

      <div className="container-page relative py-14 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 font-bangla text-xs font-semibold text-white/90 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            লাইভ অর্ডার ট্র্যাকিং
          </span>

          <h1 className="mt-5 font-bangla text-3xl font-black leading-tight text-white sm:text-4xl md:text-[2.75rem]">
            আপনার ইলিশ কোথায় আছে,{" "}
            <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">
              জেনে নিন
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-bangla text-sm leading-relaxed text-white/70 sm:text-base">
            অর্ডার নম্বর লিখে মুহূর্তেই আপনার ডেলিভারির সর্বশেষ অবস্থা ও সম্পূর্ণ
            বিবরণ দেখুন।
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/10 p-2 shadow-2xl shadow-navy/40 backdrop-blur-xl sm:flex-row sm:items-center sm:rounded-full">
              <div className="flex flex-1 items-center gap-2.5 px-3.5">
                <Search
                  className="h-5 w-5 shrink-0 text-white/60"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={value}
                  onChange={(event) => onChange(event.target.value)}
                  aria-label="অর্ডার নম্বর"
                  placeholder="অর্ডার নম্বর লিখুন (যেমন IB-2026-1042)"
                  className="h-11 w-full bg-transparent font-bangla text-sm text-white outline-none placeholder:text-white/45 sm:h-12"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 gap-2 rounded-xl bg-white px-5 font-bangla text-sm font-bold text-navy hover:bg-white/90 sm:h-12 sm:rounded-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Radar className="h-4 w-4" aria-hidden="true" />
                )}
                ট্র্যাক করুন
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="font-bangla text-xs text-white/50">
                ডেমো নম্বর:
              </span>
              {samples.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => onSample(sample)}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] tracking-wide text-white/80 transition-colors hover:border-white/30 hover:bg-white/15 hover:text-white"
                >
                  {sample}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
