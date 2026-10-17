"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fish, LogIn, Search, ShoppingCart, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { MAIN_NAV_LINKS, ROUTES } from "@/lib/navigation";

type UserHeaderProps = {
  /** Cart item count. Connect this prop to the Redux cart state when ready. */
  cartCount?: number;
};

/* -------------------------------------------------------------------------- */
/* Scroll state                                                               */
/* -------------------------------------------------------------------------- */

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

const getScrolledSnapshot = () => window.scrollY > 8;
const getScrolledServerSnapshot = () => false;

/* -------------------------------------------------------------------------- */
/* Brand                                                                      */
/* -------------------------------------------------------------------------- */

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href={ROUTES.home}
      onClick={onClick}
      aria-label="ইলিশ বাজার – হোম"
      className="group flex shrink-0 items-center gap-2.5"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-navy text-white shadow-sm shadow-primary/30 transition-transform duration-300 group-hover:-rotate-6">
        <Fish className="size-5" strokeWidth={2.2} />
      </span>

      <span className="flex min-w-0 flex-col leading-none">
        <span className="whitespace-nowrap font-bangla text-xl font-bold tracking-tight text-navy">
          ইলিশ বাজার
        </span>
        <span className="mt-1 hidden whitespace-nowrap font-bangla text-[11px] font-medium text-muted-foreground xl:block">
          নদীর তাজা ইলিশ, ঘরে ঘরে
        </span>
      </span>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Search field                                                               */
/* -------------------------------------------------------------------------- */

