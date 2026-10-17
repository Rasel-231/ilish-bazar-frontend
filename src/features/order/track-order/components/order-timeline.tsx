"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  ClipboardCheck,
  PackageCheck,
  PackageOpen,
  Truck,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { OrderStatus } from "@/types/common.types";

type StepKey = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED";

type Step = {
  key: StepKey;
  label: string;
  description: string;
  icon: typeof Truck;
};

const STEPS: Step[] = [
  {
    key: "PENDING",
    label: "অর্ডার গৃহীত",
    description: "আপনার অর্ডার আমরা পেয়েছি",
    icon: ClipboardCheck,
  },
  {
    key: "CONFIRMED",
    label: "নিশ্চিত হয়েছে",
    description: "অর্ডার কনফার্ম করা হয়েছে",
    icon: BadgeCheck,
  },
  {
    key: "PROCESSING",
    label: "প্রস্তুত হচ্ছে",
    description: "মাছ পরিষ্কার ও প্যাক করা হচ্ছে",
    icon: PackageOpen,
  },
  {
    key: "SHIPPED",
    label: "পথে আছে",
    description: "ডেলিভারির জন্য পাঠানো হয়েছে",
    icon: Truck,
  },
  {
    key: "DELIVERED",
    label: "ডেলিভারড",
    description: "সফলভাবে পৌঁছে দেওয়া হয়েছে",
    icon: PackageCheck,
  },
];

/** 0–100 delivery progress for a given status (cancelled counts as 0). */
export function getOrderProgress(status: OrderStatus): number {
  const index = STEPS.findIndex((step) => step.key === status);

  if (index < 0) {
    return 0;
  }

  return Math.round((index / (STEPS.length - 1)) * 100);
}

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const reduce = useReducedMotion() ?? false;

  if (status === "CANCELLED") {
    return (
      <div className="flex items-start gap-3.5 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 sm:p-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
          <XCircle className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-bangla text-sm font-bold text-destructive">
            এই অর্ডারটি বাতিল করা হয়েছে
          </p>
          <p className="mt-1 font-bangla text-sm leading-relaxed text-muted-foreground">
            অর্ডারটি বাতিল হয়েছে। টাকা কেটে নেওয়া হয়ে থাকলে ৩–৫ কার্যদিবসের মধ্যে
            ফেরত দেওয়া হবে।
          </p>
        </div>
      </div>
    );
  }

  const index = STEPS.findIndex((step) => step.key === status);
  const activeIndex = index < 0 ? 0 : index;
  const progress = (activeIndex / (STEPS.length - 1)) * 100;

  return (
    <div>
      {/* Horizontal stepper — tablet & up */}
      <div className="hidden md:block">
        <div className="relative">
          <div className="absolute left-[10%] right-[10%] top-6 -translate-y-1/2">
            <div className="h-1.5 rounded-full bg-muted" />
            <motion.div
              className="absolute inset-y-0 left-0 h-1.5 rounded-full bg-gradient-to-r from-primary to-sky-500"
              initial={reduce ? false : { width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </div>

          <ol className="relative grid grid-cols-5">
            {STEPS.map((step, stepIndex) => {
              const current = stepIndex === activeIndex;
              const reached = stepIndex <= activeIndex;
              const Icon = step.icon;

              return (
                <li
                  key={step.key}
                  className="flex flex-col items-center px-2 text-center"
                >
                  <StepMarker
                    current={current}
                    reached={reached}
                    reduce={reduce}
                  >
                    <Icon className="relative h-5 w-5" aria-hidden="true" />
                  </StepMarker>
                  <p
                    className={cn(
                      "mt-3 font-bangla text-sm font-bold",
                      reached ? "text-navy" : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="mt-0.5 font-bangla text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Vertical stepper — mobile */}
      <ol className="md:hidden">
        {STEPS.map((step, stepIndex) => {
          const current = stepIndex === activeIndex;
          const reached = stepIndex <= activeIndex;
          const isLast = stepIndex === STEPS.length - 1;
          const Icon = step.icon;

          return (
            <li
              key={step.key}
              className={cn("relative flex gap-4", !isLast && "pb-6")}
            >
              {!isLast ? (
                <span
                  className={cn(
                    "absolute left-[23px] top-12 w-0.5",
                    "h-[calc(100%-2.5rem)]",
                    stepIndex < activeIndex ? "bg-primary" : "bg-border",
                  )}
                />
              ) : null}

              <StepMarker current={current} reached={reached} reduce={reduce}>
                <Icon className="relative h-5 w-5" aria-hidden="true" />
              </StepMarker>

              <div className="pt-1.5">
                <p
                  className={cn(
                    "font-bangla text-sm font-bold",
                    reached ? "text-navy" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 font-bangla text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StepMarker({
  reached,
  current,
  reduce,
  children,
}: {
  reached: boolean;
  current: boolean;
  reduce: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "relative grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 transition-colors duration-300",
        reached
          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
          : "border-border bg-card text-muted-foreground",
      )}
    >
      {current && !reduce ? (
        <motion.span
          className="absolute inset-0 rounded-full bg-primary/40"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </span>
  );
}
