"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { mergeGuestCartOnLogin } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import type { User } from "@/types";

function mapProfile(data: {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt?: string;
}): User {
  return {
    id: data.id,
    email: data.email,
    name: data.fullName,
    role: data.role as User["role"],
    joined: data.createdAt ?? new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    let previousUserId: string | undefined;

    async function syncSession() {
      try {
        const res = await fetch("/api/v1/auth/me");
        if (res.ok) {
          const data = await res.json();
          const user = mapProfile(data);
          setUser(user);

          if (user.id && user.id !== previousUserId) {
            await mergeGuestCartOnLogin();
            await useWishlistStore.getState().syncFromServer();
            previousUserId = user.id;
          }
        } else {
          setUser(null);
          previousUserId = undefined;
        }
      } catch {
        setUser(null);
        previousUserId = undefined;
      }
    }

    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      syncSession();
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
