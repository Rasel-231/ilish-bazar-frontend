"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CircleHelp,
  ClipboardList,
  PackageSearch,
  Radar,
  Route,
  SearchX,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { BreadcrumbBar } from "@/components/shared/auto-breadcrumb";
import { Button } from "@/components/ui/button";
import type { Order } from "@/features/order/types/order.types";
import { ROUTES } from "@/lib/navigation";

import { TrackResult } from "./components/track-result";
import { TrackSearchHero } from "./components/track-search-hero";

type OrdersResponse = {
  success: boolean;
  message: string;
  data: Order[];
};

type TrackPhase = "idle" | "loading" | "found" | "notfound" | "error";

const SAMPLE_NUMBERS = ["IB-2026-1042", "IB-2026-1039", "IB-2026-1035"];

const HOW_IT_WORKS = [
  {
    icon: ClipboardList,
    title: "অর্ডার নম্বর দিন",
    text: "কনফার্মেশন মেসেজে পাওয়া IB- দিয়ে শুরু হওয়া অর্ডার নম্বরটি লিখুন।",
  },
  {
    icon: Radar,
    title: "লাইভ অবস্থা দেখুন",
    text: "অর্ডার প্রস্তুতি থেকে ডেলিভারি পর্যন্ত প্রতিটি ধাপের আপডেট দেখুন।",
  },
  {
    icon: Truck,
    title: "ডেলিভারি নিশ্চিত",
    text: "সম্ভাব্য ডেলিভারির সময় ও সম্পূর্ণ অর্ডার বিবরণ একসাথে পান।",
  },
];

const normalize = (value: string) => value.replace(/\s+/g, "").toUpperCase();

