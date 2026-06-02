import { NextRequest } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api/auth";
import { jsonOk } from "@/lib/api/response";
import { getWishlistProducts, addToWishlist, getWishlistIds } from "@/lib/services/wishlist";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const [products, ids] = await Promise.all([
    getWishlistProducts(auth.supabase, auth.user.id),
    getWishlistIds(auth.supabase, auth.user.id),
  ]);
  return jsonOk({ data: products, productIds: ids });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { productId } = await request.json();
  await addToWishlist(auth.supabase, auth.user.id, productId);
  return jsonOk({ productId }, 201);
}
