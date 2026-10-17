import Link from "next/link";
import { Clock, Fish, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Config – edit these values                                                */
/* -------------------------------------------------------------------------- */

const SITE_NAME = "ইলিশ বাজার";
const TAGLINE = "নদীর তাজা ইলিশ, সরাসরি জেলে ও আড়ত থেকে আপনার ঘরে পৌঁছে দিই।";

const CONTACT = {
  phone: "01604702974",
  email: "ilishsupport@gmail.com", // TODO: আপনার ইমেইল দিন
  address: "বাংলাদেশ",
  cutoff: "অর্ডার কাট-অফ: রাত ১০টা",
  tradeLicense: "",
};

const SOURCES = [
  { label: "পদ্মার ইলিশ", href: "/products?source=padma" },
  { label: "মেঘনার ইলিশ", href: "/products?source=meghna" },
  { label: "চাঁদপুরের ইলিশ", href: "/products?source=chandpur" },
  { label: "সব ইলিশ", href: "/products" },
];

const HELP_LINKS = [
  { label: "অর্ডার ট্র্যাক করুন", href: "/track-order" },
  { label: "কীভাবে কাজ করে", href: "/how-it-works" },
  { label: "শর্তাবলী", href: "/terms" },
  { label: "রিফান্ড ও রিপ্লেসমেন্ট", href: "/refund-policy" },
  { label: "গোপনীয়তা নীতি", href: "/privacy" },
];

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

export default function UserFooter() {
  return (
    <footer className="no-print mt-10 bg-navy text-white/80 sm:mt-16">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-9 py-10 sm:gap-10 sm:py-12 lg:grid-cols-4">
        {/* Brand */}
        <div className="col-span-2 space-y-4 sm:col-span-1">
          <Link
            href="/"
            aria-label={`${SITE_NAME} – হোম`}
            className="group inline-flex items-center gap-2.5"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30 transition-transform duration-300 group-hover:-rotate-6">
              <Fish className="size-5" strokeWidth={2.2} />
            </span>
            <span className="font-bangla text-xl font-bold tracking-tight text-white">
              {SITE_NAME}
            </span>
          </Link>
          <p className="font-bangla text-sm leading-relaxed">{TAGLINE}</p>
          <p className="flex items-start gap-2 font-bangla text-sm">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-emerald-300"
              aria-hidden="true"
            />
            মা ইলিশ ও জাটকা সংরক্ষণের সরকারি নিয়ম মেনে আমরা ব্যবসা করি।
          </p>
        </div>

        {/* Sources */}
        <div>
          <h2 className="mb-3 font-bangla text-sm font-bold uppercase tracking-wider text-white">
            উৎস অনুযায়ী কিনুন
          </h2>
          <ul className="space-y-2 font-bangla text-sm">
            {SOURCES.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h2 className="mb-3 font-bangla text-sm font-bold uppercase tracking-wider text-white">
            সাহায্য ও নীতিমালা
          </h2>
          <ul className="space-y-2 font-bangla text-sm">
            {HELP_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-2 sm:col-span-1">
          <h2 className="mb-3 font-bangla text-sm font-bold uppercase tracking-wider text-white">
            যোগাযোগ
          </h2>
          <ul className="space-y-2.5 font-bangla text-sm">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a href={`tel:${CONTACT.phone}`} className="hover:text-white">
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a
                href={`mailto:${CONTACT.email}`}
                className="break-all hover:text-white"
              >
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {CONTACT.address}
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {CONTACT.cutoff}
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-4 font-bangla text-xs text-white/60">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}। সর্বস্বত্ব সংরক্ষিত।
          </p>
          {CONTACT.tradeLicense && (
            <p>ট্রেড লাইসেন্স: {CONTACT.tradeLicense}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
