"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";

import { BreadcrumbBar } from "@/components/shared/auto-breadcrumb";

/* ────────────────────────────────────────────────────────────
   ⚠️ CONTENT — নিচের সব তথ্য উদাহরণ হিসেবে দেওয়া।
   তোমার আসল পলিসি, সময়সীমা, ফোন নম্বর ও ইমেইল দিয়ে বদলে নাও।
   ──────────────────────────────────────────────────────────── */

const LAST_UPDATED = "১৬ অক্টোবর, ২০২৬";

const CONTACT = {
  phone: "+8801XXXXXXXXX",
  phoneLabel: "০১XXX-XXXXXX",
  whatsapp: "https://wa.me/8801XXXXXXXXX",
  email: "support@yourshop.com",
  hours: "প্রতিদিন সকাল ৯টা – রাত ১০টা",
};

const TOC = [
  { id: "summary", label: "এক নজরে" },
  { id: "eligibility", label: "রিফান্ডের যোগ্যতা" },
  { id: "process", label: "রিফান্ডের ধাপ" },
  { id: "methods", label: "টাকা ফেরতের মাধ্যম" },
  { id: "faq", label: "সাধারণ প্রশ্ন" },
  { id: "contact", label: "যোগাযোগ" },
];

const SUMMARY = [
  {
    icon: Clock,
    title: "২৪ ঘণ্টার মধ্যে জানান",
    text: "পণ্য হাতে পাওয়ার ২৪ ঘণ্টার মধ্যে আমাদের সমস্যার কথা জানাতে হবে।",
  },
  {
    icon: Camera,
    title: "ছবি বা ভিডিও দিন",
    text: "সমস্যাটি স্পষ্ট বোঝা যায় এমন ছবি বা ভিডিও পাঠালে যাচাই দ্রুত হয়।",
  },
  {
    icon: Wallet,
    title: "যাচাইয়ের পর রিফান্ড",
    text: "অনুমোদনের পর ৩–৫ কার্যদিবসের মধ্যে টাকা ফেরত দেওয়া হয়।",
  },
];

const ELIGIBLE = [
  "মাছ পচা, দুর্গন্ধযুক্ত বা বাসি পাওয়া গেলে",
  "অর্ডারের চেয়ে ভিন্ন সাইজ বা ভিন্ন পণ্য এলে",
  "ওজন উল্লেখযোগ্যভাবে কম হলে",
  "পরিবহনের সময় মাছ নষ্ট বা ক্ষতিগ্রস্ত হলে",
];

const NOT_ELIGIBLE = [
  "ডেলিভারির ২৪ ঘণ্টা পরে অভিযোগ করা হলে",
  "মাছ কাটা বা রান্না করার পর অভিযোগ করা হলে",
  "ভুল ঠিকানা বা বন্ধ ফোনের কারণে ডেলিভারি ব্যর্থ হলে",
  "ইলিশের স্বাদ বা তেলের পরিমাণ পছন্দ না হলে (প্রাকৃতিক ভিন্নতা)",
];

const STEPS = [
  {
    title: "আমাদের জানান",
    text: "ফোন, হোয়াটসঅ্যাপ বা ইমেইলে অর্ডার নম্বরসহ সমস্যার কথা জানান।",
  },
  {
    title: "প্রমাণ পাঠান",
    text: "মাছের অবস্থা বোঝা যায় এমন পরিষ্কার ছবি বা ছোট ভিডিও পাঠান।",
  },
  {
    title: "আমরা যাচাই করি",
    text: "আমাদের টিম ১২ ঘণ্টার মধ্যে আপনার অভিযোগ দেখে সিদ্ধান্ত জানায়।",
  },
  {
    title: "রিফান্ড বা রিপ্লেসমেন্ট",
    text: "অনুমোদনের পর আপনার পছন্দ অনুযায়ী টাকা ফেরত বা নতুন মাছ পাঠানো হয়।",
  },
];

const METHODS = [
  {
    method: "বিকাশ / নগদ",
    time: "১–২ কার্যদিবস",
    note: "অর্ডারের নম্বরে বা আপনার দেওয়া নম্বরে",
  },
  {
    method: "ব্যাংক ট্রান্সফার",
    time: "৩–৫ কার্যদিবস",
    note: "অ্যাকাউন্টের তথ্য যাচাই সাপেক্ষে",
  },
  {
    method: "স্টোর ক্রেডিট",
    time: "তাৎক্ষণিক",
    note: "পরবর্তী অর্ডারে ব্যবহার করা যাবে",
  },
];

