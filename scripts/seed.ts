/**
 * Seed ClothCart catalog into Supabase.
 * Usage: npm run db:seed
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { createClient } from "@supabase/supabase-js";
import { v5 as uuidv5 } from "uuid";
import { PRODUCTS } from "../src/lib/data/products";
import { IMAGES } from "../src/lib/data/images";
import type { CategorySlug, Product } from "../src/types";

const NS = "a3f8c2e1-7b4d-4e9a-9c1f-2d8e6b0a4f3c";

function uid(key: string) {
  return uuidv5(key, NS);
}

const TOP_CATEGORIES: Record<CategorySlug, { name: string; image: string }> = {
  men: { name: "Men", image: IMAGES.categoryMen },
  women: { name: "Women", image: IMAGES.categoryWomen },
  children: { name: "Children", image: IMAGES.categoryChildren },
};

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  console.log("Seeding categories...");
  const categoryIds = new Map<string, string>();

  for (const [slug, meta] of Object.entries(TOP_CATEGORIES) as [CategorySlug, { name: string; image: string }][]) {
    const id = uid(`category:${slug}`);
    categoryIds.set(slug, id);
    await supabase.from("categories").upsert({
      id,
      name: meta.name,
      slug,
      gender: slug,
      image_url: meta.image,
      sort_order: slug === "men" ? 1 : slug === "women" ? 2 : 3,
      is_active: true,
    });
  }

  const subcategoryIds = new Map<string, string>();
  for (const product of PRODUCTS) {
    const subKey = `${product.category}:${product.subcategory}`;
    if (subcategoryIds.has(subKey)) continue;
    const id = uid(`subcategory:${subKey}`);
    subcategoryIds.set(subKey, id);
    await supabase.from("categories").upsert({
      id,
      name: product.subcategory,
      slug: product.subcategory.toLowerCase().replace(/\s+/g, "-"),
      parent_id: categoryIds.get(product.category),
      gender: product.category,
      is_active: true,
    });
  }

  console.log("Seeding brands...");
  const brandIds = new Map<string, string>();
  for (const product of PRODUCTS) {
    if (brandIds.has(product.brand)) continue;
    const id = uid(`brand:${product.brand}`);
    brandIds.set(product.brand, id);
    await supabase.from("brands").upsert({
      id,
      name: product.brand,
      slug: product.brand.toLowerCase().replace(/\s+/g, "-"),
      is_active: true,
    });
  }

  console.log(`Seeding ${PRODUCTS.length} products...`);
  for (const product of PRODUCTS) {
    await seedProduct(supabase, product, subcategoryIds, brandIds);
  }

  console.log("Done! Catalog seeded successfully.");
}

async function seedProduct(
  supabase: ReturnType<typeof createClient>,
  product: Product,
  subcategoryIds: Map<string, string>,
  brandIds: Map<string, string>
) {
  const productId = uid(`product:${product.slug}`);
  const subKey = `${product.category}:${product.subcategory}`;
  const categoryId = subcategoryIds.get(subKey)!;
  const brandId = brandIds.get(product.brand)!;

  await supabase.from("products").upsert({
    id: productId,
    name: product.name,
    slug: product.slug,
    description: product.description,
    brand_id: brandId,
    category_id: categoryId,
    base_price: product.price,
    compare_at_price: product.compareAt,
    sku_prefix: product.sku ?? product.id.toUpperCase(),
    tags: product.tags,
    is_active: true,
    is_featured: product.featured,
    subcategory: product.subcategory,
    material: product.material ?? null,
    fit: product.fit ?? null,
    care: product.care ?? [],
    highlights: product.highlights ?? [],
    avg_rating: product.rating,
    review_count: product.reviews,
  });

  // Replace variants
  await supabase.from("product_variants").delete().eq("product_id", productId);
  await supabase.from("product_images").delete().eq("product_id", productId);

  const stockPerVariant = Math.max(1, Math.floor(product.stock / (product.sizes.length * product.colors.length)));

  for (const color of product.colors) {
    for (const size of product.sizes) {
      const variantId = uid(`variant:${product.slug}:${size}:${color.name}`);
      await supabase.from("product_variants").upsert({
        id: variantId,
        product_id: productId,
        sku: `${product.sku ?? product.id}-${size}-${color.name.slice(0, 3).toUpperCase()}`,
        size,
        color: color.name,
        color_hex: color.hex,
        price: product.price,
        stock_quantity: stockPerVariant,
        is_active: true,
      });
    }
  }

  for (let i = 0; i < product.images.length; i++) {
    await supabase.from("product_images").upsert({
      id: uid(`image:${product.slug}:${i}`),
      product_id: productId,
      url: product.images[i],
      alt_text: product.name,
      sort_order: i,
      is_primary: i === 0,
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
