const BADGES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
    title: "Authentic Quality",
    desc: "100% genuine materials",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: "Free Shipping",
    desc: "On orders over ₹999",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "Easy Returns",
    desc: "30-day hassle-free",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Secure Checkout",
    desc: "256-bit encryption",
  },
];

export function ProductTrustBadges() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
      {BADGES.map((b) => (
        <div key={b.title} className="glass rounded-xl p-4 text-center group hover:border-violet-500/30 transition-colors">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-violet-500/15 text-violet-400 flex items-center justify-center group-hover:bg-violet-500/25 transition-colors">
            {b.icon}
          </div>
          <p className="text-xs font-semibold mb-0.5">{b.title}</p>
          <p className="text-[10px] text-slate-500">{b.desc}</p>
        </div>
      ))}
    </div>
  );
}
