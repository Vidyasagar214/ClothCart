"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product, CategorySlug } from "@/types";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters, SortSelect, type ProductFiltersState } from "@/components/product/product-filters";

const defaultFilters: ProductFiltersState = {
  category: "",
  maxPrice: 10000,
  onSale: false,
  minRating: 0,
  sort: "new",
};

function buildQuery(filters: ProductFiltersState, searchQuery: string, page = 1) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", "24");
  if (filters.category) params.set("category", filters.category);
  if (filters.maxPrice < 10000) params.set("maxPrice", String(filters.maxPrice));
  if (filters.onSale) params.set("onSale", "true");
  if (filters.minRating) params.set("minRating", String(filters.minRating));
  if (filters.sort) params.set("sort", filters.sort);
  if (searchQuery) params.set("q", searchQuery);
  return params.toString();
}

export function ProductsPageClient() {
  const searchParams = useSearchParams();
  const categoryParam = (searchParams.get("category") as CategorySlug) || "";
  const searchQuery = searchParams.get("q") || "";

  const [filters, setFilters] = useState<ProductFiltersState>({
    ...defaultFilters,
    category: categoryParam,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFilters((f) => ({ ...f, category: categoryParam }));
  }, [categoryParam]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const qs = buildQuery(filters, searchQuery);
      const res = await fetch(`/api/v1/products?${qs}`);
      const json = await res.json();
      setProducts(json.data ?? []);
      setTotal(json.meta?.total ?? json.data?.length ?? 0);
    } catch {
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const title = searchQuery
    ? `Search: "${searchQuery}"`
    : filters.category
      ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
      : "All Products";

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">{title}</h1>
        <p className="text-slate-400">
          {loading ? "Loading..." : `${total} product${total !== 1 ? "s" : ""} found`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <ProductFilters
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters({ ...defaultFilters, category: "" })}
        />

        <div className="flex-1">
          <div className="flex justify-end mb-6">
            <SortSelect value={filters.sort} onChange={(sort) => setFilters({ ...filters, sort })} />
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <ProductGrid products={products} showQuickAdd />
          ) : (
            <div className="text-center py-20 text-slate-400">
              <p className="text-lg mb-4">No products match your filters</p>
              <button
                onClick={() => setFilters({ ...defaultFilters, category: "" })}
                className="btn-primary text-white px-6 py-2 rounded-full text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
