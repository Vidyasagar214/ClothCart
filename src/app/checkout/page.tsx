"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { useCartStore } from "@/stores/cart-store";
import { useCartTotals } from "@/hooks/use-cart";
import { useAuthStore } from "@/stores/auth-store";
import { resolveProduct } from "@/lib/products/cache";
import { formatPrice } from "@/lib/utils";
import { COD_MAX } from "@/lib/constants";
import { toast } from "@/components/ui/toast-provider";
import { Button } from "@/components/ui/button";
import type { PaymentMethod, SavedAddress, ShippingAddress } from "@/types";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: "card", label: "Credit/Debit Card", icon: "💳" },
  { id: "upi", label: "UPI", icon: "📱" },
  { id: "netbanking", label: "Net Banking", icon: "🏦" },
  { id: "wallet", label: "Wallets", icon: "👛" },
  { id: "cod", label: "Cash on Delivery", icon: "💵" },
];

interface RazorpayHandlerResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const totals = useCartTotals();
  const clearCart = useCartStore((s) => s.clearCart);
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<ShippingAddress>({
    name: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [placing, setPlacing] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    if (!items.length) router.replace("/cart");
    if (!user) router.replace("/login?redirect=/checkout");
  }, [items.length, user, router]);

  useEffect(() => {
    if (!user?.id) return;
    fetch("/api/v1/addresses")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const list: SavedAddress[] = data?.data ?? [];
        setSavedAddresses(list);
        const defaultAddr = list.find((a) => a.isDefault) ?? list[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setAddress({
            name: defaultAddr.name,
            phone: defaultAddr.phone,
            line1: defaultAddr.line1,
            city: defaultAddr.city,
            state: defaultAddr.state,
            pincode: defaultAddr.pincode,
          });
        }
      })
      .catch(() => {});
  }, [user?.id]);

  const handleAddressSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: ShippingAddress = {
      name: fd.get("name") as string,
      phone: fd.get("phone") as string,
      line1: fd.get("line1") as string,
      city: fd.get("city") as string,
      state: fd.get("state") as string,
      pincode: fd.get("pincode") as string,
    };
    if (!/^[0-9]{6}$/.test(data.pincode)) {
      toast("Invalid pincode", "error");
      return;
    }
    setAddress(data);
    setSelectedAddressId(null);
    setStep(2);
  };

  const selectSavedAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    setAddress({
      name: addr.name,
      phone: addr.phone,
      line1: addr.line1,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setStep(2);
  };

  const openRazorpay = useCallback(
    (
      orderId: string,
      orderNumber: string,
      amount: number,
      razorpayOrderId: string
    ) => {
      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!key || !window.Razorpay) {
        toast("Online payment is not configured", "error");
        setPlacing(false);
        return;
      }

      const rzp = new window.Razorpay({
        key,
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "ClothCart",
        description: `Order ${orderNumber}`,
        order_id: razorpayOrderId,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#7c3aed" },
        handler: async (response: RazorpayHandlerResponse) => {
          try {
            const verifyRes = await fetch("/api/v1/checkout/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            if (!verifyRes.ok) throw new Error("Payment verification failed");
            clearCart();
            router.push(`/checkout/confirmation/${orderNumber}`);
          } catch {
            toast("Payment verification failed. Contact support if amount was deducted.", "error");
          } finally {
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: () => setPlacing(false),
        },
      });
      rzp.open();
    },
    [clearCart, router, user?.email, user?.name]
  );

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const body: Record<string, unknown> = { paymentMethod };
      if (selectedAddressId) {
        body.shippingAddressId = selectedAddressId;
      } else {
        body.shippingAddress = address;
      }

      const res = await fetch("/api/v1/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        toast(data?.error?.message ?? "Checkout failed", "error");
        setPlacing(false);
        return;
      }

      if (paymentMethod === "cod") {
        clearCart();
        router.push(`/checkout/confirmation/${data.orderNumber}`);
        return;
      }

      if (data.razorpayOrderId) {
        openRazorpay(data.orderId, data.orderNumber, data.amount, data.razorpayOrderId);
      } else {
        toast("Online payment unavailable. Try COD or contact support.", "error");
        setPlacing(false);
      }
    } catch {
      toast("Checkout failed", "error");
      setPlacing(false);
    }
  };

  if (!items.length || !user) return null;

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayReady(true)}
      />

      <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-2">
              {n > 1 && <div className="w-8 sm:w-16 h-0.5 bg-white/20" />}
              <span
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  step > n ? "step-done text-white" : step === n ? "step-active text-white" : "bg-white/10"
                )}
              >
                {step > n ? "✓" : n}
              </span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="max-w-lg mx-auto space-y-6">
            {savedAddresses.length > 0 && (
              <div className="glass rounded-2xl p-6 space-y-3">
                <h2 className="font-display text-lg font-bold">Saved Addresses</h2>
                {savedAddresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => selectSavedAddress(addr)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-colors",
                      selectedAddressId === addr.id
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-white/10 hover:bg-white/5"
                    )}
                  >
                    <p className="font-medium">{addr.name}</p>
                    <p className="text-sm text-slate-400">
                      {addr.line1}, {addr.city} — {addr.pincode}
                    </p>
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleAddressSubmit} className="glass rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="font-display text-xl font-bold mb-4">
                {savedAddresses.length ? "Or enter a new address" : "Shipping Address"}
              </h2>
              {(["name", "phone", "line1", "city", "state"] as const).map((field) => (
                <div key={field}>
                  <label className="text-sm font-medium block mb-1 capitalize">
                    {field === "line1" ? "Address Line 1" : field} *
                  </label>
                  <input
                    required
                    name={field}
                    defaultValue={field === "name" ? user.name : ""}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 focus:outline-none"
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium block mb-1">Pincode *</label>
                <input
                  required
                  name="pincode"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="560001"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 focus:outline-none"
                />
              </div>
              <Button type="submit" className="w-full mt-4" size="lg">
                Continue to Payment
              </Button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-lg mx-auto space-y-4">
            <h2 className="font-display text-xl font-bold mb-4 text-center">Payment Method</h2>
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  if (m.id === "cod" && totals.total > COD_MAX) {
                    toast("COD not available for orders above ₹5,000", "error");
                    return;
                  }
                  setPaymentMethod(m.id);
                }}
                className={cn(
                  "w-full glass rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors text-left",
                  paymentMethod === m.id && "ring-2 ring-violet-500"
                )}
              >
                <span className="text-2xl">{m.icon}</span>
                <span className="font-medium">{m.label}</span>
                {m.id === "cod" && totals.total > COD_MAX && (
                  <span className="text-xs text-red-400 ml-auto">Max ₹5,000</span>
                )}
              </button>
            ))}
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1">
                Review Order
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="font-display text-lg font-bold">Order Items</h2>
              {items.map((item) => {
                const p = resolveProduct(item.productId);
                const name = item.productName ?? p?.name ?? "Product";
                return (
                  <div
                    key={item.id ?? `${item.productId}-${item.size}`}
                    className="flex justify-between text-sm py-2 border-b border-white/5"
                  >
                    <span>
                      {name} × {item.qty}
                    </span>
                    <span>{formatPrice(item.price * item.qty)}</span>
                  </div>
                );
              })}
              <div className="border-t border-white/10 pt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total</span>
                  <span className="gradient-text font-bold text-lg">{formatPrice(totals.total)}</span>
                </div>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="font-display text-lg font-bold">Delivery & Payment</h2>
              <div className="text-sm text-slate-300">
                <p className="font-medium text-white">{address.name}</p>
                <p>{address.line1}</p>
                <p>
                  {address.city}, {address.state} — {address.pincode}
                </p>
                <p className="mt-2">📞 {address.phone}</p>
              </div>
              <p className="text-sm">
                <span className="text-slate-400">Payment:</span>{" "}
                <span className="font-medium capitalize">{paymentMethod}</span>
              </p>
              {paymentMethod !== "cod" && !razorpayReady && (
                <p className="text-xs text-amber-400">Loading payment gateway…</p>
              )}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1" disabled={placing}>
                  Back
                </Button>
                <Button onClick={handlePlaceOrder} className="flex-1" disabled={placing}>
                  {placing ? "Processing…" : "Place Order"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
