"use client";

import { createContext, useContext, useEffect } from "react";
import type { Product } from "@/types";
import { setCatalogCache } from "@/lib/products/cache";

const CatalogContext = createContext<Product[]>([]);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const products: Product[] = [];

  useEffect(() => {
    fetch("/api/v1/products?limit=100")
      .then((r) => r.json())
      .then((json) => {
        const data: Product[] = json.data ?? [];
        setCatalogCache(data);
      })
      .catch(() => setCatalogCache([]));
  }, []);

  return <CatalogContext.Provider value={products}>{children}</CatalogContext.Provider>;
}

export function useCatalogProducts() {
  return useContext(CatalogContext);
}

