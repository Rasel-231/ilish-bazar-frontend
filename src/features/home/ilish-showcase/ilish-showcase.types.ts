export interface IlishProduct {
  id: string;
  name: string;
  image: string;
  /** weight of this fish/piece in kg */
  weightKg: number;
  /** price of this piece in BDT */
  price: number;
  oldPrice?: number;
  /** where the fish was caught, e.g. "চাঁদপুর · পদ্মা" */
  source: string;
  rating: number;
  reviews: number;
  /** small highlight, e.g. "ডিমওয়ালা" */
  badge?: string;
  stockLeft?: number;
  delivery?: string;
}

export interface PackagingItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface IlishShowcaseProps {
  products?: IlishProduct[];
  packaging?: PackagingItem[];
  viewAllHref?: string;
  onAddToCart?: (product: IlishProduct) => void;
  onBuyNow?: (product: IlishProduct) => void;
  onWishlistChange?: (productId: string, wished: boolean) => void;
}
