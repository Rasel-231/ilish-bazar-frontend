import Image from "next/image";

import { cn, formatCurrency } from "@/lib/utils";

import type { IProduct } from "../types/product.types";

export function ProductCard({
  product,
  className,
}: {
  product: IProduct;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-foreground/10 transition-shadow hover:shadow-md",
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
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
      </div>
    </article>
  );
}
