import type {
  Order,
  OrderItem,
} from "@/features/order/types/order.types";
import type { PaymentMethod } from "@/types/common.types";

import type {
  CheckoutPaymentMethod,
  StoredOrder,
} from "../types/checkout.types";

export const ORDERS_STORAGE_KEY = "ilish-bazar-orders-v1";

const PAYMENT_METHOD_MAP: Record<CheckoutPaymentMethod, PaymentMethod> = {
  cod: "COD",
  bkash: "BKASH",
  nagad: "NAGAD",
  card: "SSLCOMMERZ",
};

export function generateOrderNumber() {
  const year = new Date().getFullYear();
  const suffix = String(Date.now()).slice(-6);
  return `IB-${year}-${suffix}`;
}

export function readStoredOrders(): StoredOrder[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as StoredOrder[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredOrder(order: StoredOrder) {
  if (typeof window === "undefined") return;

  try {
    const existing = readStoredOrders().filter(
      (item) => item.orderNumber !== order.orderNumber,
    );
    window.localStorage.setItem(
      ORDERS_STORAGE_KEY,
      JSON.stringify([order, ...existing]),
    );
  } catch {
    // Ignore storage failures — the success page still gets the order via state.
  }
}

export function findStoredOrder(orderNumber: string) {
  return readStoredOrders().find((order) => order.orderNumber === orderNumber);
}

/** Convert a locally placed mock order into the shared Order shape. */
export function storedOrderToOrder(order: StoredOrder): Order {
  const items: OrderItem[] = order.items.map((item, index) => {
    const unitPrice = Math.round((item.weightG / 1000) * item.pricePerKg);
    const lineTotal = Math.round(
      (item.weightG / 1000) * item.pricePerKg * item.quantity,
    );

    return {
      id: `${order.orderNumber}-${index}`,
      orderId: order.orderNumber,
      productId: item.id,
      productName: item.name,
      productImage: item.image,
      productSlug: item.slug,
      unitPrice,
      quantity: item.quantity,
      lineTotal,
      createdAt: order.createdAt,
    };
  });

  return {
    id: order.orderNumber,
    orderNumber: order.orderNumber,
    userId: "local-user",
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: PAYMENT_METHOD_MAP[order.paymentMethod],
    subtotal: order.subtotal,
    shippingFee: order.deliveryFee,
    totalAmount: order.total,
    shippingAddress: `${order.customer.address}, ${order.customer.areaLabel}`,
    phone: order.customer.phone,
    note: [order.customer.note, order.customer.slotLabel]
      .filter(Boolean)
      .join(" · "),
    createdAt: order.createdAt,
    updatedAt: order.createdAt,
    user: {
      id: "local-user",
      name: order.customer.name,
      email: "guest@ilishbazar.local",
      role: "USER",
      avatarUrl: null,
    },
    items,
  };
}
