import { NextRequest } from "next/server";
import { searchProducts } from "@/lib/products/catalog";
import { jsonError, jsonOk, paginationMeta } from "@/lib/api/response";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return jsonError("VALIDATION_ERROR", "Search query must be at least 2 characters", 400);
  }

  const page = Math.max(1, parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10));
  const limit = Math.min(48, parseInt(request.nextUrl.searchParams.get("limit") ?? "24", 10));

  const result = await searchProducts(q, page, limit);

  return jsonOk({
    data: result.products,
    meta: paginationMeta(result.page, result.limit, result.total),
    query: q,
  });
}
