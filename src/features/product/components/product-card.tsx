import Image from "next/image";

import { cn, formatCurrency } from "@/lib/utils";

import type { Product } from "../types/product.types";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full bg-foreground/5">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-medium">{product.name}</h3>
        {product.category ? (
          <p className="text-xs capitalize text-foreground/60">
            {product.category}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-semibold">{formatCurrency(product.price)}</span>
          <span className="text-xs text-foreground/60">
            {product.stock > 0 ? `স্টকে ${product.stock}টি আছে` : "স্টকে নেই"}
          </span>
        </div>
      </div>
    </article>
  );
}
