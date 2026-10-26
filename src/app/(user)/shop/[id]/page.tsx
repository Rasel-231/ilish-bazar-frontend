import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ShopProductDetail } from "@/features/shop/components/shop-product-detail";
import {
  SHOP_PRODUCTS,
  getRelatedProducts,
  getShopProduct,
} from "@/features/shop/data/shop-products";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return SHOP_PRODUCTS.map((product) => ({ id: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getShopProduct(id);

  if (!product) {
    return { title: "ইলিশ পাওয়া যায়নি" };
  }

  return {
    title: product.name,
    description: `${product.name} — ${product.origin} থেকে তাজা ইলিশ। ${product.weightRange}, ${product.pricePerKg} টাকা প্রতি কেজি।`,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: product.name,
      description: `${product.origin} থেকে তাজা ইলিশ — ${product.pricePerKg} টাকা প্রতি কেজি।`,
      images: [{ url: product.image }],
    },
  };
}

export default async function ShopProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getShopProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <ShopProductDetail
      product={product}
      related={getRelatedProducts(product)}
    />
  );
}
