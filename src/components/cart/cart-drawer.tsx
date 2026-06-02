"use client";

import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import { resolveProduct } from "@/lib/products/cache";
import { useCartStore } from "@/stores/cart-store";
import { useCartTotals, useCartCount } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const totals = useCartTotals();
  const count = useCartCount();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeDrawer}
        aria-hidden={!isOpen}
      />
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md glass-strong z-[70] flex flex-col shadow-2xl transition-transform duration-500 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="font-display text-lg font-bold">Your Cart ({count})</h2>
          <button onClick={closeDrawer} aria-label="Close cart" className="p-2 rounded-full hover:bg-white/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="mb-4">Your cart is empty</p>
              <Link href="/products" onClick={closeDrawer} className="btn-primary text-white px-6 py-2 rounded-full text-sm inline-block">
                Start Shopping
              </Link>
            </div>
          ) : (
            items.map((item, i) => {
              const product = resolveProduct(item.productId);
              const name = item.productName ?? product?.name ?? "Product";
              const image = item.productImage ?? product?.image ?? "";
              return (
                <div key={item.id ?? `${item.productId}-${item.size}-${item.color}`} className="flex gap-3 py-3 border-b border-white/10">
                  <ProductImage src={image} alt="" width={64} height={80} className="w-16 h-20 object-cover rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{name}</p>
                    <p className="text-xs text-slate-400">{item.size} · {item.color}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(i, item.qty - 1)} className="w-7 h-7 rounded-lg bg-white/10 text-xs hover:bg-white/20" aria-label="Decrease">−</button>
                        <span className="text-sm w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(i, item.qty + 1)} className="w-7 h-7 rounded-lg bg-white/10 text-xs hover:bg-white/20" aria-label="Increase">+</button>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(i)} aria-label="Remove" className="text-slate-500 hover:text-red-400 self-start p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-white/10 space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-400">Subtotal</span><span>{formatPrice(totals.subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Tax (GST 18%)</span><span>{formatPrice(totals.tax)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Shipping</span><span>{totals.shipping ? formatPrice(totals.shipping) : "FREE"}</span></div>
            {totals.subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="text-xs text-amber-400">Add {formatPrice(FREE_SHIPPING_THRESHOLD - totals.subtotal)} more for free shipping</p>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
              <span>Total</span><span className="gradient-text">{formatPrice(totals.total)}</span>
            </div>
            <Link href="/cart" onClick={closeDrawer} className="block w-full text-center py-3 rounded-xl border border-white/20 text-sm font-semibold hover:bg-white/5 transition-colors">
              View Cart
            </Link>
            <Link href="/checkout" onClick={closeDrawer} className="block w-full btn-primary text-white text-center py-3 rounded-xl font-semibold">
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
