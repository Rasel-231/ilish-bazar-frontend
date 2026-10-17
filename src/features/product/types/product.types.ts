import type { PaginationQuery, ProductUnit } from "@/types/common.types";

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  stock: number;
  unit: ProductUnit;
  imageUrl?: string | null;
  category?: string | null;
  isActive: boolean;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  unit?: ProductUnit;
  category?: string;
  isActive?: boolean;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface ListProductsQuery extends PaginationQuery {
  category?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
}
