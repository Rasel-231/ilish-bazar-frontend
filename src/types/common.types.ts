export type SortOrder = "asc" | "desc";

export type UserRole = "USER" | "ADMIN";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethod = "COD" | "SSLCOMMERZ" | "BKASH" | "NAGAD" | "STRIPE";

export type ProductUnit = "KG" | "GRAM" | "PIECE" | "DOZEN";

export interface Meta {
  page: number;
  limit: number;
  total: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  searchTerm?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Meta;
}

export interface GenericErrorDetail {
  path: string | number;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode?: number;
  errorDetails?: GenericErrorDetail[];
}

export interface PaginatedList<T> {
  data: T[];
  meta: Meta;
}
