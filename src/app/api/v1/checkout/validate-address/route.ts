import { NextRequest } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api/auth";
import { jsonOk } from "@/lib/api/response";
import { validatePincode } from "@/lib/services/addresses";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { pincode } = await request.json();
  return jsonOk(validatePincode(pincode));
}