function SearchField({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        name="search"
        value={value}
        onChange={onChange}
        aria-label="ইলিশ খুঁজুন"
        autoComplete="off"
        placeholder="পদ্মার ইলিশ, ২ কেজি, চাঁদপুর…"
        className="h-10 w-full rounded-xl border border-border/70 bg-white/70 pl-10 pr-4 font-bangla text-sm text-foreground outline-none backdrop-blur transition placeholder:text-muted-foreground focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Animated mobile menu icon                                                  */
/* -------------------------------------------------------------------------- */

function MenuIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className="pointer-events-none"
      aria-hidden="true"
    >
      <path
        d="M4 12h16"
        className="origin-center -translate-y-[7px] transition-all duration-300 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
      />
      <path
        d="M4 12h16"
        className="origin-center transition-all duration-300 group-aria-expanded:rotate-45"
      />
      <path
        d="M4 12h16"
        className="origin-center translate-y-[7px] transition-all duration-300 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Navigation link                                                            */
/* -------------------------------------------------------------------------- */

function DesktopNavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <li className="shrink-0">
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className="group relative inline-flex whitespace-nowrap px-2 py-2 font-bangla text-sm font-medium xl:px-2.5 xl:text-[15px]"
      >
        <span
          className={cn(
            "transition-colors",
            active
              ? "text-primary"
              : "text-foreground/75 group-hover:text-primary",
          )}
        >
          {label}
        </span>

        <span
          className={cn(
            "absolute inset-x-2.5 bottom-0 h-0.5 origin-left rounded-full bg-primary transition-transform duration-300",
            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
          )}
        />
      </Link>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

export default function UserHeader({ cartCount = 0 }: UserHeaderProps) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [previousPathname, setPreviousPathname] = useState(pathname);

  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    getScrolledSnapshot,
    getScrolledServerSnapshot,
  );

  // Close open panels after client-side navigation.
  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  // Close open panels when the user presses Escape.
  useEffect(() => {
    if (!menuOpen && !searchOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, searchOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const searchTerm = query.trim();
    if (!searchTerm) return;

    setMenuOpen(false);
    setSearchOpen(false);
    router.push(`${ROUTES.shop}?search=${encodeURIComponent(searchTerm)}`);
  };

  const closeMobilePanels = () => {
    setMenuOpen(false);
    setSearchOpen(false);
  };

  return (
    <header
      className={cn(
        "no-print sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300",
        scrolled
          ? "border-border/70 bg-white/80 shadow-md shadow-navy/5"
          : "border-transparent bg-white/60",
      )}
    >
      <div className="container-page">
        {/* Desktop: brand, navigation and actions stay on one horizontal row. */}
        <div className="flex min-h-16 items-center gap-3 lg:min-h-[4.5rem] lg:gap-3 xl:gap-4">
          <Brand onClick={closeMobilePanels} />

          {/* Desktop navigation sits beside the brand, not on a second row. */}
          <nav
            aria-label="প্রধান মেনু"
            className="hidden min-w-0 flex-1 lg:block"
          >
            <ul className="flex items-center justify-center gap-0 xl:gap-0.5">
              {MAIN_NAV_LINKS.map(({ href, label }) => (
                <DesktopNavLink
                  key={href}
                  href={href}
                  label={label}
                  active={isActive(href)}
                />
              ))}
            </ul>
          </nav>

          {/* Search remains available on desktop. */}
          <form
            onSubmit={handleSearch}
            role="search"
            className="ms-auto hidden w-44 shrink-0 lg:block xl:ms-0 xl:w-52 2xl:w-60"
          >
            <SearchField
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>

          {/* Header actions */}
          <div className="ms-auto flex shrink-0 items-center gap-1 lg:ms-0 xl:gap-1.5">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen((isOpen) => !isOpen);
              }}
              aria-label={searchOpen ? "সার্চ বন্ধ করুন" : "ইলিশ খুঁজুন"}
              aria-expanded={searchOpen}
              className="flex size-10 items-center justify-center rounded-xl text-navy transition-colors hover:bg-primary/10 lg:hidden"
            >
              {searchOpen ? (
                <X className="size-5" />
              ) : (
                <Search className="size-5" />
              )}
            </button>

            <Link
              href={ROUTES.cart}
              aria-label={`কার্ট, ${cartCount}টি আইটেম`}
              className="relative flex size-10 shrink-0 items-center justify-center rounded-xl text-navy transition-colors hover:bg-primary/10"
            >
              <ShoppingCart className="size-5" />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 flex min-w-[1.15rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-[1.15rem] text-primary-foreground ring-2 ring-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <Link
              href={ROUTES.login}
              className="hidden h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-primary px-3 font-bangla text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/30 transition-all hover:bg-primary/90 active:scale-[0.97] sm:inline-flex"
            >
              <LogIn className="size-4" />
              <span className="hidden xl:inline">লগইন</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setMenuOpen((isOpen) => !isOpen);
              }}
              aria-label={menuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? "mobile-menu" : undefined}
              className="group flex size-10 shrink-0 items-center justify-center rounded-xl text-navy transition-colors hover:bg-primary/10 lg:hidden"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search panel */}
      {searchOpen && (
        <div className="animate-in fade-in slide-in-from-top-1 border-t border-border/70 bg-white/90 duration-200 lg:hidden">
          <form
            onSubmit={handleSearch}
            role="search"
            className="container-page flex items-center gap-2 py-3"
          >
            <SearchField
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1"
            />
            <button
              type="submit"
              className="h-10 shrink-0 rounded-xl bg-navy px-5 font-bangla text-sm font-semibold text-white transition-colors hover:bg-navy/90 active:scale-[0.97]"
            >
              খুঁজুন
            </button>
          </form>
        </div>
      )}

      {/* Mobile navigation panel */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="animate-in fade-in slide-in-from-top-1 border-t border-border/70 bg-white/90 duration-200 lg:hidden"
        >
          <nav aria-label="মোবাইল নেভিগেশন" className="container-page py-3">
            <ul className="space-y-1">
              {MAIN_NAV_LINKS.map(({ href, label }) => {
                const active = isActive(href);

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "block rounded-xl px-4 py-2.5 font-bangla text-base font-medium transition-colors",
                        active
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground/80 hover:bg-secondary",
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Link
              href={ROUTES.login}
              onClick={() => setMenuOpen(false)}
              className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary font-bangla text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/30 transition-all active:scale-[0.98] sm:hidden"
            >
              <LogIn className="size-4" />
              লগইন / রেজিস্টার
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
