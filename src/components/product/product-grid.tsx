import type { Product } from "@/types";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  showQuickAdd?: boolean;
}

export function ProductGrid({ products, showQuickAdd = false }: ProductGridProps) {
  if (!products.length) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} showQuickAdd={showQuickAdd} priority={i < 4} />
      ))}
    </div>
  );
}
