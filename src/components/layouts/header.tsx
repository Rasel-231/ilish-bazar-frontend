import Link from "next/link";

import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-lg bg-foreground px-4 py-2 text-background transition-opacity hover:opacity-90"
          >
            Sign in
          </Link>
        </nav>
      </Container>
    </header>
  );
}
