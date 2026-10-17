"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  Check,
  ChevronDown,
  Fish,
  MapPin,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type OrderStep = {
  stepNumber: string;
  title: string;
  description: string;
  icon: LucideIcon;
  details: string[];
};

const STEPS: OrderStep[] = [
  {
    stepNumber: "১",
    title: "ইলিশ বাছুন",
    description: "সাইজ, উৎস ও দাম দেখে পছন্দ করুন।",
    icon: Fish,
    details: [
      "৭০০ গ্রাম থেকে ১.৫ কেজি পর্যন্ত সাইজ",
      "পদ্মা, মেঘনা ও চাঁদপুরের উৎস দেখে নিন",
      "প্রতি কেজির দাম আগেই দেখা যায়",
    ],
  },
  {
    stepNumber: "২",
    title: "অর্ডার ও ঠিকানা",
    description: "পরিমাণ ও ডেলিভারির তথ্য দিন।",
    icon: MapPin,
    details: [
      "কাটিংয়ের ধরন বেছে নিন",
      "ঠিকানা ও পছন্দের সময় দিন",
      "অর্ডার কনফার্মেশন এসএমএসে পাবেন",
    ],
  },
  {
    stepNumber: "৩",
    title: "পেমেন্ট",
    description: "ক্যাশ অন ডেলিভারি, বিকাশ বা নগদ।",
    icon: Wallet,
    details: [
      "মাছ হাতে পেয়ে টাকা দিতে পারবেন",
      "বিকাশ ও নগদে অগ্রিম পেমেন্ট",
      "ওজন মেপে দেওয়ার পর চূড়ান্ত বিল",
    ],
  },
  {
    stepNumber: "৪",
    title: "লাইভ ট্র্যাকিং",
    description: "কেনা থেকে ডেলিভারি, প্রতিটি ধাপ দেখুন।",
    icon: Truck,
    details: [
      "কাটিং ও প্যাকিং শেষ হলে নোটিফিকেশন",
      "রাইডার রওনা দিলে লাইভ লোকেশন",
      "পৌঁছানোর আনুমানিক সময় জানতে পারবেন",
    ],
  },
];

type HowToOrderProps = {
  ctaHref?: string;
};

export function HowToOrder({ ctaHref = "/products" }: HowToOrderProps) {
  const reduce = useReducedMotion();
  const [openStep, setOpenStep] = useState<number | null>(null);
  const [reached, setReached] = useState(reduce ? STEPS.length : 0);
  const listRef = useRef<HTMLOListElement>(null);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.85", "end 0.6"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });
  const fill = reduce ? 1 : smooth;

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reduce) return;
    const reachedCount = STEPS.filter(
      (_, i) => progress >= i / (STEPS.length - 1) - 0.03,
    ).length;
    setReached(reachedCount);
  });

  return (
    <section className="pt-8">
      <div className="container-page">
        <div className="mb-2 text-center">
          <p className="text-xs font-semibold text-teal-700">সহজ ধাপ</p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            কীভাবে অর্ডার করবেন
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            চার ধাপেই ঘরে বসে তাজা ইলিশ। যেকোনো ধাপে ট্যাপ করে বিস্তারিত দেখুন।
          </p>
        </div>

        <ol ref={listRef} className="relative grid gap-5 md:grid-cols-4">
          {/* Progress line: vertical (mobile) */}
          <span
            aria-hidden
            className="absolute bottom-6 left-5 top-6 w-0.5 -translate-x-1/2 rounded bg-slate-200 md:hidden"
          />
          <motion.span
            aria-hidden
            style={{ scaleY: fill }}
            className="absolute bottom-6 left-5 top-6 w-0.5 origin-top -translate-x-1/2 rounded bg-teal-700 md:hidden"
          />
          {/* Progress line: horizontal (desktop) */}
          <span
            aria-hidden
            className="absolute left-[calc((100%_-_3.75rem)/8)] right-[calc((100%_-_3.75rem)/8)] top-5 hidden h-0.5 -translate-y-1/2 rounded bg-slate-200 md:block"
          />
          <motion.span
            aria-hidden
            style={{ scaleX: fill }}
            className="absolute left-[calc((100%_-_3.75rem)/8)] right-[calc((100%_-_3.75rem)/8)] top-5 hidden h-0.5 origin-left -translate-y-1/2 rounded bg-teal-700 md:block"
          />

          {STEPS.map((step, index) => {
            const isOpen = openStep === index;
            const done = index < reached;
            const Icon = step.icon;
            return (
              <li
                key={step.stepNumber}
                className="relative pl-14 md:pl-0 md:pt-14"
              >
                {/* Node */}
                <motion.span
                  animate={done ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className={cn(
                    "absolute left-0 top-0 z-10 flex size-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors duration-300 md:left-1/2 md:-translate-x-1/2",
                    done
                      ? "border-teal-700 bg-teal-700 text-white"
                      : "border-slate-300 bg-white text-slate-500",
                  )}
                >
                  {step.stepNumber}
                </motion.span>

                {/* Card */}
                <button
                  type="button"
                  onClick={() => setOpenStep(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className={cn(
                    "group w-full rounded-3xl border bg-white p-5 text-left transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2",
                    isOpen
                      ? "border-teal-600/50 shadow-[0_12px_32px_-12px_rgba(15,118,110,0.35)]"
                      : "border-slate-200 hover:-translate-y-0.5 hover:border-teal-600/40",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-xl transition-colors",
                        isOpen
                          ? "bg-teal-700 text-white"
                          : "bg-teal-50 text-teal-700",
                      )}
                    >
                      <Icon className="size-[18px]" />
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 text-slate-400 transition-transform duration-300",
                        isOpen && "rotate-180 text-teal-700",
                      )}
                    />
                  </div>

                  <h3 className="mt-4 text-[15px] font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                    {step.description}
                  </p>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                          {step.details.map((detail) => (
                            <li
                              key={detail}
                              className="flex items-start gap-2 text-[12.5px] leading-snug text-slate-700"
                            >
                              <Check className="mt-0.5 size-3.5 shrink-0 text-teal-700" />
                              {detail}
                            </li>
                          ))}
                        </div>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 text-center">
          <Button
            render={<Link href={ctaHref} />}
            nativeButton={false}
            size="lg"
            className="rounded-full bg-teal-700 px-8 hover:bg-teal-800"
          >
            অর্ডার শুরু করুন
          </Button>
        </div>
      </div>
    </section>
  );
}
