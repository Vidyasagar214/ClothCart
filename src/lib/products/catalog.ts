import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import {
  mapDbProductToProduct,
  mapDbReview,
  PRODUCT_QUERY_SELECT,
  type DbProductRow,
} from "@/lib/products/mapper";
import type { Category, CategorySlug, Product, Review, SortOption } from "@/types";
import {
  PRODUCTS as STATIC_PRODUCTS,
  CATEGORIES as STATIC_CATEGORIES,
  REVIEWS as STATIC_REVIEWS,
  getFeaturedProducts as staticFeatured,
  getNewArrivals as staticNewArrivals,
  getBestSellers as staticBestSellers,
  getBrands as staticBrands,
  getRelatedProducts as staticRelated,
  getReviewsForProduct as staticReviews,
  getProduct as staticGetProduct,
} from "@/lib/data/products";
import { IMAGES } from "@/lib/data/images";

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: CategorySlug | "";
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  onSale?: boolean;
  sort?: SortOption | "relevance";
  search?: string;
}

export interface ProductListResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

async function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  return createClient();
}

function staticFilter(params: ProductListParams): ProductListResult {
  let list = [...STATIC_PRODUCTS];
  const page = params.page ?? 1;
  const limit = params.limit ?? 24;

  if (params.category) {
    list = list.filter((p) => p.category === params.category);
  }
  if (params.brand?.length) {
    list = list.filter((p) => params.brand!.includes(p.brand));
  }
  if (params.minPrice != null) {
    list = list.filter((p) => p.price >= params.minPrice!);
  }
  if (params.maxPrice != null) {
    list = list.filter((p) => p.price <= params.maxPrice!);
  }
  if (params.minRating) {
    list = list.filter((p) => p.rating >= params.minRating!);
  }
  if (params.onSale) {
    list = list.filter((p) => p.compareAt && p.compareAt > p.price);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }

  switch (params.sort) {
    case "price_asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "popularity":
      list.sort((a, b) => b.reviews - a.reviews);
      break;
    default:
      break;
  }

  const total = list.length;
  const start = (page - 1) * limit;
  return { products: list.slice(start, start + limit), total, page, limit };
}

