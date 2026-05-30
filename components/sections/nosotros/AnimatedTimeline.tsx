"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useTranslations } from "next-intl";

function TimelineItem({
  item,
  index,
}: {
  item: { year: string; title: string; description: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex flex-col md:flex-row gap-6 md:gap-10 ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Dot + pulse */}
      <div className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 z-10">
        <motion.div
          className="absolute inset-0 rounded-full bg-gold-400"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={inView ? { scale: 3, opacity: 0 } : { scale: 1, opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        />
        <motion.div
          className="relative w-4 h-4 rounded-full bg-gold-500 border-2 border-white shadow-md"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 400, damping: 15 }}
        />
      </div>

      {/* Card */}
      <motion.div
        className={`ml-10 md:ml-0 md:w-1/2 ${isEven ? "md:pr-14 md:text-right" : "md:pl-14"}`}
        initial={{ opacity: 0, x: isEven ? -48 : 48 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="bg-white rounded-2xl border border-slate-100 p-6 w-full shadow-[0_4px_24px_-4px_rgba(10,15,30,0.1)] hover:shadow-[0_8px_32px_-8px_rgba(10,15,30,0.18)] transition-shadow duration-300">
          <motion.span
            className="inline-block text-xs font-bold text-gold-600 uppercase tracking-widest mb-2 bg-gold-500/8 rounded-md px-2 py-0.5"
            initial={{ opacity: 0, y: -8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            {item.year}
          </motion.span>
          <motion.h3
            className="font-bold text-navy-900 mb-2"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {item.title}
          </motion.h3>
          <motion.p
            className="text-slate-500 text-sm leading-relaxed"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {item.description}
          </motion.p>
        </div>
      </motion.div>

      <div className="hidden md:block md:w-1/2" />
    </div>
  );
}

export function AnimatedTimeline() {
  const t = useTranslations("timeline");
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 30%"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const entries = Array.from({ length: 11 }, (_, i) => ({
    year: t(`e${i + 1}_year` as `e${number}_year`),
    title: t(`e${i + 1}_title` as `e${number}_title`),
    description: t(`e${i + 1}_desc` as `e${number}_desc`),
  }));

  return (
    <div ref={containerRef} className="relative">
      {/* Track line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-px" />
      {/* Animated fill */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px overflow-hidden -translate-x-px">
        <motion.div style={{ height: lineHeight }} className="w-full origin-top" initial={{ height: "0%" }}>
          <div className="w-full h-full bg-gradient-to-b from-gold-500 via-gold-400 to-gold-300/40" />
        </motion.div>
      </div>

      <div className="space-y-12">
        {entries.map((item, i) => (
          <TimelineItem key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
