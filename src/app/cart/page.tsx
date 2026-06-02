"use client";

import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import { useCartStore } from "@/stores/cart-store";
import { resolveProduct } from "@/lib/products/cache";
import { CartSummary } from "@/components/cart/cart-summary";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);

  if (!items.length) {
    return (
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 text-center py-20">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full glass flex items-center justify-center">
          <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold mb-3">Your cart is empty</h1>
        <p className="text-slate-400 mb-8">Discover our premium collection and find your perfect fit.</p>
        <Link href="/products"><Button size="lg">Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => {
            const product = resolveProduct(item.productId);
            const name = item.productName ?? product?.name ?? "Product";
            const image = item.productImage ?? product?.image ?? "";
            const slug = item.productSlug ?? product?.slug;
            if (!name) return null;
            return (
              <div key={item.id ?? `${item.productId}-${item.size}-${i}`} className="flex gap-4 sm:gap-6 p-4 sm:p-6 glass rounded-2xl">
                {slug ? (
                  <Link href={`/products/${slug}`} className="shrink-0">
                    <ProductImage src={image} alt={name} width={128} height={160} className="w-24 sm:w-32 h-32 sm:h-40 object-cover rounded-xl" />
                  </Link>
                ) : (
                  <ProductImage src={image} alt={name} width={128} height={160} className="w-24 sm:w-32 h-32 sm:h-40 object-cover rounded-xl shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  {slug ? (
                    <Link href={`/products/${slug}`} className="font-display font-semibold hover:text-violet-400 transition-colors line-clamp-2">{name}</Link>
                  ) : (
                    <p className="font-display font-semibold line-clamp-2">{name}</p>
                  )}
                  <p className="text-sm text-slate-400 mt-1">{product?.brand ?? ""} · {item.size} · {item.color}</p>
                  <p className="font-bold mt-3">{formatPrice(item.price)}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQty(i, item.qty - 1)} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20" aria-label="Decrease">−</button>
                      <span className="font-semibold w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(i, item.qty + 1)} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20" aria-label="Increase">+</button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(item.price * item.qty)}</p>
                      <button onClick={() => removeItem(i)} className="text-xs text-red-400 hover:underline mt-1">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <CartSummary />
      </div>
    </div>
  );
}
