"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Banknote,
  CheckCircle2,
  ChevronDown,
  Fish,
  Gavel,
  Mail,
  MessageCircle,
  PackageX,
  Phone,
  Scale,
  ShieldCheck,
  Truck,
  UserCheck,
} from "lucide-react";

import { BreadcrumbBar } from "@/components/shared/auto-breadcrumb";

const LAST_UPDATED = "১৬ অক্টোবর, ২০২৬";

const CONTACT = {
  phone: "01604702974",
  phoneLabel: "০১৬০৪-৭০২৯৭৪",
  whatsapp: "https://wa.me/8801604702974",
  email: "ilishsupport@gmail.com",
  hours: "প্রতিদিন সকাল ৯টা – রাত ১০টা",
};

const TOC = [
  { id: "summary", label: "এক নজরে" },
  { id: "rules", label: "যোগ্যতা ও অর্ডার" },
  { id: "payment", label: "পেমেন্ট" },
  { id: "legal", label: "আইন ও সংরক্ষণ" },
  { id: "liability", label: "দায়সীমা" },
  { id: "faq", label: "সাধারণ প্রশ্ন" },
  { id: "contact", label: "যোগাযোগ" },
];

const SUMMARY = [
  {
    icon: Banknote,
    title: "স্বচ্ছ মূল্য",
    text: "পণ্যের দাম অর্ডার করার আগেই স্ক্রিনে দেখানো হয়। কোনো লুকানো চার্জ নেই।",
  },
  {
    icon: Scale,
    title: "ওজনের ভিন্নতা",
    text: "তাজা মাছের ওজনে স্বাভাবিক ভিন্নতা থাকতে পারে, যা প্রকাশ্যে গ্রহণযোগ্য।",
  },
  {
    icon: ShieldCheck,
    title: "সহায়তা সবসময়",
    text: "অর্ডার নিয়ে যেকোনো প্রশ্নে ফোন, হোয়াটসঅ্যাপ বা ইমেইলে আমরা পাশে আছি।",
  },
];

const RULES = [
  {
    icon: UserCheck,
    title: "বয়স ও দায়িত্ব",
    text: "আমাদের ওয়েবসাইট ব্যবহার ও অর্ডার করতে হলে আপনার কমপক্ষে ১৮ বছর বয়স হতে হবে। আপনার যদি এই শর্তাবলী মেনা না হয়, তাহলে অনুরোধ করছি সাইট ব্যবহার করবেন না।",
  },
  {
    icon: Banknote,
    title: "অর্ডার ও মূল্য",
    text: "সব দাম বাংলাদেশি টাকায় (৳) এবং ডেলিভারি চার্জসহ দেখানো হয়। মূল্য যেকোনো সময় পরিবর্তন হতে পারে, তবে আপনার অর্ডার নিশ্চিত হওয়ার পর সেই সময়ের দামই কার্যকর থাকবে। কোনো পণ্যের দাম ভুল থাকলে আমরা অর্ডার বাতিল করে টাকা ফেরত দিতে পারি।",
  },
  {
    icon: Truck,
    title: "ডেলিভারি",
    text: "ঢাকাসহ সারা দেশে ডেলিভারি দেওয়া হয়। ৩০০০ টাকার উপরে অর্ডারে ডেলিভারি চার্জ ফ্রি। রাত ১০টার পরের অর্ডার পরের দিন প্রসেস হয়। ঠিকানা বা ফোন ভুল থাকলে ডেলিভারি বিলম্বিত বা ব্যর্থ হতে পারে, যার দায়িত্ব ক্রেতার।",
  },
  {
    icon: Fish,
    title: "পণ্য ও তাজাত্ব",
    text: "আমরা সরাসরি জেলে ও আড়ত থেকে তাজা ইলিশ সংগ্রহ করি। মাছের রং, তেল ও স্বাদ ঋতু ও উৎস অনুযায়ী সামান্য ভিন্ন হতে পারে — এটি প্রাকৃতিক বৈশিষ্ট্য, ত্রুটি নয়।",
  },
  {
    icon: PackageX,
    title: "বাতিল ও পরিবর্তন",
    text: "অর্ডার নিশ্চিত হওয়ার আগে আপনি বাতিল করতে পারবেন। পাঠানোর পরে বাতিল করতে চাইলে ডেলিভারি চার্জ কেটে টাকা ফেরত দেওয়া হতে পারে। রিফান্ডের নিয়ম আলাদা পাতায় দেখুন।",
  },
  {
    icon: Gavel,
    title: "আইন ও সংরক্ষণ",
    text: "মা ইলিশ ও জাটকা সংরক্ষণের সরকারি নিয়ম মেনেই আমরা কেনাকাটা করি ও পাঠাই। নিষিদ্ধ মাপের মাছ বিক্রি বা পরিবহন করা হয় না।",
  },
];

