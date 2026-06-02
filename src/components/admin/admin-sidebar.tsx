import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/inventory", label: "Inventory" },
];

interface AdminSidebarProps {
  activePath?: string;
}

export function AdminSidebar({ activePath }: AdminSidebarProps) {
  return (
    <aside className="hidden lg:flex w-64 flex-col glass-strong border-r border-white/10 fixed h-full z-40" aria-label="Admin navigation">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="font-display text-xl font-bold gradient-text">ClothCart</Link>
        <p className="text-xs text-slate-500 mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "admin-nav-link block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
              activePath === link.href ? "active" : "text-slate-400 hover:bg-white/5"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <Link href="/" className="text-sm text-slate-400 hover:text-white">← Back to Store</Link>
      </div>
    </aside>
  );
}
