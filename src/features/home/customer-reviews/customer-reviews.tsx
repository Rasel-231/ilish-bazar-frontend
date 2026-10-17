"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CheckCircle2, Star } from "lucide-react";

import { cn } from "@/lib/utils";

type CustomerReview = {
  id: number;
  name: string;
  area: string;
  date: string;
  rating: number; // 1-5
  ratingBn: string;
  comment: string;
  verified: boolean;
};

// Mock data — replace with the reviews API once it is available.
const REVIEWS: CustomerReview[] = [
  {
    id: 1,
    name: "তানভীর আহমেদ",
    area: "মিরপুর",
    date: "৪ অক্টোবর, ২০২৬",
    rating: 4,
    ratingBn: "৪",
    comment: "দাম ঠিক আছে, মাছ ফ্রেশ। কাটিং ভালো করেছে।",
    verified: true,
  },
  {
    id: 2,
    name: "জাহিদ হাসান",
    area: "উত্তরা",
    date: "৪ অক্টোবর, ২০২৬",
    rating: 5,
    ratingBn: "৫",
    comment: "মাওয়ার ইলিশ সত্যিই তাজা। ডেলিভারির সময় ওজন মেপে দিয়েছে।",
    verified: true,
  },
  {
    id: 3,
    name: "নাজমুল ইসলাম",
    area: "গুলশান",
    date: "৩ অক্টোবর, ২০২৬",
    rating: 5,
    ratingBn: "৫",
    comment: "চাঁদপুরের ইলিশের স্বাদই আলাদা। প্যাকিং খুব ভালো।",
    verified: true,
  },
];

function ReviewStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < value
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-slate-300",
          )}
        />
      ))}
    </div>
  );
}

export function CustomerReviews() {
  const reduce = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.12 } },
  };

  const itemVariants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="p-8">
      <div className="container-page">
        {/* Heading */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold text-teal-700">ক্রেতার কথা</p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            যাঁরা কিনেছেন, তাঁরা বলছেন
          </h2>
        </div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-4 md:grid-cols-3"
        >
          {REVIEWS.map((review) => (
            <motion.div key={review.id} variants={itemVariants}>
              <div className="h-full rounded-3xl border border-slate-200 bg-white p-5 shadow-none">
                {/* Rating */}
                <div
                  className="flex items-center gap-2"
                  role="img"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  <ReviewStars value={review.rating} />
                  <span className="text-xs font-bold text-slate-800">
                    {review.ratingBn}
                  </span>
                </div>

                {/* Comment */}
                <blockquote className="mt-4 text-sm leading-relaxed text-slate-800">
                  “{review.comment}”
                </blockquote>

                {/* Meta */}
                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-900">
                    {review.name}
                  </span>
                  <span>
                    , {review.area} · {review.date}
                  </span>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                      <CheckCircle2 className="size-3.5" />
                      ভেরিফাইড
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
