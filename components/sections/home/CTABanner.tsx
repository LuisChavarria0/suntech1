import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { WHATSAPP_URL } from "@/lib/data/company";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 md:py-28">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(251,191,36,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(59,130,246,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Diagonal accent line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

      <FadeIn className="relative z-10 container-tight text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
          Empieza hoy
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight text-balance max-w-3xl mx-auto mb-6">
          ¿Listo para tu{" "}
          <span className="gradient-text-gold">próximo proyecto</span>?
        </h2>
        <p className="text-navy-300 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Cuéntanos tu idea. Nuestro equipo diseñará una solución personalizada
          para ti sin costo adicional.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-14 px-10 bg-gold-500 hover:bg-gold-400 text-navy-900 text-base font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-gold-500/30 hover:shadow-2xl hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5" />
            Cotizar por WhatsApp
          </a>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 h-14 px-10 bg-white/10 hover:bg-white/15 text-white text-base font-semibold rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            Formulario de contacto
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
