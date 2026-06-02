import { NextRequest } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/response";
import { addCartItem, findVariantId } from "@/lib/services/cart";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = await request.json();
  let variantId = body.variantId as string | undefined;
  const quantity = Math.max(1, parseInt(body.quantity ?? 1, 10));

  if (!variantId && body.productId && body.size && body.color) {
    variantId = (await findVariantId(auth.supabase, body.productId, body.size, body.color)) ?? undefined;
  }

  if (!variantId) return jsonError("NOT_FOUND", "Variant not found", 404);

  try {
    const payload = await addCartItem(auth.supabase, auth.user.id, variantId, quantity);
    return jsonOk(payload, 201);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not add item";
    if (msg.includes("stock")) return jsonError("INSUFFICIENT_STOCK", msg, 400);
    return jsonError("CART_ERROR", msg, 400);
  }
}