const PAYMENT_METHODS = [
  {
    method: "ক্যাশ অন ডেলিভারি",
    note: "মাছ হাতে পেয়ে টাকা দিন। ঢাকার ভিতরে এবং বাইরে উপলব্ধ।",
  },
  {
    method: "বিকাশ / নগদ",
    note: "অগ্রিম পেমেন্ট করলে অর্ডার দ্রুত প্রসেস হয়।",
  },
  {
    method: "ব্যাংক ট্রান্সফার",
    note: "বড় অর্ডারের জন্য; স্লিপ পাঠালে যাচাই করে অর্ডার নিশ্চিত হয়।",
  },
];

const FAQ = [
  {
    q: "অর্ডার করার পর কনফার্মেশন কীভাবে পাব?",
    a: "অর্ডার দেওয়ার পর আপনার ফোনে SMS বা হোয়াটসঅ্যাপে কনফার্মেশন মেসেজ আসে। না এলে সরাসরি আমাদের ফোন করুন।",
  },
  {
    q: "কি আমি অর্ডারের পর ঠিকানা বদলাতে পারি?",
    a: "অর্ডার পাঠানোর আগে হোয়াটসঅ্যাপে জানালে ঠিকানা সংশোধন করা যায়। পাঠানোর পর সংশোধন করা যেতে পারে না।",
  },
  {
    q: "পেমেন্ট করা টাকা কি নিরাপদ?",
    a: "হ্যাঁ। আমরা শুধু বিকাশ, নগদ বা ব্যাংকের অফিসিয়াল নম্বরে পেমেন্ট চাই। অন্য কাউকে টাকা পাঠাবেন না।",
  },
  {
    q: "রিফান্ড পলিসি কোথায় দেখব?",
    a: "তাজা মাছে কোনো সমস্যা পেলে ২৪ ঘণ্টার মধ্যে জানালে রিফান্ড বা রিপ্লেসমেন্ট পাবেন। বিস্তারিত আমাদের রিফান্ড পলিসি পাতায় দেখুন।",
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

export function TermsPage() {
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
              ব্যবহারের শর্তাবলী
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
              ইলিশ বাজার থেকে কেনাকাটা করার আগে এই শর্তাবলী পড়ে নিন। সাইট
              ব্যবহার বা অর্ডার করার মাধ্যমে আপনি এগুলো মেনে নিচ্ছেন।
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
              <p className="font-bold text-white">সহজ ও স্বচ্ছ নিয়ম</p>
              <p className="mt-1 text-sm leading-relaxed text-white/75">
                অর্ডার, পেমেন্ট ও ডেলিভারির নিয়ম সহজ ভাষায় লেখা। কোনো বিষয়ে
                সন্দেহ থাকলে আমাদের জিজ্ঞাসা করুন।
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
              subtitle="ইলিশ বাজার ব্যবহারের তিনটি মূল কথা।"
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

          {/* Main rules */}
          <section id="rules" className="scroll-mt-24">
            <SectionHeading
              title="যোগ্যতা, অর্ডার ও প্রসেস"
              subtitle="অ্যাকাউন্ট থেকে ডেলিভারি পর্যন্ত প্রতিটি ধাপের নিয়ম।"
            />
            <div className="space-y-4">
              {RULES.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-card p-5 sm:p-6"
                >
                  <h3 className="flex items-center gap-2.5 font-bold text-navy">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-primary">
                      <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    {title}
                  </h3>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section id="payment" className="scroll-mt-24">
            <SectionHeading
              title="পেমেন্ট"
              subtitle="নিরাপদ পেমেন্টের তিনটি উপায়। কখনও ব্যক্তিগত নম্বরে টাকা পাঠাবেন না।"
            />
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="bg-muted/60 text-navy">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-bold">
                        মাধ্যম
                      </th>
                      <th scope="col" className="px-5 py-3 font-bold">
                        বিবরণ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {PAYMENT_METHODS.map((row) => (
                      <tr key={row.method}>
                        <th
                          scope="row"
                          className="px-5 py-4 font-semibold text-navy"
                        >
                          {row.method}
                        </th>
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

          {/* Legal */}
          <section id="legal" className="scroll-mt-24">
            <SectionHeading
              title="আইন ও সংরক্ষণ"
              subtitle="সরকারি নিয়ম মেনেই আমরা ব্যবসা করি।"
            />
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 sm:p-6 dark:border-emerald-500/30 dark:bg-emerald-500/10">
              <ul className="space-y-3">
                {[
                  "মা ইলিশ ও জাটকা সংরক্ষণের সরকারি নিয়ম অনুযায়ী নিষিদ্ধ মাপের মাছ বিক্রি বা পরিবহন করা হয় না।",
                  "ক্রেতা হিসেবে আপনি নিশ্চিত করবেন যে অর্ডার করা পণ্য ব্যক্তিগত ব্যবহারের জন্য; পুনঃবিক্রয়ের জন্য একাধিক অর্ডার করলে আমরা অর্ডার বাতিল করতে পারি।",
                  "ওয়েবসাইটের কনটেন্ট, লোগো ও ছবি ইলিশ বাজারের সম্পত্তি; অনুমতি ছাড়া ব্যবহার বেআইনি।",
                  "যেকোনো বিরোধের ক্ষেত্রে বাংলাদেশের আইন প্রযোজ্য হবে এবং ঢাকার আদালতের একচেটিয়া এখতিয়ার থাকবে।",
                ].map((item) => (
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
          </section>

          {/* Liability */}
          <section id="liability" className="scroll-mt-24">
            <SectionHeading title="দায়সীমা" />
            <div className="rounded-2xl border border-border bg-muted/40 p-5 sm:p-6">
              <ul className="space-y-3">
                {[
                  "প্রাকৃতিক দুর্যোগ, ট্রাফিক জ্যাম বা কুরিয়ার/ট্রান্সপোর্ট সমস্যার কারণে ডেলিভারি বিলম্বিত হলে আমাদের সর্বোচ্চ দায়িত্ব হবে বিকল্প পণ্য বা টাকা ফেরত — ক্ষতিপূরণ নয়।",
                  "ইন্টারনেট বা সার্ভার সমস্যার কারণে অর্ডার ব্যর্থ হলে পেমেন্ট করা টাকা ফেরত দেওয়া হবে।",
                  "পণ্যের মান নিয়ে অভিযোগ থাকলে রিফান্ড পলিসি অনুযায়ী ২৪ ঘণ্টার মধ্যে জানালে সমাধান নিশ্চিত করা হবে।",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-sm leading-relaxed text-foreground"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
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
                শর্তাবলী নিয়ে প্রশ্ন আছে?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
                যেকোনো বিষয়ে আমাদের জিজ্ঞাসা করুন। আমাদের সাপোর্ট টিম{" "}
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
              এই শর্তাবলী প্রয়োজনে পরিবর্তন হতে পারে। অর্ডারের সময় যে
              শর্তাবলী কার্যকর ছিল, সেটিই আপনার ক্ষেত্রে প্রযোজ্য।{" "}
              <Link
                href="/refund-policy"
                className="font-semibold text-primary underline-offset-2 hover:underline"
              >
                রিফান্ড পলিসি দেখুন
              </Link>{" "}
              অথবা{" "}
              <Link
                href="/privacy"
                className="font-semibold text-primary underline-offset-2 hover:underline"
              >
                গোপনীয়তা নীতি দেখুন
              </Link>
              ।
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default TermsPage;
