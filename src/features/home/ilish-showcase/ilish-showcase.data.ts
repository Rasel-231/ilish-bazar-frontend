import type { IlishProduct, PackagingItem } from "./ilish-showcase.types";

/** Free-to-use Unsplash photos (placeholders). Swap for your own images later. */
const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const FISH_IN_BOWL_IMAGE = unsplash("photo-1668532697413-71a8171089d1"); // fish in a bowl
const FISH_GROUP_IMAGE = unsplash("photo-1668532696872-dc5fe74a47f7"); // group of fish
const FISH_PILE_IMAGE = unsplash("photo-1668532697600-d0ddf56ece30"); // pile of fish
const STYROFOAM_BOX_IMAGE = unsplash("photo-1762049213265-675d3e57fe5a", 1000); // styrofoam boxes
const STACKED_BOX_IMAGE = unsplash("photo-1644866331678-3b1385841c6b", 1000); // stacked white boxes

export const DEFAULT_ILISH_PRODUCTS: IlishProduct[] = [
  {
    id: "ilish-1",
    name: "চাঁদপুরের পদ্মা ইলিশ",
    image: FISH_GROUP_IMAGE,
    weightKg: 1.2,
    price: 2220,
    oldPrice: 2520,
    source: "চাঁদপুর · পদ্মা",
    rating: 4.8,
    reviews: 126,
    badge: "ডিমওয়ালা",
    stockLeft: 4,
    delivery: "আজই ডেলিভারি",
  },
  {
    id: "ilish-2",
    name: "মেঘনার রুপালি ইলিশ",
    image: FISH_IN_BOWL_IMAGE,
    weightKg: 1,
    price: 1850,
    source: "লক্ষ্মীপুর · মেঘনা",
    rating: 4.7,
    reviews: 89,
    delivery: "৩ ঘণ্টায় ডেলিভারি",
  },
  {
    id: "ilish-3",
    name: "বরিশালের তেতুলিয়া ইলিশ",
    image: FISH_PILE_IMAGE,
    weightKg: 1.5,
    price: 3150,
    oldPrice: 3450,
    source: "বরিশাল · তেতুলিয়া",
    rating: 4.9,
    reviews: 203,
    badge: "সেরা বিক্রি",
    stockLeft: 3,
    delivery: "আজই ডেলিভারি",
  },
  {
    id: "ilish-4",
    name: "ভোলার সামুদ্রিক ইলিশ",
    image: FISH_GROUP_IMAGE,
    weightKg: 0.9,
    price: 1520,
    source: "ভোলা · বঙ্গোপসাগর",
    rating: 4.6,
    reviews: 54,
    delivery: "আগামীকাল সকালে",
  },
  {
    id: "ilish-5",
    name: "কুয়াকাটার তাজা ইলিশ",
    image: FISH_PILE_IMAGE,
    weightKg: 1.1,
    price: 2090,
    oldPrice: 2290,
    source: "পটুয়াখালী · কুয়াকাটা",
    rating: 4.7,
    reviews: 71,
    stockLeft: 5,
    delivery: "৩ ঘণ্টায় ডেলিভারি",
  },
  {
    id: "ilish-6",
    name: "পদ্মার প্রিমিয়াম জোড়া ইলিশ",
    image: FISH_IN_BOWL_IMAGE,
    weightKg: 2,
    price: 4400,
    source: "চাঁদপুর · পদ্মা",
    rating: 5,
    reviews: 38,
    badge: "প্রিমিয়াম",
    delivery: "আজই ডেলিভারি",
  },
];

export const DEFAULT_PACKAGING: PackagingItem[] = [
  {
    id: "pack-1",
    title: "ইনসুলেটেড আইস বক্স",
    description: "জেলে থেকে আপনার হাত পর্যন্ত বরফ-ঠান্ডা, তাজা থাকে ৪৮ ঘণ্টা।",
    image: STYROFOAM_BOX_IMAGE,
  },
  {
    id: "pack-2",
    title: "সিল করা ডেলিভারি বক্স",
    description: "সিল করা, পরিষ্কার প্যাকেটে আপনার দরজা পর্যন্ত নিরাপদে পৌঁছায়।",
    image: STACKED_BOX_IMAGE,
  },
];
