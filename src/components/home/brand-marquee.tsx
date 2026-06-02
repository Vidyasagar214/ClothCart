const BRANDS = [
  "Apex Wear", "Lumière", "Nova Kids", "Zenith Active", "Urban Edge", "Silk & Stone", "ClothCart Exclusive",
];

export function BrandMarquee() {
  const items = [...BRANDS, ...BRANDS];

  return (
    <section className="py-8 border-y border-white/5 overflow-hidden" aria-label="Featured brands">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((brand, i) => (
          <span key={`${brand}-${i}`} className="mx-8 sm:mx-12 font-display text-lg sm:text-xl font-bold text-white/20 uppercase tracking-[0.2em]">
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}
