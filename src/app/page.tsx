import { Hero, CategoryGrid, CtaBanner } from "@/components/home/hero-section";
import { BrandMarquee } from "@/components/home/brand-marquee";
import { BenefitsStrip } from "@/components/home/benefits-strip";
import { BestsellersSection } from "@/components/home/bestsellers-section";
import { EditorialSection } from "@/components/home/editorial-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { ShopByBrand } from "@/components/home/shop-by-brand";
import { LookbookSection } from "@/components/home/lookbook-section";
import { ProductGrid } from "@/components/product/product-grid";
import {
  getFeaturedProducts,
  getNewArrivals,
  listCategories,
  getBrands,
} from "@/lib/products/catalog";
import Link from "next/link";

export default async function HomePage() {
  const [featured, newArrivals, categories, brands] = await Promise.all([
    getFeaturedProducts(8),
    getNewArrivals(8),
    listCategories(),
    getBrands(),
  ]);

  return (
    <>
      <Hero />
      <BrandMarquee />
      <BenefitsStrip />
      <CategoryGrid categories={categories} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20" aria-labelledby="featured-heading">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-2">Curated Selection</p>
            <h2 id="featured-heading" className="font-display text-3xl sm:text-4xl font-bold mb-2">Featured Drops</h2>
            <p className="text-slate-400">Handpicked premium pieces</p>
          </div>
          <Link href="/products" className="hidden sm:inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-medium transition-colors">
            View All →
          </Link>
        </div>
        <ProductGrid products={featured} showQuickAdd />
      </section>

      <BestsellersSection />
      <EditorialSection />
      <LookbookSection />
      <CtaBanner />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20" aria-labelledby="new-heading">
        <div className="text-center mb-10">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-2">Just Landed</p>
          <h2 id="new-heading" className="font-display text-3xl sm:text-4xl font-bold">New Arrivals</h2>
        </div>
        <ProductGrid products={newArrivals} showQuickAdd />
      </section>

      <ShopByBrand brands={brands} />
      <TestimonialsSection />
    </>
  );
}
