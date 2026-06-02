import { getCategoryBySlug, listProducts } from "@/lib/products/catalog";
import { jsonError, jsonOk, paginationMeta } from "@/lib/api/response";
import type { CategorySlug } from "@/types";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug as CategorySlug);

  if (!category) {
    return jsonError("NOT_FOUND", "Category not found", 404);
  }

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const limit = Math.min(48, parseInt(url.searchParams.get("limit") ?? "24", 10));

  const result = await listProducts({ category: category.slug, page, limit });

  return jsonOk({
    category,
    data: result.products,
    meta: paginationMeta(result.page, result.limit, result.total),
  });
}
