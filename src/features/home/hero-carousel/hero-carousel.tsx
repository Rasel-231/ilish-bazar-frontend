"use client";

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  type PanInfo,
  type Transition,
  type Variants,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";

import { HERO_SLIDES } from "./hero-carousel.data";
import type { HeroCarouselProps } from "./hero-carousel.types";

const DEFAULT_AUTOPLAY_MS = 5500;

// Match this with your header's inner container so the banner text lines up with the logo.
const CONTAINER_CLASS = "container-page";

const SLIDE_TRANSITION: Transition = { duration: 0.8, ease: "easeInOut" };
const KEN_BURNS_TRANSITION: Transition = { duration: 8, ease: "linear" };
const KEN_BURNS_RESET: Transition = { duration: 0.8, ease: "easeOut" };

const CONTENT_CONTAINER: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const CONTENT_ITEM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const SWIPE_OFFSET_THRESHOLD = 60;
const SWIPE_VELOCITY_THRESHOLD = 450;

const padNumber = (value: number) => String(value).padStart(2, "0");

function subscribeToReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

const getReducedMotionSnapshot = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Tracks the user's reduced-motion preference without hydration mismatches. */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
}

function subscribeToVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

const getVisibilitySnapshot = () => document.hidden;

/** Pauses autoplay when the browser tab is hidden. */
function useDocumentHidden(): boolean {
  return useSyncExternalStore(
    subscribeToVisibility,
    getVisibilitySnapshot,
    () => false,
  );
}

const ROUND_BUTTON_CLASS =
  "flex items-center justify-center rounded-full border border-white/25 bg-navy/40 text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-navy/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 active:scale-95";

