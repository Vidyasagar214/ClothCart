import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import { Button } from "@/components/ui/button";
import { IMAGES } from "@/lib/data/images";

export function EditorialSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20" aria-labelledby="editorial-heading">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="relative rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[600px] group ring-1 ring-white/10">
          <ProductImage
            src={IMAGES.editorial}
            alt="Summer editorial collection — curated fashion lookbook"
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-semibold uppercase tracking-wider">
                Editorial
              </span>
              <span className="text-xs text-slate-400">ClothCart</span>
            </div>
            <p className="font-display text-2xl sm:text-3xl font-bold">Summer &apos;26 Lookbook</p>
          </div>
        </div>

        <div>
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">The Edit</p>
          <h2 id="editorial-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Curated for the <span className="gradient-text">Modern Wardrobe</span>
          </h2>
          <p className="text-slate-300 leading-relaxed mb-6 max-w-lg">
            From boardroom power moves to weekend escapes — our editorial team selects pieces that transition seamlessly through every chapter of your life.
          </p>
          <ul className="space-y-3 mb-8">
            {["Performance fabrics that breathe", "Timeless silhouettes, bold details", "Sustainable sourcing where possible"].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link href="/products">
            <Button variant="outline" size="lg">Explore The Edit</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
