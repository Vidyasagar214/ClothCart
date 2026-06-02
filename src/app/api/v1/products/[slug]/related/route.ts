import { NextRequest } from "next/server";
import { getProductBySlug, getRelatedProducts } from "@/lib/products/catalog";
import { jsonError, jsonOk } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "8", 10);
  const product = await getProductBySlug(slug);

  if (!product) {
    return jsonError("NOT_FOUND", "Product not found", 404);
  }

  const related = await getRelatedProducts(product, limit);
  return jsonOk({ data: related });
}
