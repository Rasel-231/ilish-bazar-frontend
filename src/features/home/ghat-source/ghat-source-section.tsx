import Link from "next/link";

export type Ghat = {
  slug: string;
  label: string; // মাওয়া ঘাট
  name: string; // মাওয়া
  description: string;
  href?: string;
};

const DEFAULT_GHATS: Ghat[] = [
  {
    slug: "mawa",
    label: "মাওয়া ঘাট",
    name: "মাওয়া",
    description: "ঢাকার সবচেয়ে কাছের ঘাট, তাই সবচেয়ে তাজা",
  },
  {
    slug: "chandpur",
    label: "চাঁদপুর বড় স্টেশন মাছঘাট",
    name: "চাঁদপুর",
    description: "মেঘনার নামকরা ইলিশ, স্বাদে আলাদা",
  },
  {
    slug: "barishal",
    label: "বরিশাল লঞ্চঘাট",
    name: "বরিশাল",
    description: "তেল-চর্বিতে ভরপুর, ভাপা ও সরষের জন্য সেরা",
  },
];

type GhatSourceSectionProps = {
  ghats?: Ghat[];
  eyebrow?: string;
  title?: string;
  linkText?: string;
};

export function GhatSourceSection({
  ghats = DEFAULT_GHATS,
  eyebrow = "উৎস",
  title = "তিন ঘাটের সেরা ইলিশ",
  linkText = "দেখুন",
}: GhatSourceSectionProps) {
  return (
    <section className="py-2">
      <div className="container-page">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold text-teal-700">{eyebrow}</p>
          <h2 className="mt-1 text-4xl font-extrabold text-slate-900 sm:text-5xl">
            {title}
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {ghats.map((ghat) => (
            <Link
              key={ghat.slug}
              href={ghat.href ?? `/ilish?ghat=${ghat.slug}`}
              className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-8 transition hover:-translate-y-0.5 hover:border-teal-700/40 hover:shadow-lg"
            >
              <span className="text-sm font-bold text-teal-700">
                {ghat.label}
              </span>
              <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
                {ghat.name}
              </h3>
              <p className="mt-3 flex-1 leading-relaxed text-slate-600">
                {ghat.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-1 font-bold text-teal-700">
                {linkText}
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
