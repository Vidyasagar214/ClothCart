import { requireAuth, unauthorized } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/response";
import { getOrderById, mapDbOrderToClient } from "@/lib/services/orders";

interface RouteParams {
  params: Promise<{ orderId: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { orderId } = await params;

  const order = await getOrderById(auth.supabase, auth.user.id, orderId);
  if (!order) return jsonError("NOT_FOUND", "Order not found", 404);

  return jsonOk(mapDbOrderToClient(order as Parameters<typeof mapDbOrderToClient>[0]));
}
