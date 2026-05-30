import { type ReactNode } from "react";

type BadgeVariant = "gold" | "electric" | "eco" | "navy" | "white";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: "bg-gold-500/15 text-gold-600 border border-gold-500/30",
  electric: "bg-electric-500/15 text-electric-600 border border-electric-500/30",
  eco: "bg-eco-500/15 text-eco-600 border border-eco-500/30",
  navy: "bg-navy-800 text-white border border-navy-700",
  white: "bg-white/15 text-white border border-white/25 backdrop-blur-sm",
};

export function Badge({ children, variant = "gold", className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
