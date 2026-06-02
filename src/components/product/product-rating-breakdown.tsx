interface Props {
  rating: number;
  totalReviews: number;
}

export function ProductRatingBreakdown({ rating, totalReviews }: Props) {
  const distribution = [
    { stars: 5, pct: Math.min(100, Math.round((rating / 5) * 100 * 0.72)) },
    { stars: 4, pct: Math.round((rating / 5) * 100 * 0.18) },
    { stars: 3, pct: Math.round((rating / 5) * 100 * 0.06) },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 1 },
  ];

  return (
    <div className="glass rounded-2xl p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-8 items-start">
        <div className="text-center sm:text-left shrink-0">
          <p className="font-display text-5xl font-bold gradient-text">{rating}</p>
          <p className="text-sm text-slate-400 mt-1">{totalReviews.toLocaleString()} reviews</p>
        </div>
        <div className="flex-1 w-full space-y-2">
          {distribution.map((d) => (
            <div key={d.stars} className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-8">{d.stars}★</span>
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-700"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 w-8">{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
