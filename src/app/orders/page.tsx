"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirmedId = searchParams.get("confirmed");
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/login?redirect=/orders");
      return;
    }
    if (!user.id) {
      setLoading(false);
      return;
    }

    fetch("/api/v1/orders")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((data) => setOrders(data.data ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user, router]);

  const cancelOrder = async (dbId: string, orderNumber: string) => {
    try {
      const res = await fetch(`/api/v1/orders/${dbId}/cancel`, { method: "POST" });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: "cancelled" } : o))
        );
      }
    } catch {
      /* ignore */
    }
  };

  if (!user) return null;

  const statusColor: Record<string, string> = {
    pending: "text-amber-400 bg-amber-500/20",
    confirmed: "text-emerald-400 bg-emerald-500/20",
    processing: "text-amber-400 bg-amber-500/20",
    shipped: "text-cyan-400 bg-cyan-500/20",
    delivered: "text-violet-400 bg-violet-500/20",
    cancelled: "text-red-400 bg-red-500/20",
  };

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
      <h1 className="font-display text-3xl font-bold mb-8">My Orders</h1>

      {confirmedId && (
        <div className="glass-strong rounded-2xl p-6 mb-8 border border-emerald-500/30 bg-emerald-500/5">
          <h2 className="font-display text-xl font-bold text-emerald-400 mb-1">Order Confirmed!</h2>
          <p className="text-slate-300">
            Your order <strong>#{confirmedId}</strong> has been placed. Estimated delivery in 3–5 business days.
          </p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading orders…</div>
      ) : !orders.length ? (
        <div className="text-center py-20 text-slate-400">
          <p className="mb-4">No orders yet</p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const summary = order.items
              .map((i) => `${i.productName ?? "Item"} × ${i.qty}`)
              .join(", ");
            const displayId = order.orderNumber ?? order.id;
            const dbId = order.dbId ?? order.id;

            return (
              <div key={displayId} className="glass rounded-2xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="font-display font-bold text-lg">#{displayId}</p>
                    <p className="text-sm text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold px-3 py-1 rounded-full capitalize",
                      statusColor[order.status]
                    )}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-4 line-clamp-2">{summary}</p>
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <span className="font-bold text-lg">{formatPrice(order.totals.total)}</span>
                  <div className="flex gap-3 items-center">
                    <span className="text-xs text-slate-400 capitalize">{order.paymentMethod}</span>
                    {["pending", "confirmed"].includes(order.status) && (
                      <button
                        onClick={() => cancelOrder(dbId, displayId)}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="text-sm text-violet-400 cursor-pointer hover:underline">
                    Track Order
                  </summary>
                  <div className="mt-4 pl-2 border-l border-white/10 ml-1.5 space-y-3">
                    {order.timeline.map((t) => (
                      <div key={t.label} className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-3 h-3 rounded-full shrink-0",
                            t.date ? "bg-emerald-500" : "bg-white/20"
                          )}
                        />
                        <div>
                          <p className={cn("text-sm font-medium", !t.date && "text-slate-500")}>
                            {t.label}
                          </p>
                          {t.date && (
                            <p className="text-xs text-slate-500">
                              {new Date(t.date).toLocaleDateString("en-IN")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center text-slate-400">Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
