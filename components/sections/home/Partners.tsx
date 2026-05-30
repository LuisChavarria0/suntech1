import { FadeIn } from "@/components/ui/FadeIn";
import { Award, CheckCircle2 } from "lucide-react";

const certifications = [
  "Instaladores certificados",
  "Equipos de calidad garantizada",
  "Partner autorizado Huawei",
  "Más de 10 años en el mercado",
];

export function Partners() {
  return (
    <section className="section-padding bg-slate-50">
      <div className="container-tight">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
          {/* Text side */}
          <FadeIn direction="left" className="flex-1 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
              Socios y certificaciones
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 leading-tight mb-5">
              Respaldados por las{" "}
              <span className="gradient-text-gold">mejores marcas</span>
            </h2>
            <p className="text-slate-500 leading-relaxed mb-8">
              Trabajamos con tecnología de primera línea y fabricantes líderes a
              nivel mundial. Esto nos permite garantizar rendimiento, durabilidad
              y soporte en cada proyecto que entregamos.
            </p>
            <ul className="space-y-3">
              {certifications.map((cert) => (
                <li key={cert} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-eco-500 flex-shrink-0" />
                  {cert}
                </li>
              ))}
            </ul>
          </FadeIn>

          {/* Logos side */}
          <FadeIn direction="right" className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              {/* Huawei */}
              <div className="card-base p-8 flex flex-col items-center justify-center gap-3 text-center">
                <div className="text-3xl font-black text-navy-800 tracking-tighter">
                  HUAWEI
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  Partner autorizado
                </div>
              </div>

              {/* Energía Solar */}
              <div className="card-base p-8 flex flex-col items-center justify-center gap-3 text-center bg-gold-500/5 border-gold-500/20">
                <Award className="h-10 w-10 text-gold-500" />
                <div className="text-xs text-slate-600 font-semibold">
                  Energía Solar
                  <br />
                  Fotovoltaica
                </div>
              </div>

              {/* Seguridad */}
              <div className="card-base p-8 flex flex-col items-center justify-center gap-3 text-center bg-electric-500/5 border-electric-500/20">
                <Award className="h-10 w-10 text-electric-500" />
                <div className="text-xs text-slate-600 font-semibold">
                  Seguridad
                  <br />
                  Electrónica
                </div>
              </div>

              {/* Tecnología */}
              <div className="card-base p-8 flex flex-col items-center justify-center gap-3 text-center bg-eco-500/5 border-eco-500/20">
                <Award className="h-10 w-10 text-eco-500" />
                <div className="text-xs text-slate-600 font-semibold">
                  Tecnología
                  <br />
                  Empresarial
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
