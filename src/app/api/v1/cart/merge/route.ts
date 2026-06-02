import { NextRequest } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api/auth";
import { jsonOk } from "@/lib/api/response";
import { mergeGuestItems } from "@/lib/services/cart";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const { items } = await request.json();
  const payload = await mergeGuestItems(auth.supabase, auth.user.id, items ?? []);
  return jsonOk(payload);
}
