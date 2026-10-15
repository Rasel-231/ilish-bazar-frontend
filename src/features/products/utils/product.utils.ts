import { formatCurrency } from "@/lib/utils";

import type { IProduct } from "../types/product.types";

export const getProductPrice = (product: IProduct) =>
  formatCurrency(product.price);

export const isInStock = (product: IProduct) => product.stock > 0;

export const getProductUnitLabel = (product: IProduct) =>
  product.unit.toLowerCase();
