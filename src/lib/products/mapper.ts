import type { CategorySlug, Product, ProductColor, Review } from "@/types";

export interface DbProductRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  compare_at_price: number | null;
  sku_prefix: string;
  tags: string[];
  is_featured: boolean;
  subcategory: string | null;
  material: string | null;
  fit: string | null;
  care: string[] | null;
  highlights: string[] | null;
  avg_rating: number | null;
  review_count: number | null;
  created_at: string;
  brands: { id: string; name: string; slug: string } | null;
  categories: {
    id: string;
    name: string;
    slug: string;
    gender: CategorySlug | null;
    parent_id: string | null;
  } | null;
  product_variants: Array<{
    id: string;
    size: string;
    color: string;
    color_hex: string | null;
    price: number;
    stock_quantity: number;
  }>;
  product_images: Array<{
    url: string;
    alt_text: string | null;
    sort_order: number;
    is_primary: boolean;
  }>;
}

const PRODUCT_SELECT = `
  id, name, slug, description, base_price, compare_at_price, sku_prefix, tags,
  is_featured, subcategory, material, fit, care, highlights, avg_rating, review_count, created_at,
  brands ( id, name, slug ),
  categories ( id, name, slug, gender, parent_id ),
  product_variants ( id, size, color, color_hex, price, stock_quantity ),
  product_images ( url, alt_text, sort_order, is_primary )
`;

export const PRODUCT_QUERY_SELECT = PRODUCT_SELECT;

function resolveCategorySlug(row: DbProductRow): CategorySlug {
  const cat = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  if (!cat) return "men";
  if (cat.gender && ["men", "women", "children"].includes(cat.gender)) return cat.gender;
  return "men";
}

function aggregateVariants(row: DbProductRow) {
  const variants = row.product_variants ?? [];
  const colorMap = new Map<string, ProductColor>();
  const sizes = new Set<string>();
  let stock = 0;

  for (const v of variants) {
    sizes.add(v.size);
    stock += v.stock_quantity;
    if (!colorMap.has(v.color)) {
      colorMap.set(v.color, { name: v.color, hex: v.color_hex ?? "#64748b" });
    }
  }

  return {
    colors: [...colorMap.values()],
    sizes: [...sizes],
    stock,
    variants,
  };
}

export function mapDbProductToProduct(row: DbProductRow): Product {
  const { colors, sizes, stock } = aggregateVariants(row);
  const brandRow = Array.isArray(row.brands) ? row.brands[0] : row.brands;
  const catRow = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  const images = [...(row.product_images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.url);
  const primary = row.product_images?.find((i) => i.is_primary)?.url ?? images[0] ?? "";

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: brandRow?.name ?? "ClothCart",
    category: resolveCategorySlug(row),
    subcategory: row.subcategory ?? catRow?.name ?? "General",
    price: Number(row.base_price),
    compareAt: row.compare_at_price ? Number(row.compare_at_price) : null,
    rating: Number(row.avg_rating ?? 0),
    reviews: row.review_count ?? 0,
    colors: colors.length ? colors : [{ name: "Default", hex: "#64748b" }],
    sizes: sizes.length ? sizes : ["One Size"],
    stock,
    tags: row.tags ?? [],
    image: primary,
    images: images.length ? images : [primary],
    description: row.description,
    featured: row.is_featured,
    material: row.material ?? undefined,
    fit: row.fit ?? undefined,
    care: row.care ?? undefined,
    highlights: row.highlights ?? undefined,
    sku: row.sku_prefix,
    variants: (row.product_variants ?? []).map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      colorHex: v.color_hex ?? undefined,
      price: Number(v.price),
      stock: v.stock_quantity,
    })),
  };
}

export function mapDbReview(row: {
  rating: number;
  body: string;
  created_at: string;
  profiles: { full_name: string } | { full_name: string }[] | null;
}): Review {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  return {
    productId: "",
    author: profile?.full_name ?? "Customer",
    rating: row.rating,
    text: row.body,
    date: row.created_at.split("T")[0],
  };
}
