import { NextRequest } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/response";
import { updateCartItemQty, removeCartItem } from "@/lib/services/cart";

interface RouteParams {
  params: Promise<{ itemId: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { itemId } = await params;
  const { quantity } = await request.json();

  try {
    const payload = await updateCartItemQty(auth.supabase, auth.user.id, itemId, quantity);
    return jsonOk(payload);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Update failed";
    if (msg.includes("stock")) return jsonError("INSUFFICIENT_STOCK", msg, 400);
    return jsonError("CART_ERROR", msg, 400);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { itemId } = await params;
  await removeCartItem(auth.supabase, auth.user.id, itemId);
  return new Response(null, { status: 204 });
}
