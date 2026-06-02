"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How do I know my size?",
    a: "Use our Size Guide above to compare your measurements. If you're between sizes, we recommend sizing up for a more relaxed fit.",
  },
  {
    q: "What is your return policy?",
    a: "We offer free 30-day returns on unworn items with original tags. Initiate a return from your Orders page or contact support.",
  },
  {
    q: "How long does shipping take?",
    a: "Standard delivery takes 3–5 business days. Express delivery (1–2 days) is available at checkout for ₹149.",
  },
  {
    q: "Is this item true to color?",
    a: "We photograph all products in natural light. Minor variations may occur due to screen settings, but colors are represented as accurately as possible.",
  },
];

export function ProductFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mt-12 border-t border-white/10 pt-8">
      <h2 className="font-display text-xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <div key={faq.q} className="glass rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left text-sm font-medium hover:bg-white/5 transition-colors"
              aria-expanded={open === i}
            >
              {faq.q}
              <svg className={cn("w-5 h-5 text-slate-400 shrink-0 ml-4 transition-transform", open === i && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm text-slate-400 leading-relaxed">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
