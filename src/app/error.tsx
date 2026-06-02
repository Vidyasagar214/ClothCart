"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="pt-32 pb-20 text-center px-4">
      <h1 className="font-display text-2xl font-bold mb-3">Something went wrong</h1>
      <p className="text-slate-400 mb-8">We encountered an unexpected error. Please try again.</p>
      <button onClick={reset} className="btn-primary text-white px-8 py-3 rounded-full font-semibold">
        Try Again
      </button>
    </div>
  );
}
