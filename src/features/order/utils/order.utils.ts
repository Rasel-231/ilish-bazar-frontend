import { formatCurrency } from "@/lib/utils";

import type { IOrder, IOrderItem } from "../types/order.types";

export const getOrderTotalItems = (order: Pick<IOrder, "items">) =>
  order.items.reduce((total, item) => total + item.quantity, 0);

export const getLineTotal = (item: Pick<IOrderItem, "unitPrice" | "quantity">) =>
  formatCurrency(Number(item.unitPrice) * item.quantity);

export const canCancelOrder = (order: Pick<IOrder, "status">) =>
  ["PENDING", "CONFIRMED"].includes(order.status);
