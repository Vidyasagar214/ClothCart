"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import type { Product, Review } from "@/types";
import { Stars } from "@/components/ui/stars";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductTrustBadges } from "@/components/product/product-trust-badges";
import { ProductHighlights } from "@/components/product/product-highlights";
import { ProductInfoTabs } from "@/components/product/product-info-tabs";
import { ProductRatingBreakdown } from "@/components/product/product-rating-breakdown";
import { ProductSizeGuide } from "@/components/product/product-size-guide";
import { ProductFaq } from "@/components/product/product-faq";
import { ProductStickyBar } from "@/components/product/product-sticky-bar";
import { formatPrice, discountPercent } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  related: Product[];
  reviews: Review[];
}

const DEFAULT_HIGHLIGHTS = ["Premium quality construction", "Designed for everyday comfort", "Versatile styling options"];

export function ProductDetailClient({ product, related, reviews }: Props) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[Math.min(1, product.sizes.length - 1)] ?? product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [lightbox, setLightbox] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const user = useAuthStore((s) => s.user);

  const disc = discountPercent(product.price, product.compareAt);
  const highlights = product.highlights ?? DEFAULT_HIGHLIGHTS;

  const handleAddToCart = () => {
    const variant = product.variants?.find(
      (v) => v.size === selectedSize && v.color === selectedColor
    );
    if (addItem(product.id, selectedSize, selectedColor, qty, variant?.id)) {
      toast(`${product.name} added to cart`, "success");
    }
  };

  const handleWishlist = () => {
    if (!user) {
      toast("Please sign in to save items", "warning");
      return;
    }
    toggleWishlist(product.id);
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist", "info");
  };

  return (
    <>
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="text-sm text-slate-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white">Home</Link>
          {" / "}
          <Link href={`/products?category=${product.category}`} className="hover:text-white capitalize">{product.category}</Link>
          {" / "}
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <button
              onClick={() => setLightbox(true)}
              className="rounded-2xl overflow-hidden aspect-[3/4] mb-4 w-full relative group cursor-zoom-in ring-1 ring-white/10"
              aria-label="Zoom image"
            >
              <ProductImage src={activeImage} alt={product.name} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
              {disc > 0 && (
                <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  -{disc}% OFF
                </span>
              )}
            </button>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors",
                    activeImage === img ? "border-violet-500" : "border-transparent hover:border-violet-400/50"
                  )}
                  aria-label={`View image ${i + 1}`}
                >
                  <ProductImage src={img} alt="" width={80} height={96} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {product.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 text-xs font-semibold uppercase tracking-wide capitalize">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-sm text-violet-400 uppercase tracking-wider font-semibold mb-2">{product.brand}</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Stars rating={product.rating} />
              <span className="text-sm text-slate-400">{product.rating} ({product.reviews} reviews)</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6 flex-wrap">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.compareAt && <span className="text-lg text-slate-500 line-through">{formatPrice(product.compareAt)}</span>}
              {disc > 0 && <span className="bg-emerald-500/20 text-emerald-400 text-sm font-bold px-2 py-0.5 rounded-full">Save {disc}%</span>}
            </div>

            <ProductHighlights highlights={highlights} material={product.material} fit={product.fit} sku={product.sku} />

            <div className="mb-6">
              <p className="text-sm font-semibold mb-3">Color: <span className="text-slate-400 font-normal">{selectedColor}</span></p>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 border-white/20 hover:border-white/60 transition-all",
                      selectedColor === c.name && "ring-2 ring-violet-500 ring-offset-2 ring-offset-surface scale-110"
                    )}
                    style={{ background: c.hex }}
                    aria-label={c.name}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold">Size: <span className="text-slate-400 font-normal">{selectedSize}</span></p>
                <ProductSizeGuide />
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={cn(
                      "min-w-[44px] h-11 px-4 rounded-xl border border-white/20 text-sm font-medium hover:border-violet-400 transition-colors",
                      selectedSize === s && "pill-active"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-lg font-bold" aria-label="Decrease">−</button>
                <span className="text-xl font-bold w-8 text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-lg font-bold" aria-label="Increase">+</button>
                <span className={cn("text-sm", product.stock > 10 ? "text-emerald-400" : "text-amber-400")}>
                  {product.stock > 10 ? `${product.stock} in stock` : `Only ${product.stock} left`}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleAddToCart} size="lg" className="flex-1">
                Add to Cart — {formatPrice(product.price * qty)}
              </Button>
              <button
                onClick={handleWishlist}
                className={cn("sm:w-14 h-14 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors", isWishlisted && "text-rose-500")}
                aria-label="Add to wishlist"
              >
                <svg className="w-6 h-6" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <ProductTrustBadges />
            <ProductInfoTabs product={product} />

            <ProductRatingBreakdown rating={product.rating} totalReviews={product.reviews} />

            <div className="mt-8">
              <h2 className="font-display text-xl font-bold mb-6">Customer Reviews</h2>
              {reviews.length ? reviews.map((r) => (
                <div key={r.date + r.author} className="glass rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Stars rating={r.rating} />
                    <span className="text-sm font-medium">{r.author}</span>
                    <span className="text-xs text-slate-500">{r.date}</span>
                  </div>
                  <p className="text-sm text-slate-300">{r.text}</p>
                </div>
              )) : (
                <p className="text-slate-400 text-sm">No reviews yet. Be the first!</p>
              )}
            </div>

            <ProductFaq />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-white/10">
          <h2 className="font-display text-2xl font-bold mb-8">You May Also Like</h2>
          <ProductGrid products={related} />
        </section>
      )}

      <ProductStickyBar product={product} qty={qty} onAddToCart={handleAddToCart} />

      {lightbox && (
        <div className="fixed inset-0 bg-black/95 z-[80] flex items-center justify-center p-4" onClick={() => setLightbox(false)} role="dialog" aria-label="Image zoom">
          <ProductImage src={activeImage} alt={product.name} width={1200} height={1600} className="max-w-full max-h-[90vh] object-contain rounded-lg" />
        </div>
      )}
    </>
  );
}
