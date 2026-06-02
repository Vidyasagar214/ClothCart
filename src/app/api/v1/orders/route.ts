import { requireAuth, unauthorized } from "@/lib/api/auth";
import { jsonOk } from "@/lib/api/response";
import { listUserOrders, mapDbOrderToClient } from "@/lib/services/orders";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const orders = await listUserOrders(auth.supabase, auth.user.id);
  return jsonOk({ data: orders.map(mapDbOrderToClient) });
}
