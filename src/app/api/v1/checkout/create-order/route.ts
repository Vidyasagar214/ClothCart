import { NextRequest } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/response";
import { createOrder } from "@/lib/services/orders";
import type { PaymentMethod, ShippingAddress } from "@/types";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = await request.json();
  const paymentMethod = body.paymentMethod as PaymentMethod;
  let shippingAddress = body.shippingAddress as ShippingAddress | undefined;

  if (body.shippingAddressId) {
    const { data: addr } = await auth.supabase
      .from("addresses")
      .select("*")
      .eq("id", body.shippingAddressId)
      .eq("user_id", auth.user.id)
      .single();

    if (addr) {
      shippingAddress = {
        name: addr.full_name,
        phone: addr.phone,
        line1: addr.address_line1,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
      };
    }
  }

  if (!shippingAddress || !paymentMethod) {
    return jsonError("VALIDATION_ERROR", "Address and payment method required", 400);
  }

  try {
    const result = await createOrder(auth.supabase, auth.user.id, shippingAddress, paymentMethod);
    return jsonOk(result, 201);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Checkout failed";
    return jsonError("CHECKOUT_ERROR", msg, 400);
  }
}
