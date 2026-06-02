import { requireAuth, unauthorized } from "@/lib/api/auth";
import { jsonOk } from "@/lib/api/response";
import { getCartPayload, clearCart } from "@/lib/services/cart";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const payload = await getCartPayload(auth.supabase, auth.user.id);
  return jsonOk(payload);
}

export async function DELETE() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  await clearCart(auth.supabase, auth.user.id);
  return new Response(null, { status: 204 });
}
