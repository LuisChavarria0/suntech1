import Link from "next/link";
import { type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  external?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gold-500 text-navy-900 hover:bg-gold-400 shadow-md hover:shadow-lg font-semibold",
  secondary:
    "bg-navy-800 text-white hover:bg-navy-700 shadow-md hover:shadow-lg font-semibold",
  ghost: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm font-medium border border-white/20",
  outline:
    "bg-transparent text-navy-900 border-2 border-navy-900 hover:bg-navy-900 hover:text-white font-semibold",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-lg",
  md: "h-11 px-6 text-sm rounded-xl",
  lg: "h-13 px-8 text-base rounded-xl",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  external,
  className = "",
  onClick,
  type = "button",
  disabled,
  fullWidth,
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer select-none",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    disabled ? "opacity-50 cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
