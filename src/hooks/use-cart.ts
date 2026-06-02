"use client";

import { useMemo } from "react";
import { useCartStore } from "@/stores/cart-store";
import { calcCartTotals, cartItemCount } from "@/lib/utils/cart";

export function useCartItems() {
  return useCartStore((s) => s.items);
}

export function useCartTotals() {
  const items = useCartItems();
  return useMemo(() => calcCartTotals(items), [items]);
}

export function useCartCount() {
  const items = useCartItems();
  return useMemo(() => cartItemCount(items), [items]);
}
