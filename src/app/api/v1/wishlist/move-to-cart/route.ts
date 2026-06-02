import { NextRequest } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api/auth";
import { jsonOk } from "@/lib/api/response";
import { moveWishlistToCart } from "@/lib/services/wishlist";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { productIds, moveAll } = await request.json();
  const result = await moveWishlistToCart(auth.supabase, auth.user.id, productIds, moveAll);
  return jsonOk(result);
}
