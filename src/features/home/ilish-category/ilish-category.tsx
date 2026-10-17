"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryItem {
  slug: string;
  title: string;
  image: string;
  count: number;
}

export const CategorySection = () => {
  const [data, setData] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/category.json")
      .then((res) => res.json())
      .then((resData) => {
        const seen = new Set<string>();
        const unique = (resData.data as CategoryItem[]).filter((item) => {
          if (seen.has(item.slug)) return false;
          seen.add(item.slug);
          return true;
        });
        setData(unique);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        লোডিং হচ্ছে...
      </div>
    );
  }

  return (
    <section aria-labelledby="category-title" className="py-12 sm:py-16">
      <div className="container-page">
        {/* --- Header & Arrow Navigation Buttons --- */}
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <header className="max-w-2xl">
            <h2
              id="category-title"
              className="text-2xl font-bold leading-[1.4] text-navy sm:text-3xl"
            >
              ক্যাটাগরি অনুযায়ী ইলিশ
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-navy/70 sm:text-base">
              ঘাট, সাইজ বা কাটার ধরন দেখে আপনার পছন্দের ইলিশ বেছে নিন।
            </p>
          </header>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll("left")}
              aria-label="Scroll Left"
              className="p-2.5 rounded-full border border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200 shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => handleScroll("right")}
              aria-label="Scroll Right"
              className="p-2.5 rounded-full border border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200 shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* --- Slider Container --- */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {data.map((category) => (
            <div
              key={category.slug}
              className="group relative min-w-[31.5%] sm:min-w-[190px] lg:min-w-[220px] h-36 sm:h-44 shrink-0 overflow-hidden rounded-xl bg-muted cursor-pointer shadow-sm border border-border"
            >
              {/* Background Image */}
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Dark Gradient Overlay (টেক্সট স্পষ্ট বোঝার জন্য) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Text Content on top of Image (Z-Index দিয়ে উপরে তোলা হয়েছে) */}
              <div className="absolute inset-0 z-10 flex flex-col justify-between p-3 text-white">
                <span className="text-[10px] sm:text-xs font-medium bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full w-max">
                  {category.count} টি আইটেম
                </span>

                <div>
                  <h3 className="text-xs sm:text-sm md:text-white font-bold drop-shadow-md line-clamp-1">
                    {category.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
