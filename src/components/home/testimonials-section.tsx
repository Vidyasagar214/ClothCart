import { ProductImage } from "@/components/ui/product-image";
import { Stars } from "@/components/ui/stars";
import { IMAGES } from "@/lib/data/images";

const TESTIMONIALS = [
  {
    name: "Ananya R.",
    role: "Fashion Blogger",
    rating: 5,
    text: "ClothCart has completely elevated my wardrobe. The quality is unmatched and delivery is always on time. My go-to for premium pieces.",
  },
  {
    name: "Rahul M.",
    role: "Creative Director",
    rating: 5,
    text: "Finally, an Indian e-commerce brand that feels truly premium. The Nebula jacket alone was worth every rupee — fits like a dream.",
  },
  {
    name: "Sarah K.",
    role: "Yoga Instructor",
    rating: 5,
    text: "The activewear collection is incredible. Soft, sustainable, and stylish. I've recommended ClothCart to all my studio clients.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative py-24 overflow-hidden" aria-labelledby="testimonials-heading">
      <div className="absolute inset-0">
        <ProductImage src={IMAGES.testimonialBg} alt="" fill sizes="100vw" className="object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/95 to-surface" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-2">Loved by Thousands</p>
          <h2 id="testimonials-heading" className="font-display text-3xl sm:text-4xl font-bold">What Our Customers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <blockquote key={t.name} className="glass rounded-2xl p-6 sm:p-8 hover:border-violet-500/20 transition-colors">
              <Stars rating={t.rating} />
              <p className="text-slate-300 text-sm leading-relaxed my-5">&ldquo;{t.text}&rdquo;</p>
              <footer>
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
