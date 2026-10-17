import type { OrderStatus, PaymentStatus, ProductUnit, UserRole } from "@/types/common.types";

export type TrendDirection = "up" | "down";

export type StatTone = "primary" | "navy" | "success" | "warning" | "danger" | "violet";

export interface StatMetric {
  id: string;
  label: string;
  /** Pre-formatted value, e.g. "৳৪,৮৫,২০০". */
  value: string;
  change: number;
  /** Whether a rising number is good (default) or bad. */
  goodWhenUp?: boolean;
  caption: string;
  tone: StatTone;
  /** Small series powering the card sparkline. */
  spark: number[];
}

export interface RevenuePoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface OrdersByStatus {
  status: OrderStatus;
  count: number;
}

export interface CategorySlice {
  label: string;
  value: number;
  color: string;
}

export interface TrafficSource {
  id: string;
  label: string;
  sessions: number;
  share: number;
  tone: StatTone;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  unit: ProductUnit;
  price: number;
  sold: number;
  revenue: number;
  stock: number;
  rating: number;
}

export interface ActivityItem {
  id: string;
  type: "order" | "payment" | "user" | "stock";
  title: string;
  description: string;
  time: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  amount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  orders: number;
  spent: number;
  isActive: boolean;
  joinedAt: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: ProductUnit;
  isActive: boolean;
  sold: number;
  rating: number;
}
