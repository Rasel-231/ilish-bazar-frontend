import { ROUTES } from "@/lib/navigation";

import type { HeroCarouselSlide } from "./hero-carousel.types";

/**
 * Homepage hero slides.
 *
 * Imagery: real photographs of Hilsa fish and Bangladeshi fish markets sourced
 * from Pexels (free to use, attribution appreciated). See
 * `public/images/hero/` for the locally optimised assets.
 */
export const HERO_SLIDES: readonly HeroCarouselSlide[] = [
  {
    id: "padma-hilsa",
    eyebrow: "পদ্মার রাজা",
    title: "পদ্মার রুপালি ইলিশ, একেবারে তাজা",
    description:
      "নদী থেকে তোলা রাজকীয় ইলিশ — বাছাই করা, বরফে সংরক্ষিত, আর আপনার ঘরে পৌঁছানোর আগ পর্যন্ত সতেজ।",
    image: "/images/hero/padma-hilsa.jpg",
    imageAlt: "বরফের উপর রাখা তাজা রূপালি ইলিশ মাছ",
    imagePosition: "center 42%",
    primaryCta: { label: "ইলিশ কিনুন", href: ROUTES.shop },
    secondaryCta: { label: "পদ্মার ইলিশ", href: `${ROUTES.shop}?source=padma` },
  },
  {
    id: "fresh-delivery",
    eyebrow: "সরাসরি আড়ত থেকে",
    title: "নদীর তাজা ইলিশ পৌঁছে যাবে আপনার ঘরে",
    description:
      "ঢাকাসহ সারা দেশে কোল্ড চেইনে ডেলিভারি — যতটা তাজা তোলা হয়, ততটাই সতেজ আপনার হাতে।",
    image: "/images/hero/market-baskets.jpg",
    imageAlt: "আড়তের ঝুড়িতে সাজানো তাজা ইলিশ মাছ",
    imagePosition: "center 55%",
    primaryCta: { label: "এখনই অর্ডার করুন", href: ROUTES.shop },
    secondaryCta: { label: "অর্ডার ট্র্যাক করুন", href: ROUTES.track },
  },
  {
    id: "seasonal-offer",
    eyebrow: "মৌসুমি অফার",
    title: "সিজনের সেরা ইলিশ, বিশেষ দামে",
    description:
      "চাঁদপুর ও মেঘনার বাছাই করা ইলিশে চলছে মৌসুমি ছাড় — সীমিত সময়ের জন্য।",
    image: "/images/hero/hilsa-ice.jpg",
    imageAlt: "বরফের উপর চকচকে আঁশের তাজা ইলিশ মাছ",
    imagePosition: "center 50%",
    primaryCta: { label: "অফার দেখুন", href: ROUTES.shop },
    secondaryCta: {
      label: "চাঁদপুরের ইলিশ",
      href: `${ROUTES.shop}?source=chandpur`,
    },
  },
  {
    id: "trusted-quality",
    eyebrow: "নির্বাচিত মান",
    title: "প্রতিটি ইলিশ বাছাই করা, যাচাই করা",
    description:
      "আকার, ওজন ও সতেজতা যাচাই করে তবেই প্যাক করা হয় — তাই মান নিয়ে থাকুন নিশ্চিন্ত।",
    image: "/images/hero/traditional-market.jpg",
    imageAlt: "ঐতিহ্যবাহী বাজারে বরফের উপর সাজানো তাজা ইলিশ মাছ",
    imagePosition: "center 50%",
    primaryCta: { label: "ইলিশ কিনুন", href: ROUTES.shop },
    secondaryCta: { label: "রিফান্ড নীতি", href: ROUTES.refundPolicy },
  },
];
