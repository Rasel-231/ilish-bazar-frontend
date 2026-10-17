import type {
  OrderStatus,
  PaginationQuery,
  PaymentMethod,
  PaymentStatus,
  UserRole,
} from "@/types/common.types";

export interface OrderUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  /** Optional thumbnail shown in order lists. */
  productImage?: string | null;
  /** Optional product slug for linking back to the product page. */
  productSlug?: string | null;
  unitPrice: number | string;
  quantity: number;
  lineTotal: number | string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  subtotal: number | string;
  shippingFee: number | string;
  totalAmount: number | string;
  shippingAddress: string;
  phone: string;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  user: OrderUser;
  items: OrderItem[];
}

export interface OrderItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
  shippingAddress: string;
  phone: string;
  note?: string;
  shippingFee?: number;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

export interface ListOrdersQuery extends PaginationQuery {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  userId?: string;
}
