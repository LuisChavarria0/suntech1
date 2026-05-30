import { getTranslations } from "next-intl/server";
import { Home } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("not_found");
  const tc = await getTranslations("common");

  return (
    <div className="min-h-screen bg-navy-900 hero-gradient flex flex-col items-center justify-center px-4 text-center">
      <div className="text-[160px] md:text-[220px] font-extrabold leading-none text-white/5 select-none absolute">
        404
      </div>
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          {t("title")} <span className="gradient-text-gold">{t("title_highlight")}</span>
        </h1>
        <p className="text-navy-300 text-lg mb-10 max-w-md">{t("description")}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="btn-shine inline-flex items-center gap-2 h-12 px-7 bg-gold-500 hover:bg-gold-400 text-navy-900 text-sm font-bold rounded-xl transition-colors shadow-md"
          >
            <Home className="h-4 w-4" />
            {tc("go_home")}
          </Link>
          <Link
            href="/contacto"
            className="btn-shine inline-flex items-center gap-2 h-12 px-7 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl border border-white/20 transition-colors"
          >
            {tc("contact_us")}
          </Link>
        </div>
      </div>
    </div>
  );
}
