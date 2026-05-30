import { getTranslations } from "next-intl/server";
import { ArrowRight, MessageCircle } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { MouseGradientSection } from "@/components/ui/MouseGradientSection";
import { Link } from "@/i18n/navigation";
import { WHATSAPP_URL } from "@/lib/data/company";

export async function CTABanner() {
  const t = await getTranslations("cta");
  const tc = await getTranslations("common");

  return (
    <MouseGradientSection
      className="relative overflow-hidden bg-navy-900 py-20 md:py-28"
      color="gold"
      blobSize={800}
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(251,191,36,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(59,130,246,0.08) 0%, transparent 60%)",
        }}
      />
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold-500/20 to-transparent" />

      <FadeIn className="relative z-10 container-tight text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
          {t("eyebrow")}
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight text-balance max-w-3xl mx-auto mb-6">
          {t("title")}{" "}
          <span className="gradient-text-gold">{t("title_highlight")}</span>
          {t("title_end")}
        </h2>
        <p className="text-navy-300 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          {t("description")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine inline-flex items-center gap-2 h-14 px-10 bg-gold-500 hover:bg-gold-400 text-navy-900 text-base font-bold rounded-xl transition-all duration-200 shadow-lg hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5" />
            {tc("quote_whatsapp")}
          </a>
          <Link
            href="/contacto"
            className="btn-shine inline-flex items-center gap-2 h-14 px-10 bg-white/10 hover:bg-white/15 text-white text-base font-semibold rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            {tc("contact_form")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </FadeIn>
    </MouseGradientSection>
  );
}
