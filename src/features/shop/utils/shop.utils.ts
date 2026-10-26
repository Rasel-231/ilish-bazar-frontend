import type {
  ShopOption,
  ShopSizeKey,
  ShopSortKey,
  ShopSourceKey,
} from "../types/shop.types";

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Deterministic Bengali digits — avoids ICU differences between Node and browsers. */
export function toBnNumber(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => BN_DIGITS[Number(digit)] ?? digit);
}

/** Convert Bengali digits typed by the customer back to English digits. */
export function fromBnNumber(value: string): string {
  return value.replace(/[০-৯]/g, (digit) => String(BN_DIGITS.indexOf(digit)));
}

export function formatTaka(amount: number): string {
  return `৳${toBnNumber(amount.toLocaleString("en-US"))}`;
}

export function formatWeight(weightG: number): string {
  if (weightG >= 1000) {
    const kg = weightG / 1000;
    return `${toBnNumber(Number.isInteger(kg) ? kg : kg.toFixed(1))} কেজি`;
  }

  return `${toBnNumber(weightG)} গ্রাম`;
}

export function formatRating(rating: number): string {
  return toBnNumber(rating.toFixed(1));
}

export function formatReviewCount(reviews: number): string {
  return `${toBnNumber(reviews)} রিভিউ`;
}

/** ৫০০–৭০০ গ্রাম · ৭০০–৯০০ গ্রাম · ১ কেজি+ */
export function sizeKeyOf(weightG: number): ShopSizeKey {
  if (weightG >= 1000) return "xl";
  if (weightG >= 700) return "large";
  return "mid";
}

export const SOURCE_OPTIONS: ReadonlyArray<ShopOption<ShopSourceKey>> = [
  { value: "sea", label: "সামুদ্রিক" },
  { value: "farm", label: "চাষের" },
  { value: "barishal", label: "বরিশাল" },
];

export const SIZE_OPTIONS: ReadonlyArray<ShopOption<ShopSizeKey>> = [
  { value: "mid", label: "৫০০–৭০০ গ্রাম" },
  { value: "large", label: "৭০০–৯০০ গ্রাম" },
  { value: "xl", label: "১ কেজি+" },
];

export const SORT_OPTIONS: ReadonlyArray<ShopOption<ShopSortKey>> = [
  { value: "featured", label: "সেরা পছন্দ" },
  { value: "price-asc", label: "দাম কম থেকে বেশি" },
  { value: "price-desc", label: "দাম বেশি থেকে কম" },
];
