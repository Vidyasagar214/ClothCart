import type { Product } from "@/types";
import { getProduct } from "@/lib/data/products";

let catalogCache: Product[] = [];

export function setCatalogCache(products: Product[]) {
  catalogCache = products;
}

export function resolveProduct(idOrSlug: string): Product | undefined {
  return (
    catalogCache.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ??
    getProduct(idOrSlug)
  );
}
