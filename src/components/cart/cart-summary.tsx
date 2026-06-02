"use client";

import { useCartStore } from "@/stores/cart-store";
import { useCartTotals } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  showCheckout?: boolean;
  className?: string;
}

export function CartSummary({ showCheckout = true, className }: CartSummaryProps) {
  const totals = useCartTotals();
  const items = useCartStore((s) => s.items);

  if (!items.length) return null;

  return (
    <div className={`glass rounded-2xl p-6 sticky top-24 space-y-4 ${className ?? ""}`}>
      <h2 className="font-display text-lg font-bold">Order Summary</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-slate-400">Subtotal</span><span>{formatPrice(totals.subtotal)}</span></div>
        <div className="flex justify-between"><span className="text-slate-400">Discount</span><span className="text-emerald-400">−{formatPrice(totals.discount)}</span></div>
        <div className="flex justify-between"><span className="text-slate-400">GST (18%)</span><span>{formatPrice(totals.tax)}</span></div>
        <div className="flex justify-between"><span className="text-slate-400">Shipping</span><span>{totals.shipping ? formatPrice(totals.shipping) : "FREE"}</span></div>
        {totals.subtotal < FREE_SHIPPING_THRESHOLD && totals.subtotal > 0 && (
          <p className="text-xs text-amber-400">Add {formatPrice(FREE_SHIPPING_THRESHOLD - totals.subtotal)} more for free shipping!</p>
        )}
      </div>
      <div className="flex justify-between font-bold text-xl pt-4 border-t border-white/10">
        <span>Total</span>
        <span className="gradient-text">{formatPrice(totals.total)}</span>
      </div>
      {showCheckout && (
        <Link href="/checkout" className="block w-full">
          <Button className="w-full" size="lg">Proceed to Checkout</Button>
        </Link>
      )}
    </div>
  );
}
