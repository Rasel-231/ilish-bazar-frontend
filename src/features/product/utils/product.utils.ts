import { formatCurrency } from "@/lib/utils";

import type { Product } from "../types/product.types";

export const getProductPrice = (product: Product) =>
  formatCurrency(product.price);

export const isInStock = (product: Product) => product.stock > 0;

export const getProductUnitLabel = (product: Product) =>
  product.unit.toLowerCase();
