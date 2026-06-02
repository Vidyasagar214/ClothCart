"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/profile", label: "Profile" },
  { href: "/orders", label: "Orders" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/returns", label: "Returns" },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="md:col-span-1">
      <nav className="glass rounded-2xl p-4 space-y-1" aria-label="Account navigation">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block px-4 py-2.5 rounded-lg transition-colors",
              pathname === link.href ? "bg-violet-600/20 text-violet-300 font-medium" : "hover:bg-white/10 text-slate-300"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
