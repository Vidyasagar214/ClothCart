"use client";

import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import { useAuthStore } from "@/stores/auth-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";
import { resolveProduct } from "@/lib/products/cache";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/components/ui/toast-provider";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const user = useAuthStore((s) => s.user);
  const productIds = useWishlistStore((s) => s.productIds);
  const remove = useWishlistStore((s) => s.remove);
  const clear = useWishlistStore((s) => s.clear);
  const addItem = useCartStore((s) => s.addItem);

  const products = productIds.map((id) => resolveProduct(id)).filter(Boolean);

  const moveAllToCart = () => {
    products.forEach((p) => {
      if (p) addItem(p.id, p.sizes[0], p.colors[0].name);
    });
    clear();
    toast("All items moved to cart", "success");
  };

  if (!user) {
    return (
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 text-center py-20">
        <p className="text-slate-400 mb-6">Sign in to save your favorite items</p>
        <Link href="/login?redirect=/wishlist"><Button>Sign In</Button></Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">My Wishlist</h1>
        {products.length > 0 && (
          <Button onClick={moveAllToCart} size="sm">Move All to Cart</Button>
        )}
      </div>

      {!products.length ? (
        <div className="text-center py-20 text-slate-400">
          <p className="mb-6">Your wishlist is empty</p>
          <Link href="/products"><Button>Explore Products</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => p && (
            <div key={p.id} className="product-card glass rounded-2xl overflow-hidden">
              <Link href={`/products/${p.slug}`} className="block aspect-[3/4] relative overflow-hidden">
                <ProductImage src={p.image} alt={p.name} fill sizes="25vw" className="object-cover" />
              </Link>
              <div className="p-4">
                <h3 className="font-display font-semibold text-sm mb-2">
                  <Link href={`/products/${p.slug}`} className="hover:text-violet-400">{p.name}</Link>
                </h3>
                <p className="font-bold mb-3">{formatPrice(p.price)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { addItem(p.id, p.sizes[0], p.colors[0].name); toast("Added to cart", "success"); }}
                    className="flex-1 btn-primary text-white text-xs py-2 rounded-lg font-semibold"
                  >
                    Add to Cart
                  </button>
                  <button onClick={() => remove(p.id)} className="p-2 rounded-lg glass text-red-400 hover:bg-red-500/10" aria-label="Remove">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
