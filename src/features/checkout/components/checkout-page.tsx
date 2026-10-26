"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import {
  Banknote,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  Minus,
  PackageOpen,
  Plus,
  ShieldCheck,
  Smartphone,
  Trash2,
  Truck,
  Wallet,
} from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { ProductImage } from "@/components/shared/product-image";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  clearCart,
  removeItem,
  selectCartHydrated,
  selectCartItems,
  setItemQuantity,
} from "@/features/cart/store/cart-slice";
import {
  FREE_DELIVERY_THRESHOLD,
  cartItemFromProduct,
  cartItemLineTotal,
  cartItemUnitPrice,
  cartItemWeightKg,
  cartSubtotal,
  cartTotalPieces,
  deliveryFeeFor,
} from "@/features/cart/utils/cart.utils";
import type { ShopProduct } from "@/features/shop/types/shop.types";
import {
  formatTaka,
  fromBnNumber,
  toBnNumber,
} from "@/features/shop/utils/shop.utils";
import { useAppDispatch, useAppSelector } from "@/redux/core/hooks";

import type {
  CheckoutFormValues,
  CheckoutPaymentMethod,
  CuttingOption,
  DeliveryArea,
  DeliverySlot,
  StoredOrder,
} from "../types/checkout.types";
import {
  generateOrderNumber,
  saveStoredOrder,
} from "../utils/order-storage";
import { cn } from "@/lib/utils";

const AREAS: DeliveryArea[] = [
  { id: "dhaka-north", label: "ঢাকা (উত্তর)", fee: 80 },
  { id: "dhaka-south", label: "ঢাকা (দক্ষিণ)", fee: 80 },
  { id: "gazipur", label: "গাজীপুর", fee: 120 },
  { id: "narayanganj", label: "নারায়ণগঞ্জ", fee: 120 },
  { id: "outside-dhaka", label: "ঢাকার বাইরে", fee: 150 },
];

const SLOTS: DeliverySlot[] = [
  { value: "morning", label: "সকাল (৮টা – ১২টা)" },
  { value: "afternoon", label: "দুপুর (১২টা – ৪টা)" },
  { value: "evening", label: "সন্ধ্যা (৪টা – ৮টা)" },
];

const CUTTING_OPTIONS: CuttingOption[] = [
  { value: "whole", label: "গোটা মাছ" },
  { value: "regular", label: "রেগুলার কাটিং" },
  { value: "small", label: "ছোট টুকরা" },
];

const PAYMENT_OPTIONS: {
  value: CheckoutPaymentMethod;
  label: string;
  description: string;
  icon: typeof Wallet;
}[] = [
  {
    value: "cod",
    label: "ক্যাশ অন ডেলিভারি",
    description: "মাছ হাতে পেয়ে টাকা দিন",
    icon: Banknote,
  },
  {
    value: "bkash",
    label: "বিকাশ",
    description: "মোবাইল ব্যাংকিং",
    icon: Smartphone,
  },
  {
    value: "nagad",
    label: "নগদ",
    description: "মোবাইল ব্যাংকিং",
    icon: Smartphone,
  },
  {
    value: "card",
    label: "কার্ড পেমেন্ট",
    description: "ভিসা / মাস্টারকার্ড",
    icon: CreditCard,
  },
];

const fieldBase =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-foreground " +
  "placeholder:text-muted-foreground/70 outline-none transition " +
  "focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:opacity-60";

type CheckoutPageProps = {
  buyNowProduct?: ShopProduct;
  initialQuantity?: number;
};

