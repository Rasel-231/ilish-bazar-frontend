import Image from "next/image";

import { cn } from "@/lib/utils";

type ProductImageProps = {
  src: string;
  alt: string;
  /** Responsive sizes hint for next/image. */
  sizes?: string;
  /** Applied on top of the default cover styles. */
  className?: string;
  priority?: boolean;
};

/**
 * Shared presentational image used by product cards and banners.
 * Fills its (relatively positioned) parent, so wrap it in a sized container.
 */
export function ProductImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
}: ProductImageProps) {
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
