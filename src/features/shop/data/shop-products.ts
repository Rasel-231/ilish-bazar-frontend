import rawIlish from "../../../../public/ilish.json";

import type {
  FishArtVariant,
  ShopProduct,
  ShopSourceKey,
} from "../types/shop.types";

export const SOURCE_LABELS: Record<ShopSourceKey, string> = {
  sea: "সামুদ্রিক",
  farm: "চাষের",
  barishal: "বরিশাল",
};

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

function bnToEn(value: string) {
  return value.replace(/[০-৯]/g, (digit) => String(BN_DIGITS.indexOf(digit)));
}

function parseWeightInGrams(value: string) {
  const normalized = bnToEn(value).replace(/,/g, "");

  const kgMatch = normalized.match(/([\d.]+)\s*কেজি/);
  if (kgMatch) return Math.round(Number(kgMatch[1]) * 1000);

  const gramMatch = normalized.match(/([\d.]+)\s*গ্রাম/);
  if (gramMatch) return Math.round(Number(gramMatch[1]));

  return 500;
}

function sourceOf(origin: string): ShopSourceKey {
  if (origin.includes("বরিশাল") || origin.includes("ভোলা")) return "barishal";
  if (origin.includes("চাঁদপুর") || origin.includes("উপকূল")) return "sea";
  return "farm";
}

function artOf(tone: string): FishArtVariant {
  if (tone === "sand") return "yellow";
  if (tone === "green") return "green";
  return "blue";
}

export const SHOP_PRODUCTS: ShopProduct[] = rawIlish.map((item, index) => {
  const images = item.images?.length
    ? item.images
    : [
        "https://images.unsplash.com/photo-1572120151475-7446d705f83b?auto=format&fit=crop&fm=jpg&q=80&w=1200",
      ];

  return {
    id: item.slug,
    slug: item.slug,
    name: item.name,
    origin: item.origin,
    source: sourceOf(item.origin),
    weightG: parseWeightInGrams(item.pieceWeight),
    weightRange: item.weightRange,
    pieceWeight: item.pieceWeight,
    pricePerKg: item.pricePerKg,
    rating: item.rating,
    reviews: item.reviewCount,
    tag: item.badge ?? undefined,
    art: artOf(item.tone),
    popularity: Math.round(item.rating * 10 + item.reviewCount / 10 + index),
    fresh: item.fresh,
    inStock: item.inStock,
    image: images[0],
    images,
  };
});

export function getShopProduct(slug: string) {
  return SHOP_PRODUCTS.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: ShopProduct, limit = 4) {
  return SHOP_PRODUCTS.filter(
    (item) =>
      item.slug !== product.slug &&
      (item.source === product.source || item.origin === product.origin),
  )
    .concat(SHOP_PRODUCTS.filter((item) => item.slug !== product.slug))
    .filter(
      (item, index, list) =>
        list.findIndex((candidate) => candidate.slug === item.slug) === index,
    )
    .slice(0, limit);
}
