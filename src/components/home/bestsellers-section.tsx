import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { getBestSellers } from "@/lib/products/catalog";
import type { Product } from "@/types";

export async function BestsellersSection({ products: initial }: { products?: Product[] }) {
  const products = initial ?? (await getBestSellers(8));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20" aria-labelledby="bestsellers-heading">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-2">Trending Now</p>
          <h2 id="bestsellers-heading" className="font-display text-3xl sm:text-4xl font-bold">Best Sellers</h2>
        </div>
        <Link href="/products?sort=popularity" className="hidden sm:inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-medium transition-colors">
          View All →
        </Link>
      </div>
      <ProductGrid products={products} showQuickAdd />
    </section>
  );
}
