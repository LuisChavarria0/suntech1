"use client";

import { useEffect, useRef, type ReactNode } from "react";

const NORMAL_SPEED = 40; // px/s
const SLOW_SPEED = 8; // px/s while hovered

export function MarqueeRow({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(NORMAL_SPEED);
  const offsetRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const halfWidth = track.scrollWidth / 2;
    let frameId: number;
    let lastTime = performance.now();

    const tick = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      offsetRef.current -= speedRef.current * dt;
      if (offsetRef.current <= -halfWidth) {
        offsetRef.current += halfWidth;
      }

      track.style.transform = `translateX(${offsetRef.current}px)`;
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div
      className="relative flex-1 min-w-0 overflow-hidden mask-[linear-gradient(90deg,transparent,black_5%,black_95%,transparent)]"
      onMouseEnter={() => {
        speedRef.current = SLOW_SPEED;
      }}
      onMouseLeave={() => {
        speedRef.current = NORMAL_SPEED;
      }}
    >
      <div ref={trackRef} className="flex items-center gap-20 w-max will-change-transform">
        {children}
      </div>
    </div>
  );
}
