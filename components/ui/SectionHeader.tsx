import { type ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  theme = "light",
  className = "",
}: SectionHeaderProps) {
  const isCenter = align === "center";
  const isDark = theme === "dark";

  return (
    <div
      className={[
        "max-w-2xl",
        isCenter ? "mx-auto text-center" : "text-left",
        className,
      ].join(" ")}
    >
      {eyebrow && (
        <p
          className={[
            "text-xs font-semibold uppercase tracking-widest mb-3",
            isDark ? "text-gold-400" : "text-gold-600",
          ].join(" ")}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={[
          "text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-balance",
          isDark ? "text-white" : "text-navy-900",
        ].join(" ")}
      >
        {title}
      </h2>
      {description && (
        <p
          className={[
            "mt-4 text-base md:text-lg leading-relaxed",
            isDark ? "text-navy-300" : "text-slate-500",
          ].join(" ")}
        >
          {description}
        </p>
      )}
    </div>
  );
}
