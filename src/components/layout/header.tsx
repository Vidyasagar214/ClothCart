"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { useCartCount } from "@/hooks/use-cart";
import { useAuthStore } from "@/stores/auth-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { SearchModal } from "@/components/layout/search-modal";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const cartCount = useCartCount();
  const toggleDrawer = useCartStore((s) => s.toggleDrawer);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  async function handleLogout() {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch {
      /* offline fallback */
    }
    logout();
    setAccountOpen(false);
    router.push("/");
    router.refresh();
  }

  if (pathname.startsWith("/admin")) return null;

  const navLinks = [
    { href: "/products?category=men", label: "Men" },
    { href: "/products?category=women", label: "Women" },
    { href: "/products?category=children", label: "Kids" },
    { href: "/products", label: "Shop All" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">
            <Link href="/" className="font-display text-2xl font-bold gradient-text tracking-tight">
              ClothCart
            </Link>

            <nav className="hidden lg:flex items-center gap-8" aria-label="Main">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <IconButton label="Search" onClick={() => setSearchOpen(true)}>
                <SearchIcon />
              </IconButton>

              <Link href="/wishlist" className="relative p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Wishlist">
                <HeartIcon />
                {wishlistCount > 0 && (
                  <Badge count={wishlistCount} color="rose" />
                )}
              </Link>

              <button
                onClick={toggleDrawer}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Shopping cart"
              >
                <CartIcon />
                {cartCount > 0 && <Badge count={cartCount} color="violet" />}
              </button>

              {user ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setAccountOpen(!accountOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/10"
                    aria-label="Account menu"
                    aria-expanded={accountOpen}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                      {user.name[0].toUpperCase()}
                    </div>
                  </button>
                  {accountOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-xl py-2 z-50 shadow-2xl">
                        <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-white/10" onClick={() => setAccountOpen(false)}>Profile</Link>
                        <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-white/10" onClick={() => setAccountOpen(false)}>Orders</Link>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 text-red-400">Sign Out</button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/login" className="hidden sm:inline-flex btn-primary text-white text-sm font-semibold px-5 py-2 rounded-full">
                  Sign In
                </Link>
              )}

              <button
                className="lg:hidden p-2 rounded-full hover:bg-white/10"
                aria-label="Menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden glass border-t border-white/10">
            <nav className="flex flex-col p-4 gap-1" aria-label="Mobile">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="py-2.5 px-3 rounded-lg hover:bg-white/10" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link href="/login" className="py-2.5 px-3 rounded-lg bg-violet-600 text-center font-semibold mt-2" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function IconButton({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label={label}>
      {children}
    </button>
  );
}

function Badge({ count, color }: { count: number; color: "violet" | "rose" }) {
  return (
    <span className={cn(
      "absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center",
      color === "violet" ? "bg-violet-500" : "bg-rose-500"
    )}>
      {count}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
