import type {
  IPaginationQuery,
  TOrderStatus,
  TPaymentStatus,
  TUserRole,
} from "@/types/common.types";

export interface IOrderUser {
  id: string;
  name: string;
  email: string;
  role: TUserRole;
  avatarUrl?: string | null;
}

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  unitPrice: number | string;
  quantity: number;
  lineTotal: number | string;
  createdAt: string;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  userId: string;
  status: TOrderStatus;
  paymentStatus: TPaymentStatus;
  subtotal: number | string;
  shippingFee: number | string;
  totalAmount: number | string;
  shippingAddress: string;
  phone: string;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  user: IOrderUser;
  items: IOrderItem[];
}

export interface IOrderItemPayload {
  productId: string;
  quantity: number;
}

export interface ICreateOrderPayload {
  items: IOrderItemPayload[];
  shippingAddress: string;
  phone: string;
  note?: string;
  shippingFee?: number;
}

export interface IUpdateOrderStatusPayload {
  status: TOrderStatus;
}

export interface IListOrdersQuery extends IPaginationQuery {
  status?: TOrderStatus;
  paymentStatus?: TPaymentStatus;
  userId?: string;
}
