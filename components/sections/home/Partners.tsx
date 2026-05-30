import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import { CheckCircle2, Award } from "lucide-react";

export async function Partners() {
  const t = await getTranslations("partners");

  const certifications = [t("cert1"), t("cert2"), t("cert3"), t("cert4")];

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-tight">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
          {/* Text */}
          <FadeIn direction="left" className="flex-1 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
              {t("eyebrow")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 leading-tight mb-5">
              {t("title")}{" "}
              <span className="gradient-text-gold">{t("title_highlight")}</span>
            </h2>
            <p className="text-slate-500 leading-relaxed mb-8">{t("description")}</p>
            <ul className="space-y-3">
              {certifications.map((cert) => (
                <li key={cert} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-eco-500 shrink-0" />
                  {cert}
                </li>
              ))}
            </ul>
          </FadeIn>

          {/* Logos */}
          <FadeIn direction="right" className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="card-base p-8 flex flex-col items-center justify-center gap-3 text-center">
                <div className="text-3xl font-black text-navy-800 tracking-tighter">HUAWEI</div>
                <div className="text-xs text-slate-400 font-medium">{t("partner_label")}</div>
              </div>
              <div className="card-base p-8 flex flex-col items-center justify-center gap-3 text-center bg-gold-500/5 border-gold-500/20">
                <Award className="h-10 w-10 text-gold-500" />
                <div className="text-xs text-slate-600 font-semibold">{t("solar_label")}</div>
              </div>
              <div className="card-base p-8 flex flex-col items-center justify-center gap-3 text-center bg-electric-500/5 border-electric-500/20">
                <Award className="h-10 w-10 text-electric-500" />
                <div className="text-xs text-slate-600 font-semibold">{t("security_label")}</div>
              </div>
              <div className="card-base p-8 flex flex-col items-center justify-center gap-3 text-center bg-eco-500/5 border-eco-500/20">
                <Award className="h-10 w-10 text-eco-500" />
                <div className="text-xs text-slate-600 font-semibold">{t("tech_label")}</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
