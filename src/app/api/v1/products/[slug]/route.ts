import { NextRequest } from "next/server";
import { getProductBySlug, getReviewsForProduct } from "@/lib/products/catalog";
import { jsonError, jsonOk } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return jsonError("NOT_FOUND", "Product not found", 404);
  }

  const reviews = await getReviewsForProduct(product.id, product.slug);

  return jsonOk({ ...product, reviews });
}
