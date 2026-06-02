"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-white/10 mt-20" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h2 className="font-display text-2xl font-bold gradient-text mb-4">ClothCart</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Premium fashion for the bold. Elevate your wardrobe with world-class design and cinematic style.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/products?category=men" className="hover:text-white transition-colors">Men</Link></li>
              <li><Link href="/products?category=women" className="hover:text-white transition-colors">Women</Link></li>
              <li><Link href="/products?category=children" className="hover:text-white transition-colors">Children</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Contact Us</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Shipping & Returns</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Size Guide</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">FAQ</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Stay Connected</h3>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                required
                aria-label="Email for newsletter"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
              />
              <button type="submit" className="btn-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0">
                Join
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} ClothCart. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Visa</span><span>Mastercard</span><span>UPI</span><span>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const links = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/products", label: "Shop", icon: ShopIcon },
    { href: "/cart", label: "Cart", icon: CartIcon, isCart: true },
    { href: "/login", label: "Account", icon: AccountIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden glass-strong border-t border-white/10 z-40 pb-safe" aria-label="Mobile navigation">
      <div className="flex justify-around py-3">
        {links.map(({ href, label, icon: Icon, isCart }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          if (isCart) {
            return <CartNavButton key={href} label={label} Icon={Icon} active={active} />;
          }
          return (
            <Link
              key={href}
              href={href}
              className={cn("flex flex-col items-center gap-1 min-w-[44px]", active ? "text-violet-400" : "text-slate-400")}
              aria-current={active ? "page" : undefined}
            >
              <Icon />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function CartNavButton({ label, Icon, active }: { label: string; Icon: React.ComponentType; active: boolean }) {
  const toggleDrawer = useCartStore((s) => s.toggleDrawer);
  return (
    <button
      onClick={toggleDrawer}
      className={cn("flex flex-col items-center gap-1 min-w-[44px]", active ? "text-violet-400" : "text-slate-400")}
      aria-label={label}
    >
      <Icon />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function ShopIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
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

function AccountIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
