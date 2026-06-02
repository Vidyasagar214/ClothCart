"use client";

import { useState } from "react";

const SIZE_CHART = [
  { size: "XS", chest: "86", waist: "66", hip: "90" },
  { size: "S", chest: "91", waist: "71", hip: "95" },
  { size: "M", chest: "96", waist: "76", hip: "100" },
  { size: "L", chest: "101", waist: "81", hip: "105" },
  { size: "XL", chest: "106", waist: "86", hip: "110" },
  { size: "XXL", chest: "111", waist: "91", hip: "115" },
];

export function ProductSizeGuide() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-violet-400 hover:text-violet-300 underline underline-offset-4 transition-colors"
      >
        Size Guide
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-label="Size guide">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative glass-strong rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold">Size Guide</h3>
              <button onClick={() => setOpen(false)} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center" aria-label="Close">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-sm text-slate-400 mb-4">All measurements in centimeters. For the best fit, measure yourself and compare.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-4 font-semibold text-violet-400">Size</th>
                    <th className="text-left py-3 px-2 font-semibold">Chest</th>
                    <th className="text-left py-3 px-2 font-semibold">Waist</th>
                    <th className="text-left py-3 pl-2 font-semibold">Hip</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_CHART.map((row) => (
                    <tr key={row.size} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 pr-4 font-medium">{row.size}</td>
                      <td className="py-3 px-2 text-slate-300">{row.chest}</td>
                      <td className="py-3 px-2 text-slate-300">{row.waist}</td>
                      <td className="py-3 pl-2 text-slate-300">{row.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-4">Between sizes? We recommend sizing up for a relaxed fit.</p>
          </div>
        </div>
      )}
    </>
  );
}
