interface Props {
  highlights: string[];
  material?: string;
  fit?: string;
  sku?: string;
}

export function ProductHighlights({ highlights, material, fit, sku }: Props) {
  const meta = [
    material && { label: "Material", value: material },
    fit && { label: "Fit", value: fit },
    sku && { label: "SKU", value: sku },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="glass rounded-2xl p-6 mb-8">
      {highlights.length > 0 && (
        <>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-400 mb-4">Highlights</h3>
          <ul className="space-y-2.5 mb-6">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </>
      )}
      {meta.length > 0 && (
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="text-xs text-slate-500 uppercase tracking-wider mb-1">{m.label}</dt>
              <dd className="text-sm font-medium">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
