import { NextRequest } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api/auth";
import { jsonOk } from "@/lib/api/response";
import { listAddresses, createAddress } from "@/lib/services/addresses";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const addresses = await listAddresses(auth.supabase, auth.user.id);
  return jsonOk({ data: addresses });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const body = await request.json();
  const address = await createAddress(auth.supabase, auth.user.id, body);
  return jsonOk(address, 201);
}
