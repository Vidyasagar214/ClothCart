"use client";

import type { CategorySlug, SortOption } from "@/types";
import { cn } from "@/lib/utils";

export interface ProductFiltersState {
  category: CategorySlug | "";
  maxPrice: number;
  onSale: boolean;
  minRating: number;
  sort: SortOption;
}

interface ProductFiltersProps {
  filters: ProductFiltersState;
  onChange: (filters: ProductFiltersState) => void;
  onClear: () => void;
}

export function ProductFilters({ filters, onChange, onClear }: ProductFiltersProps) {
  const update = (partial: Partial<ProductFiltersState>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <aside className="lg:w-64 shrink-0" aria-label="Filters">
      <div className="glass rounded-2xl p-5 sticky top-24 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg">Filters</h2>
          <button onClick={onClear} className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
            Clear All
          </button>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-300 block mb-2">Category</label>
          <div className="space-y-2">
            {(["", "men", "women", "children"] as const).map((cat) => (
              <label key={cat || "all"} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === cat}
                  onChange={() => update({ category: cat })}
                  className="accent-violet-500"
                />
                {cat === "" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="price-range" className="text-sm font-semibold text-slate-300 block mb-2">Price Range</label>
          <input
            id="price-range"
            type="range"
            min={1000}
            max={10000}
            step={500}
            value={filters.maxPrice}
            onChange={(e) => update({ maxPrice: parseInt(e.target.value) })}
            className="w-full accent-violet-500"
          />
          <p className="text-xs text-slate-400 mt-1">Up to ₹{filters.maxPrice.toLocaleString("en-IN")}</p>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={filters.onSale}
            onChange={(e) => update({ onSale: e.target.checked })}
            className="accent-violet-500 rounded"
          />
          On Sale Only
        </label>

        <div>
          <label htmlFor="min-rating" className="text-sm font-semibold text-slate-300 block mb-2">Min Rating</label>
          <select
            id="min-rating"
            value={filters.minRating}
            onChange={(e) => update({ minRating: parseFloat(e.target.value) })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
          >
            <option value={0}>Any Rating</option>
            <option value={4}>4+ Stars</option>
            <option value={3}>3+ Stars</option>
          </select>
        </div>
      </div>
    </aside>
  );
}

export function SortSelect({ value, onChange }: { value: SortOption; onChange: (v: SortOption) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-violet-500 focus:outline-none"
      aria-label="Sort products"
    >
      <option value="new">New Arrivals</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="popularity">Popularity</option>
    </select>
  );
}

export function filterProducts(
  products: import("@/types").Product[],
  filters: ProductFiltersState,
  searchQuery?: string
) {
  let result = [...products];

  if (filters.category) result = result.filter((p) => p.category === filters.category);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q))
    );
  }
  result = result.filter((p) => p.price <= filters.maxPrice);
  if (filters.onSale) result = result.filter((p) => p.compareAt && p.compareAt > p.price);
  if (filters.minRating) result = result.filter((p) => p.rating >= filters.minRating);

  if (filters.sort === "price_asc") result.sort((a, b) => a.price - b.price);
  else if (filters.sort === "price_desc") result.sort((a, b) => b.price - a.price);
  else if (filters.sort === "popularity") result.sort((a, b) => b.reviews - a.reviews);
  else result.sort((a, b) => (b.tags.includes("new") ? 1 : 0) - (a.tags.includes("new") ? 1 : 0));

  return result;
}
