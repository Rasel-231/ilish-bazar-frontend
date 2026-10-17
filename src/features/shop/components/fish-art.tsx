"use client";

import { useId } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { FishArtVariant } from "../types/shop.types";

const ART_STYLES: Record<
  FishArtVariant,
  {
    bodyTop: string;
    bodyBottom: string;
    fin: string;
    outline: string;
    bubble: string;
  }
> = {
  blue: {
    bodyTop: "#f3fafd",
    bodyBottom: "#c2ddea",
    fin: "#9cc6da",
    outline: "#356b85",
    bubble: "#7fb3cc",
  },
  yellow: {
    bodyTop: "#fdf6e2",
    bodyBottom: "#efd9a0",
    fin: "#ddbd74",
    outline: "#96732a",
    bubble: "#d4b365",
  },
  green: {
    bodyTop: "#f0faf3",
    bodyBottom: "#bfe0c9",
    fin: "#96c9a8",
    outline: "#3f7a58",
    bubble: "#86be99",
  },
};

const BODY_PATH =
  "M 206 70 C 200 44 172 28 128 28 C 90 28 62 44 56 70 C 62 96 90 112 128 112 C 172 112 200 96 206 70 Z";

const SCALE_ROWS = [46, 60, 74, 88];
const SCALE_COLUMNS = [76, 92, 108, 124, 140, 156];

const scales = SCALE_ROWS.flatMap((y, rowIndex) =>
  SCALE_COLUMNS.map((x, columnIndex) => ({
    id: `${rowIndex}-${columnIndex}`,
    cx: x + (rowIndex % 2 === 0 ? 0 : 8),
    cy: y,
  })),
).filter((scale) => scale.cx <= 168);

type FishArtProps = {
  variant: FishArtVariant;
  className?: string;
};

/**
 * Decorative inline-SVG hilsa illustration: body, scales, eye, fins and a soft
 * ground shadow, with a gentle floating animation. The surrounding
 * `MotionConfig reducedMotion="user"` disables the motion when the visitor
 * prefers reduced motion.
 */
export function FishArt({ variant, className }: FishArtProps) {
  const uid = useId().replace(/:/g, "");
  const palette = ART_STYLES[variant];

  return (
    <svg
      viewBox="0 0 220 140"
      className={cn("h-auto w-full", className)}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.bodyTop} />
          <stop offset="100%" stopColor={palette.bodyBottom} />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <path d={BODY_PATH} />
        </clipPath>
      </defs>

      {/* ground shadow */}
      <ellipse
        cx="112"
        cy="126"
        rx="64"
        ry="7"
        fill="#0b2540"
        opacity="0.08"
      />

      <motion.g
        animate={{ y: [0, -6, 0], rotate: [-1, 1.2, -1] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "112px 80px" }}
      >
        {/* tail */}
        <path
          d="M 60 70 L 20 36 L 33 70 L 20 104 Z"
          fill={palette.fin}
          stroke={palette.outline}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* dorsal fin */}
        <path
          d="M 104 33 C 112 12 142 13 152 39 C 141 27 119 27 104 33 Z"
          fill={palette.fin}
          stroke={palette.outline}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* body */}
        <path
          d={BODY_PATH}
          fill={`url(#${uid}-body)`}
          stroke={palette.outline}
          strokeWidth="2.5"
        />

        {/* scales */}
        <g
          clipPath={`url(#${uid}-clip)`}
          fill="none"
          stroke={palette.outline}
          strokeOpacity="0.26"
          strokeWidth="1.6"
        >
          {scales.map((scale) => (
            <circle key={scale.id} cx={scale.cx} cy={scale.cy} r="6.2" />
          ))}
        </g>

        {/* gill */}
        <path
          d="M 163 44 C 153 56 153 84 163 96"
          fill="none"
          stroke={palette.outline}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* pectoral fin */}
        <path
          d="M 146 92 C 141 111 118 118 109 106 C 123 110 137 101 140 86 Z"
          fill={palette.fin}
          stroke={palette.outline}
          strokeWidth="2"
          strokeLinejoin="round"
          opacity="0.95"
        />

        {/* mouth */}
        <path
          d="M 205 70 C 199 71 197 74 195 77"
          fill="none"
          stroke={palette.outline}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* eye */}
        <circle
          cx="181"
          cy="59"
          r="8"
          fill="#ffffff"
          stroke={palette.outline}
          strokeWidth="2"
        />
        <circle cx="183" cy="59" r="3.6" fill={palette.outline} />
        <circle cx="163" cy="50" r="7" fill="#ffffff" opacity="0.35" />
      </motion.g>

      {/* bubbles */}
      <g fill={palette.bubble} opacity="0.5">
        <circle cx="196" cy="32" r="3" />
        <circle cx="206" cy="21" r="2.2" />
        <circle cx="186" cy="19" r="1.7" />
      </g>
    </svg>
  );
}
