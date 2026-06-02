import type { SupabaseClient } from "@supabase/supabase-js";
import type { Product } from "@/types";
import { PRODUCT_QUERY_SELECT, mapDbProductToProduct, type DbProductRow } from "@/lib/products/mapper";
import { addCartItem } from "@/lib/services/cart";

export async function getWishlistProducts(supabase: SupabaseClient, userId: string): Promise<Product[]> {
  const { data: rows } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!rows?.length) return [];

  const ids = rows.map((r) => r.product_id);
  const { data: products } = await supabase
    .from("products")
    .select(PRODUCT_QUERY_SELECT)
    .in("id", ids)
    .eq("is_active", true);

  return (products as unknown as DbProductRow[] ?? []).map(mapDbProductToProduct);
}

export async function addToWishlist(supabase: SupabaseClient, userId: string, productId: string) {
  const { error } = await supabase.from("wishlists").upsert(
    { user_id: userId, product_id: productId },
    { onConflict: "user_id,product_id", ignoreDuplicates: true }
  );
  if (error) throw new Error(error.message);
}

export async function removeFromWishlist(supabase: SupabaseClient, userId: string, productId: string) {
  await supabase.from("wishlists").delete().eq("user_id", userId).eq("product_id", productId);
}

export async function moveWishlistToCart(
  supabase: SupabaseClient,
  userId: string,
  productIds?: string[],
  moveAll = false
) {
  let query = supabase.from("wishlists").select("product_id").eq("user_id", userId);
  if (!moveAll && productIds?.length) {
    query = query.in("product_id", productIds);
  }
  const { data: rows } = await query;
  if (!rows?.length) return { moved: 0 };

  let moved = 0;
  for (const row of rows) {
    const { data: product } = await supabase
      .from("products")
      .select("id, product_variants ( id, size, color, stock_quantity )")
      .eq("id", row.product_id)
      .single();

    const variants = product?.product_variants as { id: string; size: string; color: string; stock_quantity: number }[] | undefined;
    const variant = variants?.find((v) => v.stock_quantity > 0) ?? variants?.[0];
    if (variant) {
      try {
        await addCartItem(supabase, userId, variant.id, 1);
        await removeFromWishlist(supabase, userId, row.product_id);
        moved++;
      } catch {
        /* skip */
      }
    }
  }
  return { moved };
}

export async function getWishlistIds(supabase: SupabaseClient, userId: string): Promise<string[]> {
  const { data } = await supabase.from("wishlists").select("product_id").eq("user_id", userId);
  return data?.map((r) => r.product_id) ?? [];
}
