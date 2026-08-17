"use client";

import { useRef, useCallback, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type Color = "gold" | "electric" | "eco" | "mixed" | "white";

const gradients: Record<Color, string> = {
  gold: "radial-gradient(circle, rgba(251,191,36,0.38) 0%, rgba(251,191,36,0.12) 40%, transparent 65%)",
  electric: "radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0.10) 40%, transparent 65%)",
  eco: "radial-gradient(circle, rgba(16,185,129,0.30) 0%, rgba(16,185,129,0.08) 40%, transparent 65%)",
  mixed:
    "radial-gradient(circle, rgba(251,191,36,0.30) 0%, rgba(59,130,246,0.20) 40%, transparent 65%)",
  white: "radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 40%, transparent 65%)",
};

interface Props {
  children: ReactNode;
  className?: string;
  color?: Color;
  blobSize?: number;
}

export function MouseGradientSection({
  children,
  className = "",
  color = "gold",
  blobSize = 680,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const sx = useSpring(mx, { damping: 32, stiffness: 55, mass: 1.2 });
  const sy = useSpring(my, { damping: 32, stiffness: 55, mass: 1.2 });

  const left = useTransform(sx, (v) => `${v * 100}%`);
  const top  = useTransform(sy, (v) => `${v * 100}%`);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      mx.set((e.clientX - rect.left) / rect.width);
      my.set((e.clientY - rect.top) / rect.height);
    },
    [mx, my]
  );

  const onMouseLeave = useCallback(() => {
    mx.set(0.5);
    my.set(0.5);
  }, [mx, my]);

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Cursor-tracking blob */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0"
        style={{
          left,
          top,
          width: blobSize,
          height: blobSize,
          background: gradients[color],
          filter: "blur(48px)",
        }}
      />
      {children}
    </section>
  );
}
