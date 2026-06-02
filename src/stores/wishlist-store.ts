"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/stores/auth-store";

function isApiUser() {
  const user = useAuthStore.getState().user;
  return Boolean(user?.id && process.env.NEXT_PUBLIC_SUPABASE_URL);
}

interface WishlistStore {
  productIds: string[];
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
  syncFromServer: () => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],

      syncFromServer: async () => {
        if (!isApiUser()) return;
        try {
          const res = await fetch("/api/v1/wishlist");
          if (res.ok) {
            const data = await res.json();
            set({ productIds: data.productIds ?? [] });
          }
        } catch {
          /* keep local */
        }
      },

      toggle: (productId) => {
        const ids = get().productIds;
        const isListed = ids.includes(productId);

        if (isApiUser()) {
          void (async () => {
            try {
              if (isListed) {
                await fetch(`/api/v1/wishlist/${productId}`, { method: "DELETE" });
                set({ productIds: get().productIds.filter((id) => id !== productId) });
              } else {
                await fetch("/api/v1/wishlist", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ productId }),
                });
                set({ productIds: [...get().productIds, productId] });
              }
            } catch {
              /* ignore */
            }
          })();
          return;
        }

        if (isListed) {
          set({ productIds: ids.filter((id) => id !== productId) });
        } else {
          set({ productIds: [...ids, productId] });
        }
      },

      remove: (productId) => {
        if (isApiUser()) {
          void fetch(`/api/v1/wishlist/${productId}`, { method: "DELETE" });
        }
        set({ productIds: get().productIds.filter((id) => id !== productId) });
      },

      clear: () => set({ productIds: [] }),
      has: (productId) => get().productIds.includes(productId),
    }),
    { name: "clothcart-wishlist" }
  )
);