export function CheckoutPage({
  buyNowProduct,
  initialQuantity = 1,
}: CheckoutPageProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cartItems = useAppSelector(selectCartItems);
  const hydrated = useAppSelector(selectCartHydrated);

  const [buyNowQuantity, setBuyNowQuantity] = useState(
    Math.max(1, Math.min(99, initialQuantity)),
  );

  const items = buyNowProduct
    ? [cartItemFromProduct(buyNowProduct, buyNowQuantity)]
    : cartItems;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      areaId: "",
      slot: "",
      address: "",
      note: "",
      cutting: "regular",
      paymentMethod: "cod",
      senderNumber: "",
      transactionId: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      agree: false,
    },
  });

  const areaId = useWatch({ control, name: "areaId" });
  const paymentMethod = useWatch({ control, name: "paymentMethod" });

  const selectedArea = AREAS.find((area) => area.id === areaId);
  const subtotal = cartSubtotal(items);
  const pieces = cartTotalPieces(items);
  const deliveryFee = selectedArea
    ? deliveryFeeFor(subtotal, selectedArea.fee)
    : 0;
  const total = subtotal + deliveryFee;
  const remaining = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);
  const progress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  const updateQuantity = (id: string, quantity: number) => {
    if (buyNowProduct) {
      setBuyNowQuantity(Math.max(1, Math.min(99, quantity)));
      return;
    }

    dispatch(setItemQuantity({ id, quantity }));
  };

  const removeFromCheckout = (id: string) => {
    if (buyNowProduct) return;
    dispatch(removeItem(id));
  };

  const onSubmit = handleSubmit(async (values) => {
    if (items.length === 0) return;

    const area = AREAS.find((item) => item.id === values.areaId);
    const slot = SLOTS.find((item) => item.value === values.slot);
    const cutting = CUTTING_OPTIONS.find(
      (item) => item.value === values.cutting,
    );
    const orderNumber = generateOrderNumber();

    const order: StoredOrder = {
      orderNumber,
      createdAt: new Date().toISOString(),
      status: "CONFIRMED",
      paymentStatus: values.paymentMethod === "cod" ? "PENDING" : "PAID",
      paymentMethod: values.paymentMethod,
      items,
      subtotal,
      deliveryFee,
      total,
      customer: {
        name: values.name.trim(),
        phone: fromBnNumber(values.phone).trim(),
        address: values.address.trim(),
        areaId: values.areaId,
        areaLabel: area?.label ?? "",
        slot: values.slot,
        slotLabel: slot?.label ?? "",
        cutting: values.cutting,
        cuttingLabel: cutting?.label ?? "",
        note: values.note.trim(),
      },
    };

    await new Promise((resolve) => setTimeout(resolve, 650));

    saveStoredOrder(order);

    if (!buyNowProduct) {
      dispatch(clearCart());
    }

    router.push(`/order-success/${order.orderNumber}`);
  });

  if (!buyNowProduct && !hydrated) {
    return (
      <div className="container-page py-10">
        <div className="h-80 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-canvas">
        <div className="container-page pb-14 pt-5 sm:pt-6">
          <Breadcrumb items={[{ label: "চেকআউট" }]} />
          <div className="mt-6">
            <EmptyState
              title="চেকআউট করার মতো কোনো পণ্য নেই"
              description="আগে কার্টে ইলিশ যোগ করুন অথবা শপ থেকে সরাসরি কিনুন।"
              action={
                <Button
                  render={<Link href="/shop" />}
                  nativeButton={false}
                  className="rounded-xl bg-primary px-5"
                >
                  <PackageOpen />
                  ইলিশ কিনুন
                </Button>
              }
            />
          </div>
        </div>
      </div>
    );
  }

  const err = (message?: string) =>
    message ? (
      <p role="alert" className="mt-1.5 text-[13px] text-destructive">
        {message}
      </p>
    ) : null;

  return (
    <div className="bg-canvas">
      <div className="container-page pb-28 pt-5 sm:pt-6 lg:pb-14">
        <Breadcrumb
          items={[
            { label: "কার্ট", href: "/cart" },
            { label: "চেকআউট" },
          ]}
        />

        <header className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              অর্ডার ও পেমেন্ট
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              মাছের বিস্তারিত দেখুন, বুকিং তথ্য দিন এবং পেমেন্ট মাধ্যম বেছে নিন।
            </p>
          </div>
          <Link
            href={buyNowProduct ? `/shop/${buyNowProduct.slug}` : "/cart"}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-navy shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ChevronDown className="size-4 rotate-90" />
            {buyNowProduct ? "পণ্যে ফিরুন" : "কার্টে ফিরুন"}
          </Link>
        </header>

        <form
          id="checkout-form"
          onSubmit={onSubmit}
          noValidate
          className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start"
        >
          <div className="space-y-5">
            {/* Fish details / items */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-navy">
                  আপনার মাছ ({toBnNumber(pieces)} পিস)
                </h2>
                {!buyNowProduct && (
                  <Link
                    href="/cart"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    কার্ট সম্পাদনা
                  </Link>
                )}
              </div>

              <ul className="mt-3 divide-y divide-slate-100">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <Link
                      href={`/shop/${item.slug}`}
                      className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-art-blue sm:size-24"
                    >
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        sizes="96px"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/shop/${item.slug}`}
                            className="line-clamp-1 text-sm font-bold text-navy hover:text-primary"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {item.origin} · {item.weightRange}
                          </p>
                          <p className="text-xs text-slate-500">
                            প্রতি পিস আনুমানিক{" "}
                            {formatTaka(cartItemUnitPrice(item))}
                          </p>
                        </div>

                        {!buyNowProduct && (
                          <button
                            type="button"
                            onClick={() => removeFromCheckout(item.id)}
                            aria-label={`${item.name} সরান`}
                            className="grid size-7 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="mt-auto flex flex-wrap items-end justify-between gap-2">
                        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            aria-label="পরিমাণ কমান"
                            className="grid size-7 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-white hover:text-navy disabled:opacity-40"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="min-w-12 text-center text-sm font-bold text-navy">
                            {toBnNumber(item.quantity)} পিস
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            aria-label="পরিমাণ বাড়ান"
                            className="grid size-7 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-white hover:text-navy"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-slate-500">
                            আনুমানিক{" "}
                            {toBnNumber(
                              Number(cartItemWeightKg(item).toFixed(2)),
                            )}{" "}
                            কেজি
                          </p>
                          <p className="text-sm font-extrabold text-navy">
                            {formatTaka(cartItemLineTotal(item))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Booking form */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-navy">
                    বুকিং ও ডেলিভারি তথ্য
                  </h2>
                  <p className="text-xs text-slate-500">
                    সঠিক তথ্য দিলে মাছ দ্রুত পৌঁছাবে
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="checkout-name" required>
                    আপনার নাম
                  </Label>
                  <input
                    id="checkout-name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    className={cn(fieldBase, errors.name && "border-destructive")}
                    {...register("name", {
                      required: "আপনার নাম লিখুন",
                      minLength: {
                        value: 3,
                        message: "কমপক্ষে ৩ অক্ষর লিখুন",
                      },
                    })}
                  />
                  {err(errors.name?.message)}
                </div>

                <div>
                  <Label htmlFor="checkout-phone" required>
                    মোবাইল নম্বর
                  </Label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={11}
                    placeholder="০১৭XXXXXXXX"
                    aria-invalid={!!errors.phone}
                    className={cn(
                      fieldBase,
                      errors.phone && "border-destructive",
                    )}
                    {...register("phone", {
                      required: "মোবাইল নম্বর লিখুন",
                      validate: (value) =>
                        /^01[3-9]\d{8}$/.test(fromBnNumber(value).trim()) ||
                        "সঠিক ১১ ডিজিটের নম্বর দিন",
                    })}
                  />
                  {err(errors.phone?.message)}
                </div>

                <div>
                  <Label htmlFor="checkout-area" required>
                    ডেলিভারি এলাকা
                  </Label>
                  <SelectWrap>
                    <select
                      id="checkout-area"
                      aria-invalid={!!errors.areaId}
                      className={cn(
                        fieldBase,
                        "appearance-none pr-10",
                        !areaId && "text-muted-foreground",
                        errors.areaId && "border-destructive",
                      )}
                      {...register("areaId", {
                        required: "এলাকা বাছুন",
                      })}
                    >
                      <option value="">এলাকা বাছুন</option>
                      {AREAS.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.label} — {formatTaka(area.fee)}
                        </option>
                      ))}
                    </select>
                  </SelectWrap>
                  {err(errors.areaId?.message)}
                </div>

                <div>
                  <Label htmlFor="checkout-slot" required>
                    ডেলিভারির সময়
                  </Label>
                  <SelectWrap>
                    <select
                      id="checkout-slot"
                      aria-invalid={!!errors.slot}
                      className={cn(
                        fieldBase,
                        "appearance-none pr-10",
                        errors.slot && "border-destructive",
                      )}
                      {...register("slot", { required: "সময় বাছুন" })}
                    >
                      <option value="">সময় বাছুন</option>
                      {SLOTS.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  </SelectWrap>
                  {err(errors.slot?.message)}
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="checkout-address" required>
                    পূর্ণ ঠিকানা
                  </Label>
                  <textarea
                    id="checkout-address"
                    rows={3}
                    autoComplete="street-address"
                    placeholder="বাসা/ফ্ল্যাট, রোড, এলাকা, ল্যান্ডমার্ক"
                    aria-invalid={!!errors.address}
                    className={cn(
                      fieldBase,
                      "h-auto resize-none py-3",
                      errors.address && "border-destructive",
                    )}
                    {...register("address", {
                      required: "পূর্ণ ঠিকানা লিখুন",
                      minLength: {
                        value: 10,
                        message: "আরও বিস্তারিত ঠিকানা দিন",
                      },
                    })}
                  />
                  {err(errors.address?.message)}
                </div>

                <div>
                  <Label htmlFor="checkout-cutting">কাটিং</Label>
                  <SelectWrap>
                    <select
                      id="checkout-cutting"
                      className={cn(fieldBase, "appearance-none pr-10")}
                      {...register("cutting")}
                    >
                      {CUTTING_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </SelectWrap>
                </div>

                <div>
                  <Label htmlFor="checkout-note">বিশেষ নির্দেশনা</Label>
                  <input
                    id="checkout-note"
                    placeholder="যেমন: ছোট টুকরা, বেল বাজাবেন না"
                    className={fieldBase}
                    {...register("note")}
                  />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Wallet className="size-4" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-navy">
                    পেমেন্ট মাধ্যম
                  </h2>
                  <p className="text-xs text-slate-500">
                    আপনার সুবিধাজনক পদ্ধতি বেছে নিন
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {PAYMENT_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const active = paymentMethod === option.value;

                  return (
                    <label
                      key={option.value}
                      htmlFor={`payment-${option.value}`}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors",
                        active
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-slate-200 bg-white hover:border-primary/30",
                      )}
                    >
                      <input
                        id={`payment-${option.value}`}
                        type="radio"
                        value={option.value}
                        className="peer sr-only"
                        {...register("paymentMethod")}
                      />
                      <span
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-lg",
                          active
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-500",
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-navy">
                          {option.label}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {option.description}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "grid size-4 shrink-0 place-items-center rounded-full border",
                          active
                            ? "border-primary bg-primary"
                            : "border-slate-300 bg-white",
                        )}
                      >
                        {active && (
                          <CheckCircle2 className="size-3.5 text-white" />
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>

              {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
                <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-sm font-semibold text-navy">
                    {paymentMethod === "bkash" ? "বিকাশ" : "নগদ"} পেমেন্ট
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    পেমেন্ট নম্বর: <strong>01604702974</strong> (Send Money)।
                    টাকা পাঠিয়ে ট্রানজেকশন আইডি নিচে লিখুন।
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="checkout-sender" required>
                        আপনার নম্বর
                      </Label>
                      <input
                        id="checkout-sender"
                        type="tel"
                        inputMode="numeric"
                        maxLength={11}
                        placeholder="০১৭XXXXXXXX"
                        aria-invalid={!!errors.senderNumber}
                        className={cn(
                          fieldBase,
                          errors.senderNumber && "border-destructive",
                        )}
                        {...register("senderNumber", {
                          validate: (value) => {
                            if (
                              paymentMethod !== "bkash" &&
                              paymentMethod !== "nagad"
                            ) {
                              return true;
                            }
                            return (
                              /^01[3-9]\d{8}$/.test(
                                fromBnNumber(value).trim(),
                              ) || "সঠিক ১১ ডিজিটের নম্বর দিন"
                            );
                          },
                        })}
                      />
                      {err(errors.senderNumber?.message)}
                    </div>

                    <div>
                      <Label htmlFor="checkout-transaction" required>
                        ট্রানজেকশন আইডি
                      </Label>
                      <input
                        id="checkout-transaction"
                        placeholder="যেমন: 9F2A7B1C"
                        aria-invalid={!!errors.transactionId}
                        className={cn(
                          fieldBase,
                          errors.transactionId && "border-destructive",
                        )}
                        {...register("transactionId", {
                          validate: (value) => {
                            if (
                              paymentMethod !== "bkash" &&
                              paymentMethod !== "nagad"
                            ) {
                              return true;
                            }
                            return (
                              (value.trim().length >= 6 &&
                                value.trim().length <= 20) ||
                              "সঠিক ট্রানজেকশন আইডি লিখুন"
                            );
                          },
                        })}
                      />
                      {err(errors.transactionId?.message)}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-sm font-semibold text-navy">
                    কার্ড পেমেন্ট (ডেমো)
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    এটি একটি মক পেমেন্ট ফর্ম। বাস্তব কার্ড নম্বর ব্যবহার করবেন না।
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor="checkout-card-number" required>
                        কার্ড নম্বর
                      </Label>
                      <input
                        id="checkout-card-number"
                        inputMode="numeric"
                        placeholder="4242 4242 4242 4242"
                        aria-invalid={!!errors.cardNumber}
                        className={cn(
                          fieldBase,
                          errors.cardNumber && "border-destructive",
                        )}
                        {...register("cardNumber", {
                          validate: (value) => {
                            if (paymentMethod !== "card") return true;
                            return (
                              /^\d{16}$/.test(value.replace(/\s/g, "")) ||
                              "১৬ ডিজিটের কার্ড নম্বর দিন"
                            );
                          },
                        })}
                      />
                      {err(errors.cardNumber?.message)}
                    </div>

                    <div>
                      <Label htmlFor="checkout-card-expiry" required>
                        মেয়াদ (MM/YY)
                      </Label>
                      <input
                        id="checkout-card-expiry"
                        placeholder="12/28"
                        maxLength={5}
                        aria-invalid={!!errors.cardExpiry}
                        className={cn(
                          fieldBase,
                          errors.cardExpiry && "border-destructive",
                        )}
                        {...register("cardExpiry", {
                          validate: (value) => {
                            if (paymentMethod !== "card") return true;
                            return (
                              /^(0[1-9]|1[0-2])\/\d{2}$/.test(value.trim()) ||
                              "MM/YY ফরম্যাটে দিন"
                            );
                          },
                        })}
                      />
                      {err(errors.cardExpiry?.message)}
                    </div>

                    <div>
                      <Label htmlFor="checkout-card-cvc" required>
                        CVC
                      </Label>
                      <input
                        id="checkout-card-cvc"
                        inputMode="numeric"
                        placeholder="123"
                        maxLength={4}
                        aria-invalid={!!errors.cardCvc}
                        className={cn(
                          fieldBase,
                          errors.cardCvc && "border-destructive",
                        )}
                        {...register("cardCvc", {
                          validate: (value) => {
                            if (paymentMethod !== "card") return true;
                            return (
                              /^\d{3,4}$/.test(value.trim()) ||
                              "৩ বা ৪ ডিজিটের CVC দিন"
                            );
                          },
                        })}
                      />
                      {err(errors.cardCvc?.message)}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground">
                  <input
                    type="checkbox"
                    className="mt-1 size-4.5 shrink-0 accent-primary"
                    aria-invalid={!!errors.agree}
                    {...register("agree", {
                      validate: (value) =>
                        value || "এগিয়ে যেতে শর্তে সম্মত হতে হবে",
                    })}
                  />
                  <span>
                    আমি{" "}
                    <Link
                      href="/terms"
                      className="font-medium text-primary underline-offset-2 hover:underline"
                    >
                      শর্তাবলী
                    </Link>{" "}
                    ও{" "}
                    <Link
                      href="/refund-policy"
                      className="font-medium text-primary underline-offset-2 hover:underline"
                    >
                      রিফান্ড নীতি
                    </Link>{" "}
                    পড়েছি এবং সম্মত।
                  </span>
                </label>
                {err(errors.agree?.message)}
              </div>
            </section>
          </div>

          {/* Summary */}
          <aside className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-base font-bold text-navy">অর্ডার সারাংশ</h2>

            <div className="mt-4 rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Truck className="size-4 text-primary" />
                {remaining === 0 ? (
                  <span className="font-semibold text-success">
                    ডেলিভারি ফ্রি পাচ্ছেন
                  </span>
                ) : (
                  <span>
                    আর <strong>{formatTaka(remaining)}</strong> যোগ করলে ডেলিভারি
                    ফ্রি
                  </span>
                )}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <dl className="mt-4 space-y-3 text-sm">
              <Row label="মোট পিস" value={`${toBnNumber(pieces)} পিস`} />
              <Row label="সাবটোটাল" value={formatTaka(subtotal)} />
              <Row
                label="ডেলিভারি"
                value={
                  !selectedArea
                    ? "এলাকা অনুযায়ী"
                    : deliveryFee === 0
                      ? "ফ্রি"
                      : formatTaka(deliveryFee)
                }
                accent={!!selectedArea && deliveryFee === 0}
              />
            </dl>

            <div className="mt-4 flex items-baseline justify-between border-t border-slate-100 pt-4">
              <span className="text-sm font-semibold text-navy">সর্বমোট</span>
              <span className="text-2xl font-extrabold text-primary">
                {formatTaka(total)}
              </span>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 hidden h-11 w-full rounded-xl text-sm font-bold shadow-sm lg:flex"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ShieldCheck className="size-4" />
              )}
              {paymentMethod === "cod" ? "অর্ডার নিশ্চিত করুন" : "পেমেন্ট ও অর্ডার"}
            </Button>

            <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-500">
              <p className="flex items-start gap-2">
                <Clock className="mt-0.5 size-3.5 shrink-0 text-primary" />
                অর্ডারের পর আমাদের প্রতিনিধি কল দিয়ে নিশ্চিত করবেন।
              </p>
              <p className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" />
                আপনার তথ্য নিরাপদে সংরক্ষণ করা হয়।
              </p>
            </div>
          </aside>

          {/* Mobile sticky CTA */}
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
            <div className="mx-auto flex max-w-xl items-center gap-4">
              <div className="leading-tight">
                <p className="text-xs text-slate-500">সর্বমোট</p>
                <p className="text-lg font-bold text-primary">
                  {formatTaka(total)}
                </p>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 flex-1 rounded-xl text-sm font-bold"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ShieldCheck className="size-4" />
                )}
                {paymentMethod === "cod"
                  ? "অর্ডার নিশ্চিত করুন"
                  : "পেমেন্ট ও অর্ডার"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-semibold text-navy"
    >
      {children}
      {required && <span className="ml-1 text-destructive">*</span>}
    </label>
  );
}

function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd
        className={cn(
          "font-semibold",
          accent ? "text-success" : "text-navy",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
