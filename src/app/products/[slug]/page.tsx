import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getReviewsForProduct } from "@/lib/products/catalog";
import { ProductDetailClient } from "./product-detail-client";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return { title: product.name, description: product.description };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, reviews] = await Promise.all([
    getRelatedProducts(product),
    getReviewsForProduct(product.id, product.slug),
  ]);

  return <ProductDetailClient product={product} related={related} reviews={reviews} />;
}