const FAQ = [
  {
    q: "ক্যাশ অন ডেলিভারিতে অর্ডার করলে রিফান্ড কীভাবে পাব?",
    a: "ক্যাশ অন ডেলিভারির ক্ষেত্রে আপনার বিকাশ বা নগদ নম্বরে টাকা ফেরত পাঠানো হয়। অনুমোদনের সময় আমরা নম্বরটি নিশ্চিত করে নিই।",
  },
  {
    q: "মাছ হাতে পেয়ে কী করা উচিত?",
    a: "মাছ নেওয়ার সময়ই দেখে নিন। কোনো সমস্যা থাকলে প্যাকেট খোলা অবস্থায় ছবি তুলে রাখুন এবং দ্রুত আমাদের জানান।",
  },
  {
    q: "রিফান্ডের বদলে নতুন মাছ নিতে পারি?",
    a: "হ্যাঁ। অভিযোগ অনুমোদিত হলে আপনি রিফান্ড অথবা একই সাইজের মাছ রিপ্লেসমেন্ট, যেকোনো একটি বেছে নিতে পারবেন।",
  },
  {
    q: "আংশিক সমস্যা থাকলে কি পুরো টাকা ফেরত পাব?",
    a: "না, সমস্যাযুক্ত অংশের মূল্য অনুযায়ী আংশিক রিফান্ড দেওয়া হয়। যাচাইয়ের সময় আমরা হিসাবটি আপনাকে জানাই।",
  },
  {
    q: "ডেলিভারি চার্জ কি ফেরত দেওয়া হয়?",
    a: "আমাদের ভুলের কারণে (পচা, ভুল পণ্য বা কম ওজন) রিফান্ড হলে ডেলিভারি চার্জসহ ফেরত দেওয়া হয়।",
  },
];

