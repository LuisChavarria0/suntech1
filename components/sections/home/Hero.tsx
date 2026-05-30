"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, MessageCircle, Zap } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { WHATSAPP_URL, COMPANY_INFO } from "@/lib/data/company";

export function Hero() {
  const t = useTranslations("hero");
  const tc = useTranslations("common");

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-navy-950">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src="/media/video-inicial.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-navy-950/65" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-950 to-transparent pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 60%, rgba(251,191,36,0.07) 0%, transparent 55%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container-tight pt-24 pb-16 flex flex-col items-center text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 blur-2xl scale-110 opacity-30 bg-gold-400 rounded-full" />
            <Image
              src={COMPANY_INFO.logoUrl}
              alt="Grupo Suntech"
              width={600}
              height={180}
              className="relative w-56 md:w-72 lg:w-80 h-auto object-contain brightness-0 invert drop-shadow-2xl"
              priority
            />
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400 backdrop-blur-sm mb-8">
            <Zap className="h-3 w-3" />
            {t("badge")}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight text-balance max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {t("title1")}{" "}
          <span className="gradient-text-gold">{t("title2")}</span>
          <br />
          {t("title3")}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mt-6 text-lg md:text-xl text-navy-300 leading-relaxed max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          {t("description")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine inline-flex items-center gap-2 h-13 px-8 bg-gold-500 hover:bg-gold-400 text-navy-900 text-base font-bold rounded-xl transition-all duration-200 shadow-lg hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5" />
            {t("cta_primary")}
          </a>
          <Link
            href="/proyectos"
            className="btn-shine inline-flex items-center gap-2 h-13 px-8 bg-white/10 hover:bg-white/15 text-white text-base font-semibold rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            {t("cta_secondary")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-8 md:gap-16 border-t border-white/10 pt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { value: "10+", key: "years" },
            { value: "109+", key: "projects_label" },
            { value: "3", key: "services_label" },
          ].map(({ value, key }) => (
            <div key={key} className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-white">{value}</div>
              <div className="text-xs text-navy-400 mt-1 uppercase tracking-wide">
                {tc(key as "years" | "projects_label" | "services_label")}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-navy-500"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
