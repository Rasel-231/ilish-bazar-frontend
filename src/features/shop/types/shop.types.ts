export type ShopSourceKey = "sea" | "farm" | "barishal";

export type ShopSizeKey = "mid" | "large" | "xl";

export type ShopSortKey = "featured" | "price-asc" | "price-desc";

export type FishArtVariant = "blue" | "yellow" | "green";

export type ShopProduct = {
  /** Product slug — also used as the product id. */
  id: string;
  slug: string;
  name: string;
  origin: string;
  source: ShopSourceKey;
  weightG: number;
  weightRange: string;
  pieceWeight: string;
  pricePerKg: number;
  rating: number;
  reviews: number;
  tag?: string;
  art: FishArtVariant;
  /** Drives the default “সেরা পছন্দ” ordering. */
  popularity: number;
  fresh: boolean;
  inStock: boolean;
  image: string;
  images: string[];
};

export type ShopOption<T extends string> = {
  value: T;
  label: string;
};
