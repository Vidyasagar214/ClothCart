"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

const TABS = ["Details", "Care", "Shipping"] as const;
type Tab = (typeof TABS)[number];

interface Props {
  product: Product;
}

export function ProductInfoTabs({ product }: Props) {
  const [active, setActive] = useState<Tab>("Details");
  const care = product.care ?? ["Machine wash cold", "Do not bleach", "Tumble dry low", "Iron on low heat"];

  return (
    <div className="mt-10 border-t border-white/10 pt-8">
      <div className="flex gap-1 mb-6 p-1 glass rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              "px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
              active === tab ? "bg-violet-500/20 text-white" : "text-slate-400 hover:text-white"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="text-sm text-slate-300 leading-relaxed max-w-2xl">
        {active === "Details" && (
          <div className="space-y-4">
            <p>{product.description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {product.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-xs capitalize text-slate-400 border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        {active === "Care" && (
          <ul className="space-y-2">
            {care.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <span className="text-violet-400">•</span> {c}
              </li>
            ))}
          </ul>
        )}
        {active === "Shipping" && (
          <div className="space-y-3">
            <p><strong className="text-white">Standard Delivery:</strong> 3–5 business days (Free on orders ₹999+)</p>
            <p><strong className="text-white">Express Delivery:</strong> 1–2 business days (₹149)</p>
            <p><strong className="text-white">Returns:</strong> Free 30-day returns. Items must be unworn with tags attached.</p>
          </div>
        )}
      </div>
    </div>
  );
}
