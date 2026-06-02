"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/product-image";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface Props {
  product: Product;
  qty: number;
  onAddToCart: () => void;
}

export function ProductStickyBar({ product, qty, onAddToCart }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden glass-strong border-t border-white/10 px-4 py-3 animate-slide-up">
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <div className="relative w-12 h-14 rounded-lg overflow-hidden shrink-0">
          <ProductImage src={product.image} alt="" fill sizes="48px" className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{product.name}</p>
          <p className="text-sm text-violet-400 font-bold">{formatPrice(product.price * qty)}</p>
        </div>
        <Button onClick={onAddToCart} size="sm" className="shrink-0">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
