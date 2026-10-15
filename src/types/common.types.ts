export type TSortOrder = "asc" | "desc";

export type TUserRole = "USER" | "ADMIN";

export type TOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type TPaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type TPaymentMethod = "COD" | "SSLCOMMERZ" | "BKASH" | "NAGAD" | "STRIPE";

export type TProductUnit = "KG" | "GRAM" | "PIECE" | "DOZEN";

export interface IMeta {
  page: number;
  limit: number;
  total: number;
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: TSortOrder;
  searchTerm?: string;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: IMeta;
}

export interface IGenericErrorDetail {
  path: string | number;
  message: string;
}

export interface IApiError {
  success: false;
  message: string;
  statusCode?: number;
  errorDetails?: IGenericErrorDetail[];
}

export interface IPaginatedList<T> {
  data: T[];
  meta: IMeta;
}
