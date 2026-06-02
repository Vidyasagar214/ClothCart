import type { SupabaseClient } from "@supabase/supabase-js";
import type { CartItem, CartTotals } from "@/types";
import { calcCartTotals } from "@/lib/utils/cart";

const CART_EXPIRY_DAYS = 30;

export async function getOrCreateCartId(supabase: SupabaseClient, userId: string): Promise<string> {
  const now = new Date().toISOString();
  const { data: existing } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .gt("expires_at", now)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) return existing.id;

  const expiresAt = new Date(Date.now() + CART_EXPIRY_DAYS * 86400000).toISOString();
  const { data: created, error } = await supabase
    .from("carts")
    .insert({ user_id: userId, expires_at: expiresAt })
    .select("id")
    .single();

  if (error || !created) throw new Error(error?.message ?? "Could not create cart");
  return created.id;
}

export async function findVariantId(
  supabase: SupabaseClient,
  productId: string,
  size: string,
  color: string
): Promise<string | null> {
  const { data } = await supabase
    .from("product_variants")
    .select("id")
    .eq("product_id", productId)
    .eq("size", size)
    .eq("color", color)
    .eq("is_active", true)
    .maybeSingle();
  return data?.id ?? null;
}

export async function getVariantById(supabase: SupabaseClient, variantId: string) {
  const { data } = await supabase
    .from("product_variants")
    .select("id, product_id, size, color, price, stock_quantity, products ( id, name, slug, product_images ( url, is_primary ) )")
    .eq("id", variantId)
    .eq("is_active", true)
    .single();
  return data;
}

function mapCartRow(item: {
  id: string;
  variant_id: string;
  quantity: number;
  price_at_add: number;
  product_variants: {
    size: string;
    color: string;
    products: {
      id: string;
      name: string;
      slug: string;
      product_images: { url: string; is_primary: boolean }[];
    };
  };
}): CartItem {
  const product = item.product_variants.products;
  const image =
    product.product_images?.find((i) => i.is_primary)?.url ??
    product.product_images?.[0]?.url ??
    "";

  return {
    id: item.id,
    variantId: item.variant_id,
    productId: product.id,
    productName: product.name,
    productSlug: product.slug,
    productImage: image,
    size: item.product_variants.size,
    color: item.product_variants.color,
    qty: item.quantity,
    price: Number(item.price_at_add),
  };
}

export async function getCartPayload(supabase: SupabaseClient, userId: string) {
  const cartId = await getOrCreateCartId(supabase, userId);

  const { data: rows } = await supabase
    .from("cart_items")
    .select(`
      id, variant_id, quantity, price_at_add,
      product_variants (
        size, color,
        products ( id, name, slug, product_images ( url, is_primary ) )
      )
    `)
    .eq("cart_id", cartId);

  const items: CartItem[] = (rows ?? []).map((r) =>
    mapCartRow(r as unknown as Parameters<typeof mapCartRow>[0])
  );
  const totals: CartTotals = calcCartTotals(items);

  return { cartId, items, totals };
}

export async function addCartItem(
  supabase: SupabaseClient,
  userId: string,
  variantId: string,
  quantity: number
) {
  const variant = await getVariantById(supabase, variantId);
  if (!variant) throw new Error("Variant not found");
  if (variant.stock_quantity < quantity) throw new Error("Insufficient stock");

  const cartId = await getOrCreateCartId(supabase, userId);

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("variant_id", variantId)
    .maybeSingle();

  if (existing) {
    const newQty = Math.min(existing.quantity + quantity, variant.stock_quantity);
    await supabase.from("cart_items").update({ quantity: newQty }).eq("id", existing.id);
  } else {
    await supabase.from("cart_items").insert({
      cart_id: cartId,
      variant_id: variantId,
      quantity: Math.min(quantity, variant.stock_quantity),
      price_at_add: variant.price,
    });
  }

  return getCartPayload(supabase, userId);
}

export async function updateCartItemQty(
  supabase: SupabaseClient,
  userId: string,
  itemId: string,
  quantity: number
) {
  const cartId = await getOrCreateCartId(supabase, userId);

  const { data: item } = await supabase
    .from("cart_items")
    .select("id, variant_id, product_variants ( stock_quantity )")
    .eq("id", itemId)
    .eq("cart_id", cartId)
    .single();

  if (!item) throw new Error("Cart item not found");

  const variant = item.product_variants as unknown as { stock_quantity: number };
  const stock = variant.stock_quantity;
  if (quantity > stock) throw new Error("Insufficient stock");

  if (quantity < 1) {
    await supabase.from("cart_items").delete().eq("id", itemId);
  } else {
    await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
  }

  return getCartPayload(supabase, userId);
}

export async function removeCartItem(supabase: SupabaseClient, userId: string, itemId: string) {
  const cartId = await getOrCreateCartId(supabase, userId);
  await supabase.from("cart_items").delete().eq("id", itemId).eq("cart_id", cartId);
  return getCartPayload(supabase, userId);
}

export async function clearCart(supabase: SupabaseClient, userId: string) {
  const cartId = await getOrCreateCartId(supabase, userId);
  await supabase.from("cart_items").delete().eq("cart_id", cartId);
}

export async function mergeGuestItems(
  supabase: SupabaseClient,
  userId: string,
  guestItems: { productId: string; size: string; color: string; qty: number }[]
) {
  for (const item of guestItems) {
    const variantId = await findVariantId(supabase, item.productId, item.size, item.color);
    if (variantId) {
      try {
        await addCartItem(supabase, userId, variantId, item.qty);
      } catch {
        /* skip unavailable */
      }
    }
  }
  return getCartPayload(supabase, userId);
}
