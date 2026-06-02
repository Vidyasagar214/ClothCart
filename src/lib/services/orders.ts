import crypto from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CartTotals, PaymentMethod, ShippingAddress } from "@/types";
import { COD_MAX } from "@/lib/constants";
import { getCartPayload, clearCart } from "@/lib/services/cart";
import { createAdminClient } from "@/lib/supabase/admin";

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CC${ts}${rand}`.slice(0, 20);
}

export async function createOrder(
  supabase: SupabaseClient,
  userId: string,
  shippingAddress: ShippingAddress,
  paymentMethod: PaymentMethod
) {
  const { items, totals } = await getCartPayload(supabase, userId);
  if (!items.length) throw new Error("Cart is empty");

  if (paymentMethod === "cod" && totals.total > COD_MAX) {
    throw new Error("COD not available for orders above ₹5,000");
  }

  for (const item of items) {
    if (!item.variantId) throw new Error("Invalid cart item");
    const { data: variant } = await supabase
      .from("product_variants")
      .select("stock_quantity")
      .eq("id", item.variantId)
      .single();
    if (!variant || variant.stock_quantity < item.qty) {
      throw new Error(`Insufficient stock for ${item.productName ?? "item"}`);
    }
  }

  const orderNumber = generateOrderNumber();
  const initialStatus = paymentMethod === "cod" ? "confirmed" : "pending";

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: userId,
      status: initialStatus,
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax: totals.tax,
      shipping: totals.shipping,
      total: totals.total,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
    })
    .select("id, order_number, total, status")
    .single();

  if (orderError || !order) throw new Error(orderError?.message ?? "Could not create order");

  const orderItems = items.map((item) => ({
    order_id: order.id,
    variant_id: item.variantId!,
    product_name: item.productName ?? "Product",
    variant_size: item.size,
    variant_color: item.color,
    quantity: item.qty,
    unit_price: item.price,
    total_price: item.price * item.qty,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw new Error(itemsError.message);

  await supabase.from("payments").insert({
    order_id: order.id,
    amount: totals.total,
    status: paymentMethod === "cod" ? "completed" : "pending",
    provider: paymentMethod === "cod" ? "cod" : "razorpay",
  });

  if (paymentMethod === "cod") {
    for (const item of items) {
      await supabase.rpc("decrement_stock", { p_variant_id: item.variantId, p_qty: item.qty });
    }
    await clearCart(supabase, userId);
  }

  let razorpayOrderId: string | null = null;
  if (paymentMethod !== "cod") {
    razorpayOrderId = await createRazorpayOrder(order.id, totals.total, orderNumber);
  }

  return {
    orderId: order.id,
    orderNumber: order.order_number,
    amount: Number(order.total),
    status: order.status,
    razorpayOrderId,
  };
}

async function createRazorpayOrder(orderId: string, amount: number, orderNumber: string): Promise<string | null> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: orderNumber,
      notes: { orderId },
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.id as string;
}

export async function verifyRazorpayPayment(
  orderId: string,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("Razorpay not configured");

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expected !== razorpaySignature) throw new Error("Invalid payment signature");

  const admin = createAdminClient();

  const { data: order } = await admin.from("orders").select("id, status, user_id").eq("id", orderId).single();
  if (!order) throw new Error("Order not found");
  if (order.status === "confirmed") return { orderId, status: "confirmed" };

  const { data: orderItems } = await admin.from("order_items").select("variant_id, quantity").eq("order_id", orderId);

  for (const item of orderItems ?? []) {
    await admin.rpc("decrement_stock", { p_variant_id: item.variant_id, p_qty: item.quantity });
  }

  await admin
    .from("orders")
    .update({ status: "confirmed" })
    .eq("id", orderId);

  await admin
    .from("payments")
    .update({
      status: "completed",
      provider_payment_id: razorpayPaymentId,
      metadata: { razorpayOrderId, razorpayPaymentId },
    })
    .eq("order_id", orderId);

  await admin.from("cart_items").delete().in(
    "cart_id",
    (
      await admin.from("carts").select("id").eq("user_id", order.user_id)
    ).data?.map((c) => c.id) ?? []
  );

  return { orderId, status: "confirmed" };
}

export async function listUserOrders(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("orders")
    .select(`
      id, order_number, status, total, subtotal, discount, tax, shipping,
      payment_method, shipping_address, created_at,
      order_items ( product_name, variant_size, variant_color, quantity, unit_price, total_price, variant_id )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getOrderById(supabase: SupabaseClient, userId: string, orderId: string) {
  const { data } = await supabase
    .from("orders")
    .select(`
      id, order_number, status, total, subtotal, discount, tax, shipping,
      payment_method, shipping_address, created_at,
      order_items ( product_name, variant_size, variant_color, quantity, unit_price, total_price, variant_id )
    `)
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  return data;
}

export async function cancelOrder(supabase: SupabaseClient, userId: string, orderId: string) {
  const { data: order } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (!order) throw new Error("Order not found");
  if (!["pending", "confirmed"].includes(order.status)) {
    throw new Error("Order cannot be cancelled");
  }

  await supabase
    .from("orders")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
    .eq("id", orderId);

  return { orderId, status: "cancelled" };
}

export function mapDbOrderToClient(order: {
  id: string;
  order_number: string;
  status: string;
  total: number;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  payment_method: PaymentMethod;
  shipping_address: ShippingAddress;
  created_at: string;
  order_items: {
    product_name: string;
    variant_size: string;
    variant_color: string;
    quantity: number;
    unit_price: number;
    variant_id: string;
  }[];
}) {
  const items = order.order_items.map((i) => ({
    productId: i.variant_id,
    size: i.variant_size,
    color: i.variant_color,
    qty: i.quantity,
    price: Number(i.unit_price),
    productName: i.product_name,
  }));

  const totals: CartTotals = {
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    tax: Number(order.tax),
    shipping: Number(order.shipping),
    total: Number(order.total),
  };

  const statusLabels: Record<string, string> = {
    pending: "Payment Pending",
    confirmed: "Order Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  const steps = ["confirmed", "processing", "shipped", "delivered"];
  const currentIdx = steps.indexOf(order.status === "pending" ? "confirmed" : order.status);

  return {
    id: order.order_number,
    orderNumber: order.order_number,
    dbId: order.id,
    items,
    totals,
    address: order.shipping_address,
    paymentMethod: order.payment_method,
    status: order.status,
    createdAt: order.created_at,
    timeline: steps.map((s, idx) => ({
      status: s,
      label: statusLabels[s] ?? s,
      date: idx <= currentIdx && order.status !== "cancelled" ? order.created_at : null,
    })),
  };
}
