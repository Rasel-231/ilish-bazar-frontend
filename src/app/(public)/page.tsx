import { Container } from "@/components/shared/container";

export default function HomePage() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
      <span className="rounded-full border border-foreground/15 px-3 py-1 text-xs font-medium text-foreground/70">
        Fresh from the river
      </span>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        The freshest hilsa, delivered to your door.
      </h1>
      <p className="max-w-xl text-base text-foreground/60">
        Browse our catalog, place an order, and get premium ilish bazar quality
        without leaving home.
      </p>
    </Container>
  );
}
