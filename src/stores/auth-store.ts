"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  /** @deprecated Use API login via AuthProvider */
  login: (email: string, password: string, name?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      login: (email, _password, name) => {
        set({
          user: {
            email,
            name: name || email.split("@")[0],
            joined: new Date().toISOString(),
            role: "customer",
          },
          isLoading: false,
        });
      },
      logout: () => set({ user: null, isLoading: false }),
    }),
    { name: "clothcart-auth", partialize: (s) => ({ user: s.user }) }
  )
);
