"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);

  const springConfig = { damping: 28, stiffness: 120, mass: 0.6 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const visible = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!visible.current) visible.current = true;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onLeave = () => {
      mouseX.set(-400);
      mouseY.set(-400);
    };

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Outer large glow */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(251,191,36,0.06) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Inner sharper glow */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: 180,
          height: 180,
          background:
            "radial-gradient(circle, rgba(251,191,36,0.09) 0%, transparent 70%)",
          filter: "blur(18px)",
        }}
      />
    </>
  );
}
