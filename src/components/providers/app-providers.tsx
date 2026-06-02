"use client";

import { ToastProvider } from "@/components/ui/toast-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CatalogProvider } from "@/components/providers/catalog-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CatalogProvider>
        {children}
        <CartDrawer />
        <ToastProvider />
      </CatalogProvider>
    </AuthProvider>
  );
}