export function TrackOrderPage() {
  const reduce = useReducedMotion() ?? false;
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [phase, setPhase] = useState<TrackPhase>("idle");
  const [lastTerm, setLastTerm] = useState("");

  useEffect(() => {
    if (phase === "found" && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    }
  }, [phase, reduce]);

  const runSearch = useCallback(async (raw: string) => {
    const term = raw.trim();

    if (!term) {
      return;
    }

    setLastTerm(term);
    setQuery(term);
    setPhase("loading");
    setOrder(null);

    try {
      const response = await fetch("/orders.json");

      if (!response.ok) {
        throw new Error("failed");
      }

      const result = (await response.json()) as OrdersResponse;
      const list = Array.isArray(result.data) ? result.data : [];
      const match = list.find(
        (item) =>
          normalize(item.orderNumber) === normalize(term) ||
          normalize(item.id) === normalize(term),
      );

      if (match) {
        setOrder(match);
        setPhase("found");
      } else {
        setPhase("notfound");
      }
    } catch {
      setPhase("error");
    }
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <BreadcrumbBar />

      <TrackSearchHero
        value={query}
        loading={phase === "loading"}
        samples={SAMPLE_NUMBERS}
        onChange={setQuery}
        onSubmit={() => runSearch(query)}
        onSample={(sample) => runSearch(sample)}
      />

      <div ref={resultsRef} className="container-page scroll-mt-24 py-10 sm:py-14">
        <AnimatePresence mode="wait">
          {phase === "found" && order ? (
            <motion.div
              key={`found-${order.id}`}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
            >
              <TrackResult order={order} />
            </motion.div>
          ) : phase === "loading" ? (
            <motion.div
              key="loading"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
            >
              <TrackSkeleton />
            </motion.div>
          ) : phase === "notfound" ? (
            <motion.div
              key="notfound"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
            >
              <NotFoundState
                term={lastTerm}
                onRetry={() => setQuery("")}
                onSample={(sample) => runSearch(sample)}
              />
            </motion.div>
          ) : phase === "error" ? (
            <motion.div
              key="error"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
            >
              <ErrorState onRetry={() => runSearch(lastTerm)} />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
            >
              <HowItWorks />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <div>
      <div className="text-center">
        <h2 className="font-bangla text-2xl font-black tracking-tight text-navy sm:text-3xl">
          মাত্র ৩ ধাপে ট্র্যাক করুন
        </h2>
        <p className="mx-auto mt-2 max-w-lg font-bangla text-sm text-muted-foreground sm:text-base">
          আপনার অর্ডার কোথায় আছে সেটি জানতে কোনো অ্যাকাউন্ট লাগবে না — শুধু অর্ডার
          নম্বরটি দিন।
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {HOW_IT_WORKS.map((step, index) => (
          <div
            key={step.title}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm shadow-navy/5 transition-shadow hover:shadow-md hover:shadow-navy/10"
          >
            <span className="absolute -right-4 -top-4 font-mono text-6xl font-black text-navy/5">
              {index + 1}
            </span>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
              <step.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-bangla text-base font-bold text-navy">
              {step.title}
            </h3>
            <p className="mt-1.5 font-bangla text-sm leading-relaxed text-muted-foreground">
              {step.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-accent to-card p-5 sm:flex-row sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-bangla text-sm font-bold text-navy">
              নিরাপদ ও নিশ্চিন্ত ডেলিভারি
            </p>
            <p className="mt-0.5 font-bangla text-sm text-muted-foreground">
              প্রতিটি অর্ডার যাচাই করে, ঠিকভাবে প্যাক করে পাঠানো হয়।
            </p>
          </div>
        </div>
        <Button
          render={<Link href={ROUTES.myOrders} />}
          nativeButton={false}
          variant="outline"
          className="shrink-0 gap-2 rounded-xl bg-card font-bangla"
        >
          <Route />
          আমার অর্ডার দেখুন
        </Button>
      </div>
    </div>
  );
}

function NotFoundState({
  term,
  onRetry,
  onSample,
}: {
  term: string;
  onRetry: () => void;
  onSample: (value: string) => void;
}) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="flex flex-col items-center rounded-3xl border border-border bg-card px-6 py-12 text-center shadow-sm shadow-navy/5">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <SearchX className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 font-bangla text-xl font-black text-navy">
          অর্ডারটি খুঁজে পাওয়া যায়নি
        </h2>
        <p className="mt-2 max-w-sm font-bangla text-sm leading-relaxed text-muted-foreground">
          {term ? (
            <>
              <span className="font-mono font-semibold text-navy">{term}</span>{" "}
              নম্বরে কোনো অর্ডার পাওয়া যায়নি। নম্বরটি আবার যাচাই করে দেখুন।
            </>
          ) : (
            "নম্বরটি আবার যাচাই করে দেখুন।"
          )}
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            onClick={onRetry}
            className="gap-2 rounded-xl bg-primary font-bangla hover:bg-primary/90"
          >
            <Radar />
            আবার ট্র্যাক করুন
          </Button>
          <Button
            render={<Link href={ROUTES.myOrders} />}
            nativeButton={false}
            variant="outline"
            className="gap-2 rounded-xl font-bangla"
          >
            <ClipboardList />
            আমার অর্ডার
          </Button>
        </div>

        <p className="mt-6 flex items-center gap-1.5 font-bangla text-xs text-muted-foreground">
          <CircleHelp className="h-3.5 w-3.5" aria-hidden="true" />
          ডেমো নম্বর:
          {SAMPLE_NUMBERS.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => onSample(sample)}
              className="font-mono font-semibold text-primary hover:underline"
            >
              {sample}
            </button>
          ))}
        </p>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center rounded-3xl border border-border bg-card px-6 py-12 text-center shadow-sm shadow-navy/5">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-warning/10 text-warning">
        <PackageSearch className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 font-bangla text-xl font-black text-navy">
        কিছু একটা ভুল হয়েছে
      </h2>
      <p className="mt-2 max-w-sm font-bangla text-sm leading-relaxed text-muted-foreground">
        আপনার অর্ডার লোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।
      </p>
      <Button
        type="button"
        onClick={onRetry}
        className="mt-6 gap-2 rounded-xl bg-primary font-bangla hover:bg-primary/90"
      >
        <Radar />
        আবার চেষ্টা করুন
      </Button>
    </div>
  );
}

function TrackSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-52 animate-pulse rounded-3xl bg-secondary" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="h-56 animate-pulse rounded-2xl bg-secondary" />
          <div className="h-64 animate-pulse rounded-2xl bg-secondary" />
        </div>
        <div className="space-y-6">
          <div className="h-56 animate-pulse rounded-2xl bg-secondary" />
          <div className="h-40 animate-pulse rounded-2xl bg-secondary" />
        </div>
      </div>
    </div>
  );
}