export function HeroCarousel({
  slides = HERO_SLIDES,
  autoplayInterval = DEFAULT_AUTOPLAY_MS,
  className,
}: HeroCarouselProps) {
  const count = slides.length;

  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const reducedMotion = usePrefersReducedMotion();
  const documentHidden = useDocumentHidden();

  const interactionPaused = hovered || focused;
  const autoplayActive =
    count > 1 &&
    !userPaused &&
    !interactionPaused &&
    !documentHidden &&
    !reducedMotion;

  const goTo = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  const goNext = useCallback(
    () => setIndex((current) => (current + 1) % count),
    [count],
  );

  const goPrev = useCallback(
    () => setIndex((current) => (current - 1 + count) % count),
    [count],
  );

  const markFailed = useCallback((id: string) => {
    setFailedImages((current) =>
      current[id] ? current : { ...current, [id]: true },
    );
  }, []);

  // Autoplay: resets whenever the active index changes so manual navigation
  // gets a full interval. The interval is always cleared on cleanup.
  useEffect(() => {
    if (!autoplayActive) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, autoplayInterval);

    return () => window.clearInterval(timer);
  }, [autoplayActive, autoplayInterval, count, index]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    },
    [goNext, goPrev],
  );

  const handleBlur = useCallback((event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setFocused(false);
    }
  }, []);

  const handleDragEnd = useCallback(
    (_event: unknown, info: PanInfo) => {
      const { offset, velocity } = info;

      if (
        offset.x < -SWIPE_OFFSET_THRESHOLD ||
        velocity.x < -SWIPE_VELOCITY_THRESHOLD
      ) {
        goNext();
      } else if (
        offset.x > SWIPE_OFFSET_THRESHOLD ||
        velocity.x > SWIPE_VELOCITY_THRESHOLD
      ) {
        goPrev();
      }
    },
    [goNext, goPrev],
  );

  if (count === 0) return null;

  const showControls = count > 1;
  const nextSlide = slides[(index + 1) % count];

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="ইলিশ বাজারের নির্বাচিত সংগ্রহ ও অফার"
      tabIndex={-1}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={handleBlur}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative isolate w-full overflow-hidden bg-navy",
        "h-[clamp(27rem,64svh,33rem)] sm:h-[clamp(34rem,70svh,44rem)] lg:h-[clamp(36rem,68svh,46rem)]",
        className,
      )}
    >
      {/* Slides (swipeable layer) */}
      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        aria-live={autoplayActive ? "off" : "polite"}
        drag={showControls ? "x" : false}
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={handleDragEnd}
      >
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === index;

          return (
            <motion.div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} / ${count}`}
              aria-hidden={!active}
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={reducedMotion ? { duration: 0 } : SLIDE_TRANSITION}
              style={{
                pointerEvents: active ? "auto" : "none",
                zIndex: active ? 10 : 0,
              }}
              className="absolute inset-0"
            >
              {/* Background image / fallback */}
              <div className="absolute inset-0">
                {failedImages[slide.id] ? (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-br from-navy via-primary/60 to-navy"
                  />
                ) : (
                  <motion.div
                    className="absolute inset-0"
                    initial={false}
                    animate={
                      reducedMotion ? undefined : { scale: active ? 1.06 : 1 }
                    }
                    transition={active ? KEN_BURNS_TRANSITION : KEN_BURNS_RESET}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.imageAlt}
                      fill
                      priority={slideIndex === 0}
                      draggable={false}
                      onError={() => markFailed(slide.id)}
                      sizes="100vw"
                      style={{
                        objectPosition: slide.imagePosition ?? "center",
                      }}
                      className="select-none object-cover"
                    />
                  </motion.div>
                )}
              </div>

              {/* Readability overlays */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/55 via-50% to-navy/10 sm:via-navy/35 sm:to-navy/5"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 hidden bg-gradient-to-r from-navy/85 via-navy/45 via-45% to-transparent sm:block"
              />

              {/* Copy (mounted only for the active slide) */}
              {active && (
                <div className="absolute inset-0 flex items-end pb-[4.75rem] pt-6 sm:pb-24 lg:items-center lg:pb-16 lg:pt-10">
                  <div className={CONTAINER_CLASS}>
                    <motion.div
                      className="max-w-[46rem] lg:max-w-[52rem]"
                      variants={CONTENT_CONTAINER}
                      initial={reducedMotion ? false : "hidden"}
                      animate="visible"
                    >
                      <motion.span
                        variants={CONTENT_ITEM}
                        className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 font-bangla text-xs font-semibold text-white backdrop-blur-md sm:text-sm"
                      >
                        <span
                          aria-hidden="true"
                          className="size-2 rounded-full bg-amber-400"
                        />
                        {slide.eyebrow}
                      </motion.span>

                      <motion.h2
                        variants={CONTENT_ITEM}
                        className="mt-3 font-bangla text-[1.4rem] font-bold leading-[1.35] text-white text-balance drop-shadow-sm sm:mt-5 sm:text-4xl sm:leading-[1.3] lg:text-[2.75rem] xl:text-5xl"
                      >
                        {slide.title}
                      </motion.h2>

                      <motion.p
                        variants={CONTENT_ITEM}
                        className="mt-3 line-clamp-2 max-w-xl font-bangla text-sm leading-relaxed text-white/85 sm:mt-5 sm:line-clamp-none sm:text-base lg:text-lg"
                      >
                        {slide.description}
                      </motion.p>

                      <motion.div
                        variants={CONTENT_ITEM}
                        className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8"
                      >
                        <Link
                          href={slide.primaryCta.href}
                          className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-primary px-6 font-bangla text-sm font-semibold text-white shadow-lg shadow-black/25 transition-all hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy active:translate-y-0 active:scale-[0.98] sm:h-14 sm:px-8 sm:text-base"
                        >
                          <span>{slide.primaryCta.label}</span>
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>

                        {slide.secondaryCta && (
                          <Link
                            href={slide.secondaryCta.href}
                            className="inline-flex h-12 items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 font-bangla text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 active:scale-[0.98] sm:h-14 sm:px-8 sm:text-base"
                          >
                            {slide.secondaryCta.label}
                          </Link>
                        )}
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {showControls && (
        <>
          {/* Side arrows (desktop) */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="আগের স্লাইড"
            className={cn(
              ROUND_BUTTON_CLASS,
              "absolute left-4 top-1/2 z-20 hidden size-12 -translate-y-1/2 lg:flex xl:left-7",
            )}
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="পরের স্লাইড"
            className={cn(
              ROUND_BUTTON_CLASS,
              "absolute right-4 top-1/2 z-20 hidden size-12 -translate-y-1/2 lg:flex xl:right-7",
            )}
          >
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>

          {/* "Up next" preview card (desktop) */}
          <button
            type="button"
            onClick={goNext}
            aria-label={`পরবর্তী স্লাইড: ${nextSlide.title}`}
            className="absolute inset-x-0 bottom-24 z-20 hidden lg:block"
          >
            <span className={cn(CONTAINER_CLASS, "flex justify-end")}>
              <span className="group/next flex w-[22rem] items-center gap-3.5 rounded-2xl border border-white/20 bg-navy/45 p-2.5 pr-4 text-left backdrop-blur-md transition-all hover:border-white/40 hover:bg-navy/60">
                <span className="relative size-[4.25rem] shrink-0 overflow-hidden rounded-xl bg-white/10">
                  {!failedImages[nextSlide.id] && (
                    <Image
                      src={nextSlide.image}
                      alt=""
                      fill
                      sizes="68px"
                      style={{
                        objectPosition: nextSlide.imagePosition ?? "center",
                      }}
                      className="object-cover transition-transform duration-500 group-hover/next:scale-110"
                    />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block font-bangla text-[0.7rem] font-medium uppercase tracking-wider text-white/60">
                    পরবর্তী
                  </span>
                  <span className="mt-0.5 line-clamp-2 block font-bangla text-sm font-semibold leading-snug text-white">
                    {nextSlide.title}
                  </span>
                </span>
              </span>
            </span>
          </button>

          {/* Bottom bar: progress tabs + counter + pause */}
          <div className="absolute inset-x-0 bottom-0 z-20 pb-5 sm:pb-7">
            <div
              className={cn(
                CONTAINER_CLASS,
                "flex items-center justify-between gap-4",
              )}
            >
              <div
                role="tablist"
                aria-label="স্লাইড নির্বাচন"
                className="flex items-center gap-1.5"
              >
                {slides.map((slide, tabIndex) => {
                  const active = tabIndex === index;
                  const completed = tabIndex < index;

                  return (
                    <button
                      key={slide.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-label={`স্লাইড ${tabIndex + 1} দেখুন`}
                      onClick={() => goTo(tabIndex)}
                      className={cn(
                        "group/tab flex h-8 items-center transition-[width] duration-500 focus-visible:outline-none",
                        active ? "w-14 sm:w-20" : "w-7 sm:w-10",
                      )}
                    >
                      <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-white/30 transition-colors group-hover/tab:bg-white/50 group-focus-visible/tab:ring-2 group-focus-visible/tab:ring-white/70 group-focus-visible/tab:ring-offset-2 group-focus-visible/tab:ring-offset-transparent">
                        {completed && (
                          <span className="absolute inset-0 bg-white" />
                        )}

                        {active &&
                          (reducedMotion ? (
                            <span className="absolute inset-0 bg-white" />
                          ) : (
                            <span
                              key={`${index}-${autoplayActive}`}
                              className="animate-hero-progress absolute inset-0 origin-left bg-white"
                              style={{
                                animationDuration: `${autoplayInterval}ms`,
                                animationPlayState: autoplayActive
                                  ? "running"
                                  : "paused",
                              }}
                            />
                          ))}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  aria-hidden="true"
                  className="flex items-baseline gap-1.5 tabular-nums text-white"
                >
                  <span className="text-base font-semibold sm:text-lg">
                    {padNumber(index + 1)}
                  </span>
                  <span className="text-xs text-white/50 sm:text-sm">
                    / {padNumber(count)}
                  </span>
                </div>

                {!reducedMotion && (
                  <button
                    type="button"
                    onClick={() => setUserPaused((paused) => !paused)}
                    aria-label={
                      userPaused ? "স্লাইড চালু করুন" : "স্লাইড বিরতি দিন"
                    }
                    aria-pressed={userPaused}
                    className={cn(ROUND_BUTTON_CLASS, "size-10 sm:size-11")}
                  >
                    {userPaused ? (
                      <Play className="size-4" aria-hidden="true" />
                    ) : (
                      <Pause className="size-4" aria-hidden="true" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
