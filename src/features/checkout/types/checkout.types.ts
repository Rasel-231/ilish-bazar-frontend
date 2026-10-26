import type { CartItem } from "@/features/cart/types/cart.types";
import type { PaymentStatus } from "@/types/common.types";

export type CheckoutPaymentMethod = "cod" | "bkash" | "nagad" | "card";

export type DeliveryArea = {
  id: string;
  label: string;
  fee: number;
};

export type DeliverySlot = {
  value: string;
  label: string;
};

export type CuttingOption = {
  value: string;
  label: string;
};

export type CheckoutFormValues = {
  name: string;
  phone: string;
  areaId: string;
  slot: string;
  address: string;
  note: string;
  cutting: string;
  paymentMethod: CheckoutPaymentMethod;
  senderNumber: string;
  transactionId: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  agree: boolean;
};

export type StoredOrder = {
  orderNumber: string;
  createdAt: string;
  status: "CONFIRMED";
  paymentStatus: PaymentStatus;
  paymentMethod: CheckoutPaymentMethod;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: {
    name: string;
    phone: string;
    address: string;
    areaId: string;
    areaLabel: string;
    slot: string;
    slotLabel: string;
    cutting: string;
    cuttingLabel: string;
    note: string;
  };
};
