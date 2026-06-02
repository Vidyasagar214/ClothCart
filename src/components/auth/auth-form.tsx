"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function AuthField({ label, ...props }: AuthFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1">{label}</label>
      <input
        {...props}
        className={cn(
          "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 focus:outline-none",
          props.className
        )}
      />
    </div>
  );
}

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="pt-24 pb-20 flex items-center justify-center px-4 min-h-[80vh]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">{title}</h1>
          {subtitle && <p className="text-slate-400">{subtitle}</p>}
        </div>
        <div className="glass rounded-2xl p-6 sm:p-8">{children}</div>
        {footer && <div className="text-center mt-6 text-sm text-slate-400">{footer}</div>}
      </div>
    </div>
  );
}

export function AuthLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-violet-400 hover:text-violet-300 transition-colors">
      {children}
    </Link>
  );
}
