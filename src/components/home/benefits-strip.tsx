const BENEFITS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: "Free Shipping",
    desc: "On all orders above ₹999",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "Easy Returns",
    desc: "30-day hassle-free policy",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Quality Assured",
    desc: "Premium materials only",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "24/7 Support",
    desc: "We're here to help anytime",
  },
];

export function BenefitsStrip() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12" aria-label="Store benefits">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {BENEFITS.map((b) => (
          <div key={b.title} className="glass rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center group hover:border-violet-500/20 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 text-violet-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {b.icon}
            </div>
            <h3 className="font-semibold text-sm sm:text-base mb-1">{b.title}</h3>
            <p className="text-xs sm:text-sm text-slate-400">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
