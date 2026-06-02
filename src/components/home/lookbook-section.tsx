import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import { IMAGES } from "@/lib/data/images";

const LOOKS = [
  { title: "Urban Minimal", tag: "Men", href: "/products?category=men", image: IMAGES.lookbook },
  { title: "Evening Glow", tag: "Women", href: "/products?category=women", image: IMAGES.cocktailDress },
  { title: "Play & Explore", tag: "Kids", href: "/products?category=children", image: IMAGES.kidsPlay },
];

export function LookbookSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20" aria-labelledby="lookbook-heading">
      <div className="text-center mb-12">
        <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-2">Inspiration</p>
        <h2 id="lookbook-heading" className="font-display text-3xl sm:text-4xl font-bold mb-3">Style Lookbook</h2>
        <p className="text-slate-400">Three moods, infinite possibilities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {LOOKS.map((look) => (
          <Link key={look.title} href={look.href} className="group relative rounded-2xl overflow-hidden aspect-[3/4] block">
            <ProductImage src={look.image} alt={look.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-xs uppercase tracking-widest text-violet-400 font-semibold">{look.tag}</span>
              <h3 className="font-display text-xl font-bold mt-1 group-hover:text-violet-300 transition-colors">{look.title}</h3>
              <span className="inline-flex items-center gap-1 mt-2 text-sm text-slate-300 group-hover:gap-2 transition-all">
                Shop the look →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
