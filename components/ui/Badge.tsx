import { type ReactNode } from "react";

type BadgeVariant = "gold" | "electric" | "eco" | "navy" | "white";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: "bg-gold-500 text-white",
  electric: "bg-electric-500 text-white",
  eco: "bg-eco-500 text-white",
  navy: "bg-navy-800 text-white",
  white: "bg-white/15 text-white border border-white/25 backdrop-blur-sm",
};

export function Badge({ children, variant = "gold", className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold tracking-wide uppercase shadow-md",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
