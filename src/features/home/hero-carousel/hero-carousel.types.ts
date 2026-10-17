export interface HeroCarouselLink {
  /** Visible label, usually Bangla copy. */
  readonly label: string;
  /** Internal route or route + query string. */
  readonly href: string;
}

export interface HeroCarouselSlide {
  /** Stable identifier, also used as the React key. */
  readonly id: string;
  /** Small pill above the title. */
  readonly eyebrow: string;
  /** Slide headline. */
  readonly title: string;
  /** Short supporting copy. */
  readonly description: string;
  /** Local image path, e.g. `/images/hero/example.jpg`. */
  readonly image: string;
  /** Descriptive alt text for the photograph. */
  readonly imageAlt: string;
  /** CSS `object-position` value to keep the subject framed across breakpoints. */
  readonly imagePosition?: string;
  readonly primaryCta: HeroCarouselLink;
  readonly secondaryCta?: HeroCarouselLink;
}

export interface HeroCarouselProps {
  /** Overrides the default slide collection (useful for reuse and testing). */
  readonly slides?: readonly HeroCarouselSlide[];
  /** Autoplay interval in milliseconds. Defaults to 5500ms. */
  readonly autoplayInterval?: number;
  readonly className?: string;
}
