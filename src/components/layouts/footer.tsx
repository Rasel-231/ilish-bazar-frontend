import { Container } from "@/components/shared/container";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-foreground/10">
      <Container className="flex h-16 items-center justify-between text-sm text-foreground/60">
        <p>© Ilish Bazar. All rights reserved.</p>
        <p>Fresh hilsa, delivered.</p>
      </Container>
    </footer>
  );
}
