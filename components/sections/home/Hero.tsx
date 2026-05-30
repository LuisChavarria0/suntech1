"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, MessageCircle, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WHATSAPP_URL, COMPANY_INFO } from "@/lib/data/company";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden hero-gradient">
      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-[10%] w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }}
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 right-[10%] w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
        animate={{ scale: [1, 1.15, 1], x: [0, -15, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #10b981, transparent)" }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container-tight pt-24 pb-16 flex flex-col items-center text-center">
        {/* Logo grande */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8"
        >
          <div className="relative">
            {/* Glow detrás del logo */}
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

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400 backdrop-blur-sm mb-8">
            <Zap className="h-3 w-3" />
            Más de 10 años de experiencia en El Salvador
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight text-balance max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Soluciones tecnológicas{" "}
          <span className="gradient-text-gold">para un futuro</span>
          <br />
          sostenible
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mt-6 text-lg md:text-xl text-navy-300 leading-relaxed max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          Energía solar fotovoltaica, seguridad electrónica y tecnología
          integrada. Diseñamos proyectos a la medida para empresas, hogares e
          instituciones en todo El Salvador.
        </motion.p>

        {/* CTA buttons */}
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
            className="inline-flex items-center gap-2 h-13 px-8 bg-gold-500 hover:bg-gold-400 text-navy-900 text-base font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-gold-500/25 hover:shadow-xl hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5" />
            Cotizar proyecto
          </a>
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 h-13 px-8 bg-white/10 hover:bg-white/15 text-white text-base font-semibold rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            Ver proyectos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-8 md:gap-16 border-t border-white/10 pt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { value: "10+", label: "Años" },
            { value: "13+", label: "Proyectos" },
            { value: "3", label: "Servicios" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-white">
                {value}
              </div>
              <div className="text-xs text-navy-400 mt-1 uppercase tracking-wide">
                {label}
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