/* ──────────────────────────── UI ──────────────────────────── */

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-black tracking-tight text-navy sm:text-2xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function RefundPolicyPage() {
  const active = useActiveSection(TOC.map((t) => t.id));

  return (
    <main className="bg-background text-foreground">
      <BreadcrumbBar />

      {/* ───────── Hero ───────── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-primary/80">
        <div
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/40 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              রিফান্ড ও রিটার্ন পলিসি
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
              মাছ তাজা ও ঠিকঠাক না পেলে আমরা পাশে আছি। কীভাবে অভিযোগ জানাবেন এবং
              কত দিনে টাকা ফেরত পাবেন, সব এখানে পরিষ্কার করে লেখা আছে।
            </p>
            <p className="mt-5 text-sm text-white/60">
              সর্বশেষ হালনাগাদ: {LAST_UPDATED}
            </p>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md lg:max-w-sm">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-primary">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold text-white">তাজা না হলে টাকা ফেরত</p>
              <p className="mt-1 text-sm leading-relaxed text-white/75">
                সমস্যা আমাদের হলে ডেলিভারি চার্জসহ সম্পূর্ণ রিফান্ড অথবা নতুন
                মাছ।
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ───────── Body ───────── */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-14 lg:py-14">
        {/* Mobile nav */}
        <nav
          aria-label="পেজের সূচি"
          className="-mx-4 overflow-x-auto px-4 lg:hidden"
        >
          <ul className="flex w-max gap-2">
            {TOC.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`block rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                    active === item.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-navy hover:border-primary/50"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop sticky TOC */}
        <aside className="hidden lg:block">
          <nav aria-label="পেজের সূচি" className="sticky top-24">
            <p className="mb-3 text-sm font-bold text-navy">এই পেজে</p>
            <ul className="space-y-1 border-l border-border">
              {TOC.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors ${
                      active === item.id
                        ? "border-primary font-bold text-primary"
                        : "border-transparent text-muted-foreground hover:text-navy"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0 space-y-16">
          {/* Summary */}
          <section id="summary" className="scroll-mt-24">
            <SectionHeading
              title="এক নজরে"
              subtitle="রিফান্ড পেতে এই তিনটি বিষয় মনে রাখুন।"
            />
            <div className="grid gap-4 sm:grid-cols-3">
              {SUMMARY.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-bold text-navy">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Eligibility */}
          <section id="eligibility" className="scroll-mt-24">
            <SectionHeading
              title="রিফান্ডের যোগ্যতা"
              subtitle="কোন ক্ষেত্রে রিফান্ড পাবেন এবং কোন ক্ষেত্রে পাবেন না, তা নিচে দেওয়া হলো।"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                <h3 className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  রিফান্ড পাবেন
                </h3>
                <ul className="mt-4 space-y-3">
                  {ELIGIBLE.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-sm leading-relaxed text-foreground"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-muted/40 p-5">
                <h3 className="flex items-center gap-2 font-bold text-navy">
                  <XCircle
                    className="h-5 w-5 text-destructive"
                    aria-hidden="true"
                  />
                  রিফান্ড পাবেন না
                </h3>
                <ul className="mt-4 space-y-3">
                  {NOT_ELIGIBLE.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-sm leading-relaxed text-foreground"
                    >
                      <XCircle
                        className="mt-0.5 h-4 w-4 shrink-0 text-destructive/80"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Process — real sequence, so numbered */}
          <section id="process" className="scroll-mt-24">
            <SectionHeading
              title="রিফান্ডের ধাপ"
              subtitle="অভিযোগ জানানো থেকে টাকা ফেরত পর্যন্ত চারটি ধাপ।"
            />
            <ol className="relative space-y-6 border-l-2 border-border pl-8">
              {STEPS.map((step, index) => (
                <li key={step.title} className="relative">
                  <span className="absolute -left-[45px] grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground ring-4 ring-background">
                    {new Intl.NumberFormat("bn-BD").format(index + 1)}
                  </span>
                  <h3 className="font-bold text-navy">{step.title}</h3>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* Methods */}
          <section id="methods" className="scroll-mt-24">
            <SectionHeading
              title="টাকা ফেরতের মাধ্যম"
              subtitle="আপনার পছন্দের মাধ্যমে টাকা ফেরত দেওয়া হয়। সময় কাজের দিন হিসেবে গণনা হয়।"
            />
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-muted/60 text-navy">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-bold">
                        মাধ্যম
                      </th>
                      <th scope="col" className="px-5 py-3 font-bold">
                        সময়
                      </th>
                      <th scope="col" className="px-5 py-3 font-bold">
                        বিবরণ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {METHODS.map((row) => (
                      <tr key={row.method}>
                        <th
                          scope="row"
                          className="px-5 py-4 font-semibold text-navy"
                        >
                          {row.method}
                        </th>
                        <td className="px-5 py-4 font-semibold text-primary">
                          {row.time}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {row.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-24">
            <SectionHeading title="সাধারণ প্রশ্ন" />
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {FAQ.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-navy transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="scroll-mt-24">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy to-primary/80 p-6 sm:p-8">
              <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                রিফান্ডের জন্য যোগাযোগ করুন
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
                অর্ডার নম্বর হাতের কাছে রাখুন। আমাদের সাপোর্ট টিম{" "}
                {CONTACT.hours} আপনার জন্য আছে।
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="flex items-center gap-3 rounded-xl bg-white p-4 text-navy transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy motion-reduce:hover:translate-y-0"
                >
                  <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span>
                    <span className="block text-xs text-muted-foreground">
                      কল করুন
                    </span>
                    <span className="block text-sm font-bold">
                      {CONTACT.phoneLabel}
                    </span>
                  </span>
                </a>
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-white p-4 text-navy transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy motion-reduce:hover:translate-y-0"
                >
                  <MessageCircle
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block text-xs text-muted-foreground">
                      হোয়াটসঅ্যাপ
                    </span>
                    <span className="block text-sm font-bold">মেসেজ পাঠান</span>
                  </span>
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-3 rounded-xl bg-white p-4 text-navy transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy motion-reduce:hover:translate-y-0"
                >
                  <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-xs text-muted-foreground">
                      ইমেইল
                    </span>
                    <span className="block truncate text-sm font-bold">
                      {CONTACT.email}
                    </span>
                  </span>
                </a>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              এই পলিসি প্রয়োজনে পরিবর্তন হতে পারে। অর্ডারের সময় যে পলিসি
              কার্যকর ছিল, সেটিই আপনার ক্ষেত্রে প্রযোজ্য।{" "}
              <Link
                href="/terms"
                className="font-semibold text-primary underline-offset-2 hover:underline"
              >
                শর্তাবলী দেখুন
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default RefundPolicyPage;
