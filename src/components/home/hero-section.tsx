import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";
import { CATEGORIES } from "@/lib/data/products";
import { IMAGES } from "@/lib/data/images";

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-16" aria-label="Hero">
      <div className="absolute inset-0">
        <ProductImage
          src={IMAGES.hero}
          alt=""
          fill
          priority
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/85 to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-hero-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-500/15 rounded-full blur-[100px] animate-hero-pulse [animation-delay:2s]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
        <div className="max-w-2xl">
          <p className="text-cyan-400 font-semibold text-sm uppercase tracking-[0.3em] mb-4 animate-fade-in">
            New Season 2026
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6 animate-fade-in [animation-delay:0.1s]">
            Wear the <span className="gradient-text">Future</span> of Fashion
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-lg leading-relaxed animate-fade-in [animation-delay:0.2s]">
            Discover premium clothing engineered for performance, designed for impact. Elevate every moment.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in [animation-delay:0.3s]">
            <Link href="/products">
              <Button size="lg" className="gap-2">
                Shop Collection
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
            <Link href="/products?category=women">
              <Button variant="outline" size="lg">Explore Women</Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-8 mt-12 animate-fade-in [animation-delay:0.4s]">
            <Stat value="50K+" label="Happy Customers" />
            <Stat value="4.8★" label="Average Rating" />
            <Stat value="Free" label="Shipping ₹999+" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl font-bold gradient-text">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}

export function CategoryGrid({ categories = CATEGORIES }: { categories?: Category[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20" aria-labelledby="categories-heading">
      <div className="text-center mb-12">
        <h2 id="categories-heading" className="font-display text-3xl sm:text-4xl font-bold mb-3">Shop by Category</h2>
        <p className="text-slate-400">Curated collections for every style</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/categories/${cat.slug}`} className="group relative rounded-2xl overflow-hidden aspect-[4/5] block">
            <ProductImage src={cat.image} alt={`${cat.name} collection`} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="font-display text-2xl font-bold mb-1">{cat.name}</h3>
              <p className="text-sm text-slate-300">{cat.count}+ styles</p>
              <span className="inline-flex items-center gap-1 mt-3 text-violet-400 text-sm font-semibold group-hover:gap-2 transition-all">
                Shop Now →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CtaBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-transparent to-cyan-500/20 pointer-events-none" />
        <div className="glass-strong p-10 sm:p-16 text-center relative border border-white/10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Wardrobe?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">Join thousands of style pioneers. Free shipping on orders over ₹999.</p>
          <Link href="/products">
            <Button variant="glow" size="lg">Start Shopping Now</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
