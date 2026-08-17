"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import { WHATSAPP_URL } from "@/lib/data/company";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-[92dvh] flex flex-col justify-center overflow-hidden bg-navy-950">
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
      <div className="absolute inset-0 bg-navy-950/55" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-950 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container-tight pt-32 pb-24 flex flex-col items-center text-center">
        {/* Headline */}
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight text-balance max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {t("title1")}
          <br />
          {t("title2")}
        </motion.h1>

        {/* Subheadline with orange highlight */}
        <motion.p
          className="mt-4 text-lg md:text-2xl text-white leading-relaxed max-w-2xl flex flex-wrap items-center justify-center gap-x-2 gap-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span>{t("savings_prefix")}</span>
          <span className="bg-gold-500 text-white font-bold px-2 py-0.5 rounded">
            {t("savings_highlight")} {t("savings_suffix")}
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine inline-flex items-center gap-2 h-14 px-8 bg-navy-800 hover:bg-navy-700 text-white text-lg font-bold rounded-xl transition-all duration-200 shadow-lg hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {t("cta_primary")}
          </a>
          <Link
            href="/proyectos"
            className="btn-shine inline-flex items-center gap-3 h-14 px-8 bg-white hover:bg-white/90 text-navy-900 text-lg font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            {t("cta_secondary")}
            <span className="flex items-center justify-center h-6 w-6 rounded-full border border-navy-900">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
