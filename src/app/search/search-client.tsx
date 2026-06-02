"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/types";
import { ProductGrid } from "@/components/product/product-grid";

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (q.length < 2) {
      setProducts([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/v1/products/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((json) => {
        setProducts(json.data ?? []);
        setTotal(json.meta?.total ?? 0);
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <h1 className="font-display text-3xl font-bold mb-2">
        {q ? `Results for "${q}"` : "Search"}
      </h1>
      <p className="text-slate-400 mb-8">
        {loading ? "Searching..." : `${total} result${total !== 1 ? "s" : ""}`}
      </p>

      {q.length < 2 ? (
        <p className="text-slate-400">Enter at least 2 characters to search.</p>
      ) : loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length ? (
        <ProductGrid products={products} showQuickAdd />
      ) : (
        <div className="text-center py-16 text-slate-400">
          <p className="mb-4">No products found for &ldquo;{q}&rdquo;</p>
          <Link href="/products" className="text-violet-400 hover:underline">
            Browse all products
          </Link>
        </div>
      )}
    </div>
  );
}
