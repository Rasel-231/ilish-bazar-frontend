import type {
  IPaginationQuery,
  TProductUnit,
} from "@/types/common.types";

export interface IProduct {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  stock: number;
  unit: TProductUnit;
  imageUrl?: string | null;
  category?: string | null;
  isActive: boolean;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateProductPayload {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  unit?: TProductUnit;
  category?: string;
  isActive?: boolean;
}

export type IUpdateProductPayload = Partial<ICreateProductPayload>;

export interface IListProductsQuery extends IPaginationQuery {
  category?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
}
