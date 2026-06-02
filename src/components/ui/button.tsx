import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "glow" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "btn-primary text-white",
      glow: "btn-glow text-white",
      ghost: "hover:bg-white/10 text-slate-300",
      outline: "border border-white/20 hover:bg-white/5",
    };
    const sizes = {
      sm: "px-4 py-2 text-sm rounded-lg",
      md: "px-6 py-2.5 text-sm rounded-xl font-semibold",
      lg: "px-8 py-4 text-lg rounded-full font-semibold",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-colors disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
