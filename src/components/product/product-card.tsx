"use client";

import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import type { Product } from "@/types";
import { Stars } from "@/components/ui/stars";
import { formatPrice, discountPercent } from "@/lib/utils";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  showQuickAdd?: boolean;
  priority?: boolean;
}

export function ProductCard({ product, showQuickAdd = false, priority = false }: ProductCardProps) {
  const disc = discountPercent(product.price, product.compareAt);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast("Please sign in to save items", "warning");
      return;
    }
    toggleWishlist(product.id);
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist", "info");
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const size = product.sizes[1] ?? product.sizes[0];
    const color = product.colors[0].name;
    if (addItem(product.id, size, color)) {
      toast(`${product.name} added to cart`, "success");
    }
  };

  return (
    <article className="product-card glass rounded-2xl overflow-hidden group animate-fade-in" aria-label={product.name}>
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden aspect-[3/4]">
        <ProductImage
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {disc > 0 && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            -{disc}%
          </span>
        )}
        {product.tags.includes("new") && (
          <span className="absolute top-3 right-3 bg-amber-400/95 text-black text-xs font-bold px-2.5 py-1 rounded-full">
            NEW
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      <div className="p-4">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{product.brand}</p>
        <h3 className="font-display font-semibold text-sm leading-snug mb-2 line-clamp-2">
          <Link href={`/products/${product.slug}`} className="hover:text-violet-400 transition-colors">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <Stars rating={product.rating} />
          <span className="text-xs text-slate-400 ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-lg">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="text-sm text-slate-500 line-through ml-2">{formatPrice(product.compareAt)}</span>
            )}
          </div>
          <button
            onClick={handleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "p-2 rounded-full hover:bg-white/10 transition-colors",
              isWishlisted && "text-rose-500"
            )}
          >
            <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        {showQuickAdd && (
          <button
            onClick={handleQuickAdd}
            className="mt-3 w-full btn-primary text-white text-sm font-semibold py-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            Quick Add
          </button>
        )}
      </div>
    </article>
  );
}
