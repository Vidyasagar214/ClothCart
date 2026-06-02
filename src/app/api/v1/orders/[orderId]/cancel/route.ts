import { requireAuth, unauthorized } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/response";
import { cancelOrder } from "@/lib/services/orders";

interface RouteParams {
  params: Promise<{ orderId: string }>;
}

export async function POST(_request: Request, { params }: RouteParams) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { orderId } = await params;

  try {
    const result = await cancelOrder(auth.supabase, auth.user.id, orderId);
    return jsonOk(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Cannot cancel";
    return jsonError("CANCEL_ERROR", msg, 400);
  }
}
