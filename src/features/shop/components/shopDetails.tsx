"use client";

import { useId, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  CalendarClock,
  ChevronDown,
  Loader2,
  Minus,
  Plus,
  Truck,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types & defaults                                                    */
/* ------------------------------------------------------------------ */

export type DeliveryArea = { id: string; label: string; fee: number };
export type Option = { value: string; label: string };

export type IlishProduct = {
  name: string; // e.g. "মাওয়ার ইলিশ"
  weightPerPieceGram: number; // e.g. 800
  pricePerKg: number; // e.g. 1650
  sizeLabel?: string; // e.g. "৭০০–৯০০ গ্রাম"
  image?: string; // optional thumbnail (any URL / static import src)
};

export type BookingValues = {
  pieces: number;
  cutting: string;
  name: string;
  phone: string;
  areaId: string;
  slot: string;
  address: string;
  note: string;
  agree: boolean;
};

export type BookingPayload = BookingValues & {
  estimatedWeightKg: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
};

type Props = {
  product: IlishProduct;
  initialPieces?: number;
  launchDateLabel?: string; // e.g. "শুক্রবার ৩০ অক্টোবর"
  freeDeliveryThreshold?: number;
  areas?: DeliveryArea[];
  slots?: Option[];
  cuttingOptions?: Option[];
  maxPieces?: number;
  onSubmit: (payload: BookingPayload) => void | Promise<void>;
  termsHref?: string;
  refundHref?: string;
};

const DEFAULT_AREAS: DeliveryArea[] = [
  { id: "dhaka-north", label: "ঢাকা (উত্তর)", fee: 100 },
  { id: "dhaka-south", label: "ঢাকা (দক্ষিণ)", fee: 100 },
  { id: "gazipur", label: "গাজীপুর", fee: 150 },
  { id: "narayanganj", label: "নারায়ণগঞ্জ", fee: 150 },
];

const DEFAULT_SLOTS: Option[] = [
  { value: "morning", label: "সকাল (৮টা – ১২টা)" },
  { value: "afternoon", label: "দুপুর (১২টা – ৪টা)" },
  { value: "evening", label: "সন্ধ্যা (৪টা – ৮টা)" },
];

const DEFAULT_CUTTING: Option[] = [
  { value: "whole", label: "গোটা মাছ" },
  { value: "regular", label: "রেগুলার কাটিং" },
  { value: "small", label: "ছোট টুকরা" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBn = (v: number | string) =>
  String(v).replace(/\d/g, (d) => BN[Number(d)]);
const fromBn = (v: string) => v.replace(/[০-৯]/g, (d) => String(BN.indexOf(d)));

const taka = (n: number) => `৳${toBn(n.toLocaleString("en-IN"))}`;
const kg = (n: number) => `${toBn(Number(n.toFixed(2)))} কেজি`;

const join = (...c: Array<string | false | undefined>) =>
  c.filter(Boolean).join(" ");

const fieldBase =
  "h-12 w-full rounded-xl border bg-white px-4 text-[15px] text-foreground " +
  "placeholder:text-muted-foreground/70 outline-none transition " +
  "focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:opacity-60";

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function IlishBookingForm({
  product,
  initialPieces = 2,
  launchDateLabel,
  freeDeliveryThreshold = 5000,
  areas = DEFAULT_AREAS,
  slots = DEFAULT_SLOTS,
  cuttingOptions = DEFAULT_CUTTING,
  maxPieces = 20,
  onSubmit,
  termsHref = "/terms",
  refundHref = "/refund-policy",
}: Props) {
  const formId = useId();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingValues>({
    mode: "onTouched",
    defaultValues: {
      pieces: Math.min(Math.max(initialPieces, 1), maxPieces),
      cutting: cuttingOptions[0]?.value ?? "",
      name: "",
      phone: "",
      areaId: "",
      slot: "",
      address: "",
      note: "",
      agree: false,
    },
  });

  const pieces = watch("pieces");
  const areaId = watch("areaId");

  /* ---- pricing ---- */
  const calc = useMemo(() => {
    const weightKg = (pieces * product.weightPerPieceGram) / 1000;
    const subtotal = Math.round(weightKg * product.pricePerKg);
    const area = areas.find((a) => a.id === areaId);
    const free = subtotal >= freeDeliveryThreshold;
    const deliveryFee = area ? (free ? 0 : area.fee) : 0;
    return {
      weightKg,
      subtotal,
      area,
      free,
      deliveryFee,
      total: subtotal + deliveryFee,
      remaining: Math.max(freeDeliveryThreshold - subtotal, 0),
      progress: Math.min((subtotal / freeDeliveryThreshold) * 100, 100),
    };
  }, [pieces, product, areas, areaId, freeDeliveryThreshold]);

  const setPieces = (n: number) =>
    setValue("pieces", Math.min(Math.max(n, 1), maxPieces), {
      shouldDirty: true,
    });

  const submit = handleSubmit(async (values) => {
    await onSubmit({
      ...values,
      phone: fromBn(values.phone).trim(),
      estimatedWeightKg: calc.weightKg,
      subtotal: calc.subtotal,
      deliveryFee: calc.deliveryFee,
      total: calc.total,
    });
  });

  const err = (msg?: string) =>
    msg ? (
      <p role="alert" className="mt-1.5 text-[13px] text-destructive">
        {msg}
      </p>
    ) : null;

  return (
    <section className="container-page pb-28 pt-6 lg:pb-14 lg:pt-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-8">
        {/* ============================ FORM ============================ */}
        <form
          id={formId}
          onSubmit={submit}
          noValidate
          className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7"
        >
          {/* Product header */}
          <div className="flex items-center gap-4 border-b pb-5">
            <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-art-blue sm:size-20">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt={product.name}
                  className="size-full object-cover"
                />
              ) : (
                <FishMark />
              )}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-navy sm:text-2xl">
                {product.name}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {taka(product.pricePerKg)} / কেজি ·{" "}
                {product.sizeLabel ??
                  `প্রতি পিস ${toBn(product.weightPerPieceGram)} গ্রাম`}
              </p>
            </div>
          </div>

          {/* Quantity + cutting */}
          <div className="grid gap-5 pt-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-navy">
                পরিমাণ (পিস)
              </label>
              <Controller
                control={control}
                name="pieces"
                render={({ field }) => (
                  <div className="inline-flex h-12 items-stretch overflow-hidden rounded-xl border bg-white">
                    <button
                      type="button"
                      aria-label="এক পিস কমান"
                      onClick={() => setPieces(field.value - 1)}
                      disabled={field.value <= 1}
                      className="grid w-12 place-items-center bg-secondary/70 text-navy transition hover:bg-secondary disabled:opacity-40"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span
                      aria-live="polite"
                      className="grid min-w-20 place-items-center px-3 text-[15px] font-semibold text-navy"
                    >
                      {toBn(field.value)} পিস
                    </span>
                    <button
                      type="button"
                      aria-label="এক পিস বাড়ান"
                      onClick={() => setPieces(field.value + 1)}
                      disabled={field.value >= maxPieces}
                      className="grid w-12 place-items-center bg-secondary/70 text-navy transition hover:bg-secondary disabled:opacity-40"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                )}
              />
            </div>

            <div>
              <label
                htmlFor={`${formId}-cutting`}
                className="mb-2 block text-sm font-semibold text-navy"
              >
                কাটিং
              </label>
              <SelectWrap>
                <select
                  id={`${formId}-cutting`}
                  className={join(fieldBase, "appearance-none pr-10")}
                  {...register("cutting")}
                >
                  {cuttingOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </SelectWrap>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            আনুমানিক {kg(calc.weightKg)} · {toBn(pieces)} পিস
          </p>

          <hr className="my-6" />

          {/* Contact */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor={`${formId}-name`} required>
                আপনার নাম
              </Label>
              <input
                id={`${formId}-name`}
                autoComplete="name"
                aria-invalid={!!errors.name}
                className={join(fieldBase, errors.name && "border-destructive")}
                {...register("name", {
                  required: "আপনার নাম লিখুন",
                  minLength: { value: 3, message: "কমপক্ষে ৩ অক্ষর লিখুন" },
                })}
              />
              {err(errors.name?.message)}
            </div>

            <div>
              <Label htmlFor={`${formId}-phone`} required>
                মোবাইল নম্বর
              </Label>
              <input
                id={`${formId}-phone`}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={11}
                placeholder="০১৭XXXXXXXX"
                aria-invalid={!!errors.phone}
                className={join(
                  fieldBase,
                  errors.phone && "border-destructive",
                )}
                {...register("phone", {
                  required: "মোবাইল নম্বর লিখুন",
                  validate: (v) =>
                    /^01[3-9]\d{8}$/.test(fromBn(v).trim()) ||
                    "সঠিক ১১ ডিজিটের নম্বর দিন",
                })}
              />
              {errors.phone ? (
                err(errors.phone.message)
              ) : (
                <p className="mt-1.5 text-[13px] text-muted-foreground">
                  ১১ ডিজিট, যেমন ০১৭XXXXXXXX
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={`${formId}-area`} required>
                ডেলিভারি এলাকা
              </Label>
              <SelectWrap>
                <select
                  id={`${formId}-area`}
                  aria-invalid={!!errors.areaId}
                  className={join(
                    fieldBase,
                    "appearance-none pr-10",
                    !areaId && "text-muted-foreground",
                    errors.areaId && "border-destructive",
                  )}
                  {...register("areaId", { required: "এলাকা বাছুন" })}
                >
                  <option value="">এলাকা বাছুন</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </SelectWrap>
              {err(errors.areaId?.message)}
            </div>

            <div>
              <Label htmlFor={`${formId}-slot`} required>
                ডেলিভারির সময়
              </Label>
              <SelectWrap>
                <select
                  id={`${formId}-slot`}
                  aria-invalid={!!errors.slot}
                  defaultValue=""
                  className={join(
                    fieldBase,
                    "appearance-none pr-10",
                    !watch("slot") && "text-muted-foreground",
                    errors.slot && "border-destructive",
                  )}
                  {...register("slot", { required: "সময় বাছুন" })}
                >
                  <option value="">সময় বাছুন</option>
                  {slots.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </SelectWrap>
              {err(errors.slot?.message)}
            </div>
          </div>

          <div className="mt-5">
            <Label htmlFor={`${formId}-address`} required>
              পূর্ণ ঠিকানা (লোকেশন)
            </Label>
            <textarea
              id={`${formId}-address`}
              rows={3}
              autoComplete="street-address"
              placeholder="বাসা/ফ্ল্যাট, রোড, এলাকা, ল্যান্ডমার্ক"
              aria-invalid={!!errors.address}
              className={join(
                fieldBase,
                "h-auto resize-none py-3",
                errors.address && "border-destructive",
              )}
              {...register("address", {
                required: "পূর্ণ ঠিকানা লিখুন",
                minLength: { value: 10, message: "আরও বিস্তারিত ঠিকানা দিন" },
              })}
            />
            {err(errors.address?.message)}
          </div>

          <div className="mt-5">
            <Label htmlFor={`${formId}-note`}>বিশেষ নির্দেশনা (ঐচ্ছিক)</Label>
            <input
              id={`${formId}-note`}
              placeholder="যেমন: কাটা ছোট টুকরা, বেল বাজাবেন না"
              className={fieldBase}
              {...register("note")}
            />
          </div>

          {launchDateLabel && (
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-accent px-4 py-3 text-sm text-accent-foreground">
              <CalendarClock className="mt-0.5 size-4 shrink-0" />
              <p>
                চালু হওয়ার তারিখ:{" "}
                <strong className="font-semibold text-navy">
                  {launchDateLabel}
                </strong>
              </p>
            </div>
          )}

          <div className="mt-5">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground">
              <input
                type="checkbox"
                className="mt-1 size-4.5 shrink-0 accent-primary"
                aria-invalid={!!errors.agree}
                {...register("agree", {
                  validate: (v) => v || "এগিয়ে যেতে শর্তে সম্মত হতে হবে",
                })}
              />
              <span>
                আমি{" "}
                <a
                  href={termsHref}
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  শর্তাবলী
                </a>{" "}
                ও{" "}
                <a
                  href={refundHref}
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  রিফান্ড নীতি
                </a>{" "}
                পড়েছি এবং সম্মত।
              </span>
            </label>
            {err(errors.agree?.message)}
          </div>
        </form>

        {/* ============================ SUMMARY ============================ */}
        <aside className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
          <h2 className="text-base font-bold text-navy">অর্ডারের সারাংশ</h2>

          {/* Free-delivery progress */}
          <div className="mt-4">
            <div className="flex items-center gap-2 text-[13px] text-foreground">
              <Truck className="size-4 text-primary" />
              {calc.free ? (
                <span className="font-medium text-success">
                  ডেলিভারি ফ্রি পাচ্ছেন
                </span>
              ) : (
                <span>
                  আর <strong>{taka(calc.remaining)}</strong> যোগ করলে ডেলিভারি
                  ফ্রি
                </span>
              )}
            </div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(calc.progress)}
              className="mt-2 h-2 overflow-hidden rounded-full bg-secondary"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500"
                style={{ width: `${calc.progress}%` }}
              />
            </div>
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <Row label="আনুমানিক ওজন" value={kg(calc.weightKg)} />
            <Row label="সাবটোটাল" value={taka(calc.subtotal)} />
            <Row
              label="ডেলিভারি"
              value={
                !calc.area
                  ? "এলাকা অনুযায়ী"
                  : calc.free
                    ? "ফ্রি"
                    : taka(calc.deliveryFee)
              }
              accent={calc.free && !!calc.area}
            />
          </dl>

          <div className="mt-4 flex items-baseline justify-between border-t pt-4">
            <span className="text-sm font-semibold text-navy">মোট</span>
            <span className="text-2xl font-bold text-primary">
              {taka(calc.total)}
            </span>
          </div>

          {/* Desktop CTA */}
          <button
            type="submit"
            form={formId}
            disabled={isSubmitting}
            className="mt-5 hidden h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[15px] font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:scale-[0.99] disabled:opacity-70 lg:flex"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            আগাম তালিকায় নাম লেখান
          </button>

          <p className="mt-3 hidden text-center text-xs text-muted-foreground lg:block">
            এখন কোনো পেমেন্ট লাগবে না
          </p>
        </aside>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-white/95 px-4 py-3 backdrop-blur lg:hidden no-print">
        <div className="mx-auto flex max-w-xl items-center gap-4">
          <div className="leading-tight">
            <p className="text-xs text-muted-foreground">মোট</p>
            <p className="text-lg font-bold text-primary">{taka(calc.total)}</p>
          </div>
          <button
            type="submit"
            form={formId}
            disabled={isSubmitting}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-[15px] font-semibold text-primary-foreground transition active:scale-[0.99] disabled:opacity-70"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            আগাম তালিকায় নাম লেখান
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

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
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
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
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={join(
          "font-medium",
          accent ? "text-success" : "text-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function FishMark() {
  return (
    <svg viewBox="0 0 64 40" className="w-10 text-primary/70" aria-hidden>
      <path
        fill="currentColor"
        d="M4 20C14 6 34 4 46 18l14-12v28L46 22C34 36 14 34 4 20Z"
      />
      <circle cx="16" cy="18" r="2" fill="#fff" />
    </svg>
  );
}
