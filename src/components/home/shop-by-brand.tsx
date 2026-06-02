import Link from "next/link";
import { getBrands } from "@/lib/products/catalog";

export async function ShopByBrand({ brands: initial }: { brands?: string[] }) {
  const brands = initial ?? (await getBrands());

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20" aria-labelledby="brands-heading">
      <div className="text-center mb-12">
        <h2 id="brands-heading" className="font-display text-3xl sm:text-4xl font-bold mb-3">Shop by Brand</h2>
        <p className="text-slate-400">Discover labels you love</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {brands.map((brand) => (
          <Link
            key={brand}
            href={`/products?search=${encodeURIComponent(brand)}`}
            className="px-6 py-3 rounded-full glass text-sm font-medium hover:bg-violet-500/15 hover:border-violet-500/30 transition-all hover:-translate-y-0.5"
          >
            {brand}
          </Link>
        ))}
      </div>
    </section>
  );
}
