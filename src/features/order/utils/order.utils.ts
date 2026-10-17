import { formatCurrency } from "@/lib/utils";

import type { Order, OrderItem } from "../types/order.types";

export const getOrderTotalItems = (order: Pick<Order, "items">) =>
  order.items.reduce((total, item) => total + item.quantity, 0);

export const getLineTotal = (item: Pick<OrderItem, "unitPrice" | "quantity">) =>
  formatCurrency(Number(item.unitPrice) * item.quantity);

export const canCancelOrder = (order: Pick<Order, "status">) =>
  ["PENDING", "CONFIRMED"].includes(order.status);
