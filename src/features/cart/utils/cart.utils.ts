import type { ShopProduct } from "@/features/shop/types/shop.types";

import type { CartItem } from "../types/cart.types";

export const FREE_DELIVERY_THRESHOLD = 3000;
export const DEFAULT_DELIVERY_FEE = 80;

export function cartItemFromProduct(
  product: ShopProduct,
  quantity = 1,
): CartItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    image: product.image,
    origin: product.origin,
    pricePerKg: product.pricePerKg,
    weightG: product.weightG,
    weightRange: product.weightRange,
    pieceWeight: product.pieceWeight,
    quantity: Math.max(1, Math.round(quantity)),
  };
}

export function cartItemWeightKg(item: Pick<CartItem, "quantity" | "weightG">) {
  return (item.quantity * item.weightG) / 1000;
}

export function cartItemUnitPrice(
  item: Pick<CartItem, "pricePerKg" | "weightG">,
) {
  return Math.round((item.weightG / 1000) * item.pricePerKg);
}

export function cartItemLineTotal(item: CartItem) {
  return Math.round(cartItemWeightKg(item) * item.pricePerKg);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + cartItemLineTotal(item), 0);
}

export function cartTotalPieces(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function deliveryFeeFor(
  subtotal: number,
  areaFee = DEFAULT_DELIVERY_FEE,
  freeThreshold = FREE_DELIVERY_THRESHOLD,
) {
  return subtotal >= freeThreshold ? 0 : areaFee;
}
