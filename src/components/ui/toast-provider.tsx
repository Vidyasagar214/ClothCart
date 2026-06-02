"use client";

import { useToastStore } from "@/stores/order-store";
import { cn } from "@/lib/utils";

const borderColors = {
  success: "border-emerald-500/50",
  error: "border-red-500/50",
  warning: "border-amber-500/50",
  info: "border-cyan-500/50",
};

export function ToastProvider() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={cn(
            "glass-strong px-5 py-3 rounded-xl border text-sm font-medium shadow-2xl pointer-events-auto animate-fade-in",
            borderColors[toast.type]
          )}
        >
          <div className="flex items-center gap-3">
            <span>{toast.message}</span>
            <button
              onClick={() => remove(toast.id)}
              className="text-slate-400 hover:text-white ml-2"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function toast(message: string, type: "success" | "error" | "warning" | "info" = "info") {
  useToastStore.getState().add(message, type);
}
