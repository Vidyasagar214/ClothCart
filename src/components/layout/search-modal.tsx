"use client";

import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/v1/products/search?q=${encodeURIComponent(q)}&limit=6`)
        .then((r) => r.json())
        .then((json) => setResults(json.data ?? []))
        .catch(() => setResults([]));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  const q = query.trim();

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[80] flex items-start justify-center pt-24 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-label="Search products"
    >
      <div className="glass-strong rounded-2xl w-full max-w-xl p-6 shadow-2xl animate-fade-in">
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, brands, styles..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-lg focus:border-violet-500 focus:outline-none"
          aria-label="Search"
        />
        <div className="mt-4 max-h-72 overflow-y-auto">
          {q.length >= 2 && results.length === 0 && (
            <p className="text-slate-400 text-sm p-2">No results for &ldquo;{query}&rdquo;</p>
          )}
          {results.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <ProductImage src={p.image} alt="" width={40} height={48} className="w-10 h-12 object-cover rounded-lg" />
              <div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-slate-400">{formatPrice(p.price)}</p>
              </div>
            </Link>
          ))}
          {q.length >= 2 && results.length > 0 && (
            <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={onClose} className="block text-center text-sm text-violet-400 hover:underline mt-3 py-2">
              View all results →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
