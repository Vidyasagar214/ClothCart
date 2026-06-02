import { NextRequest } from "next/server";
import { requireAuth, unauthorized } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/response";
import { verifyRazorpayPayment } from "@/lib/services/orders";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json();

  if (!orderId || !razorpayPaymentId || !razorpaySignature) {
    return jsonError("VALIDATION_ERROR", "Missing payment fields", 400);
  }

  try {
    const result = await verifyRazorpayPayment(
      orderId,
      razorpayOrderId ?? "",
      razorpayPaymentId,
      razorpaySignature
    );
    return jsonOk(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Verification failed";
    return jsonError("PAYMENT_ERROR", msg, 400);
  }
}
