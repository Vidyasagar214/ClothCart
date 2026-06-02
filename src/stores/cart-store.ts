"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import { resolveProduct } from "@/lib/products/cache";
import { useAuthStore } from "@/stores/auth-store";

function isApiUser() {
  const user = useAuthStore.getState().user;
  return Boolean(user?.id && process.env.NEXT_PUBLIC_SUPABASE_URL);
}

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (productId: string, size: string, color: string, qty?: number, variantId?: string) => boolean;
  updateQty: (index: number, qty: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  syncFromServer: () => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      setItems: (items) => set({ items }),

      syncFromServer: async () => {
        if (!isApiUser()) return;
        try {
          const res = await fetch("/api/v1/cart");
          if (res.ok) {
            const data = await res.json();
            set({ items: data.items ?? [] });
          }
        } catch {
          /* keep local */
        }
      },

      addItem: (productId, size, color, qty = 1, variantId) => {
        const product = resolveProduct(productId);
        if (!product || product.stock <= 0) return false;

        if (isApiUser()) {
          set({ isDrawerOpen: true });
          void (async () => {
            try {
              const res = await fetch("/api/v1/cart/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, size, color, quantity: qty, variantId }),
              });
              if (res.ok) {
                const data = await res.json();
                set({ items: data.items ?? [] });
              }
            } catch {
              /* ignore */
            }
          })();
          return true;
        }

        const items = [...get().items];
        const existing = items.find(
          (i) => i.productId === productId && i.size === size && i.color === color
        );

        if (existing) {
          existing.qty = Math.min(existing.qty + qty, product.stock);
        } else {
          items.push({ productId, size, color, qty: Math.min(qty, product.stock), price: product.price });
        }

        set({ items, isDrawerOpen: true });
        return true;
      },

      updateQty: (index, qty) => {
        const items = [...get().items];
        const item = items[index];
        if (!item) return;

        if (qty < 1) {
          get().removeItem(index);
          return;
        }

        if (isApiUser() && item.id) {
          void (async () => {
            try {
              const res = await fetch(`/api/v1/cart/items/${item.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity: qty }),
              });
              if (res.ok) {
                const data = await res.json();
                set({ items: data.items ?? [] });
              }
            } catch {
              /* ignore */
            }
          })();
          return;
        }

        const product = resolveProduct(item.productId);
        item.qty = Math.min(qty, product?.stock ?? 99);
        set({ items });
      },

      removeItem: (index) => {
        const items = get().items;
        const item = items[index];
        if (!item) return;

        if (isApiUser() && item.id) {
          void (async () => {
            try {
              const res = await fetch(`/api/v1/cart/items/${item.id}`, { method: "DELETE" });
              if (res.ok || res.status === 204) {
                await get().syncFromServer();
              }
            } catch {
              /* ignore */
            }
          })();
          return;
        }

        set({ items: items.filter((_, i) => i !== index) });
      },

      clearCart: () => {
        if (isApiUser()) {
          void fetch("/api/v1/cart", { method: "DELETE" });
        }
        set({ items: [] });
      },

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set({ isDrawerOpen: !get().isDrawerOpen }),
    }),
    { name: "clothcart-cart" }
  )
);

export async function mergeGuestCartOnLogin() {
  const guestItems = useCartStore.getState().items;
  const payload = guestItems.map((i) => ({
    productId: i.productId,
    size: i.size,
    color: i.color,
    qty: i.qty,
  }));

  try {
    const res = await fetch("/api/v1/cart/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: payload }),
    });
    if (res.ok) {
      const data = await res.json();
      useCartStore.getState().setItems(data.items ?? []);
      return;
    }
  } catch {
    /* fall through */
  }
  await useCartStore.getState().syncFromServer();
}
