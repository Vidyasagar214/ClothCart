import { NextRequest } from "next/server";
import { listProducts } from "@/lib/products/catalog";
import { jsonOk, paginationMeta } from "@/lib/api/response";
import type { CategorySlug, SortOption } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(48, Math.max(1, parseInt(searchParams.get("limit") ?? "24", 10)));
  const category = (searchParams.get("category") ?? "") as CategorySlug | "";
  const sort = (searchParams.get("sort") ?? "new") as SortOption;
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;
  const onSale = searchParams.get("onSale") === "true";
  const brand = searchParams.getAll("brand");
  const searchBrand = searchParams.get("search");
  const brandFilter = brand.length ? brand : searchBrand ? [searchBrand] : undefined;
  const search = searchParams.get("q") ?? undefined;

  const result = await listProducts({
    page,
    limit,
    category,
    sort,
    minPrice,
    maxPrice,
    minRating,
    onSale,
    brand: brandFilter,
    search,
  });

  return jsonOk({
    data: result.products,
    meta: paginationMeta(result.page, result.limit, result.total),
  });
}
