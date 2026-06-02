"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, ShippingAddress, PaymentMethod, CartItem, CartTotals } from "@/types";

interface OrderStore {
  orders: Order[];
  placeOrder: (
    items: CartItem[],
    totals: CartTotals,
    address: ShippingAddress,
    paymentMethod: PaymentMethod
  ) => Order;
  cancelOrder: (orderId: string) => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      placeOrder: (items, totals, address, paymentMethod) => {
        const order: Order = {
          id: "CC" + Date.now().toString(36).toUpperCase(),
          items: [...items],
          totals,
          address,
          paymentMethod,
          status: "confirmed",
          createdAt: new Date().toISOString(),
          timeline: [
            { status: "confirmed", date: new Date().toISOString(), label: "Order Confirmed" },
            { status: "processing", date: null, label: "Processing" },
            { status: "shipped", date: null, label: "Shipped" },
            { status: "delivered", date: null, label: "Delivered" },
          ],
        };
        set({ orders: [order, ...get().orders] });
        return order;
      },

      cancelOrder: (orderId) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId && (o.status === "confirmed" || o.status === "processing")
              ? { ...o, status: "cancelled" as const }
              : o
          ),
        });
      },
    }),
    { name: "clothcart-orders" }
  )
);

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface ToastStore {
  toasts: Toast[];
  add: (message: string, type?: Toast["type"]) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type = "info") => {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