export async function listProducts(params: ProductListParams = {}): Promise<ProductListResult> {
  const supabase = await getSupabase();
  const page = params.page ?? 1;
  const limit = params.limit ?? 24;
  const offset = (page - 1) * limit;

  if (!supabase) return staticFilter(params);

  let query = supabase
    .from("products")
    .select(PRODUCT_QUERY_SELECT, { count: "exact" })
    .eq("is_active", true);

  if (params.category) {
    const { data: cats } = await supabase
      .from("categories")
      .select("id, parent_id")
      .or(`gender.eq.${params.category},slug.eq.${params.category}`);

    const parentIds = cats?.map((c) => c.id) ?? [];
    let allIds = [...parentIds];

    if (parentIds.length) {
      const { data: children } = await supabase
        .from("categories")
        .select("id")
        .in("parent_id", parentIds);
      allIds = [...allIds, ...(children?.map((c) => c.id) ?? [])];
    }

    if (allIds.length) {
      query = query.in("category_id", allIds);
    }
  }

  if (params.minPrice != null) query = query.gte("base_price", params.minPrice);
  if (params.maxPrice != null) query = query.lte("base_price", params.maxPrice);
  if (params.minRating) query = query.gte("avg_rating", params.minRating);
  if (params.onSale) query = query.not("compare_at_price", "is", null);

  if (params.brand?.length) {
    const { data: brandRows } = await supabase
      .from("brands")
      .select("id")
      .in("name", params.brand);
    const brandIds = brandRows?.map((b) => b.id) ?? [];
    if (brandIds.length) query = query.in("brand_id", brandIds);
  }

  if (params.search) {
    query = query.or(
      `name.ilike.%${params.search}%,description.ilike.%${params.search}%`
    );
  }

  switch (params.sort) {
    case "price_asc":
      query = query.order("base_price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("base_price", { ascending: false });
      break;
    case "popularity":
      query = query.order("review_count", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error || !data?.length) {
    if (error) console.error("[listProducts]", error.message);
    if (!data?.length && count === 0) return staticFilter(params);
    if (error) return staticFilter(params);
  }

  const products = (data as unknown as DbProductRow[]).map(mapDbProductToProduct);

  return { products, total: count ?? products.length, page, limit };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await getSupabase();
  if (!supabase) return staticGetProduct(slug) ?? null;

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_QUERY_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return staticGetProduct(slug) ?? null;
  }

  return mapDbProductToProduct(data as unknown as DbProductRow);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const supabase = await getSupabase();
  if (!supabase) return staticRelated(product, limit);

  const { data } = await supabase
    .from("products")
    .select(PRODUCT_QUERY_SELECT)
    .eq("is_active", true)
    .neq("id", product.id)
    .limit(limit * 2);

  if (!data?.length) return staticRelated(product, limit);

  const related = (data as unknown as DbProductRow[])
    .map(mapDbProductToProduct)
    .filter((p) => p.category === product.category)
    .slice(0, limit);

  return related.length ? related : staticRelated(product, limit);
}

export async function getReviewsForProduct(productId: string, slug?: string): Promise<Review[]> {
  const supabase = await getSupabase();
  if (!supabase) {
    return staticReviews(productId).length
      ? staticReviews(productId)
      : slug
        ? staticReviews(staticGetProduct(slug)?.id ?? productId)
        : [];
  }

  const { data } = await supabase
    .from("reviews")
    .select("rating, body, created_at, profiles ( full_name )")
    .eq("product_id", productId)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(20);

  if (data?.length) {
    return data.map((r) => ({
      ...mapDbReview(r as unknown as Parameters<typeof mapDbReview>[0]),
      productId,
    }));
  }

  const legacy = staticGetProduct(slug ?? productId);
  if (legacy) return staticReviews(legacy.id);
  return [];
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = await getSupabase();
  if (!supabase) return staticFeatured(limit);

  const { data } = await supabase
    .from("products")
    .select(PRODUCT_QUERY_SELECT)
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(limit);

  if (!data?.length) return staticFeatured(limit);
  return (data as unknown as DbProductRow[]).map(mapDbProductToProduct);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const result = await listProducts({ limit, sort: "new" });
  if (result.products.length) return result.products;
  return staticNewArrivals(limit);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  const result = await listProducts({ limit, sort: "popularity" });
  if (result.products.length) return result.products;
  return staticBestSellers(limit);
}

export async function getBrands(): Promise<string[]> {
  const supabase = await getSupabase();
  if (!supabase) return staticBrands();

  const { data } = await supabase.from("brands").select("name").eq("is_active", true).order("name");
  if (!data?.length) return staticBrands();
  return data.map((b) => b.name);
}

export async function listCategories(): Promise<Category[]> {
  const supabase = await getSupabase();
  if (!supabase) return STATIC_CATEGORIES;

  const { data: topLevel } = await supabase
    .from("categories")
    .select("id, name, slug, gender, image_url")
    .is("parent_id", null)
    .eq("is_active", true)
    .order("sort_order");

  if (!topLevel?.length) return STATIC_CATEGORIES;

  const categories: Category[] = [];
  for (const cat of topLevel) {
    const gender = cat.gender as CategorySlug;
    const { total } = await listProducts({ category: gender, limit: 1 });
    const imageKey = gender === "men" ? "categoryMen" : gender === "women" ? "categoryWomen" : "categoryChildren";
    categories.push({
      id: gender,
      name: cat.name,
      slug: gender,
      image: cat.image_url ?? IMAGES[imageKey],
      count: total,
    });
  }

  return categories.length ? categories : STATIC_CATEGORIES;
}

export async function getCategoryBySlug(slug: CategorySlug): Promise<Category | null> {
  const categories = await listCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function searchProducts(q: string, page = 1, limit = 24): Promise<ProductListResult> {
  return listProducts({ search: q, page, limit, sort: "new" });
}
