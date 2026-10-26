export type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  origin: string;
  pricePerKg: number;
  weightG: number;
  weightRange: string;
  pieceWeight: string;
  /** Number of pieces the customer wants. */
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  hydrated: boolean;
};
