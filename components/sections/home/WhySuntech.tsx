import { Users, Zap, TrendingUp } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { VALUES } from "@/lib/data/company";

const IconMap = { Users, Zap, TrendingUp } as Record<
  string,
  React.ComponentType<{ className?: string }>
>;

export function WhySuntech() {
  return (
    <section className="section-padding bg-navy-900">
      <div className="container-tight">
        <SectionHeader
          eyebrow="¿Por qué Suntech?"
          title={
            <>
              Diferencias que{" "}
              <span className="gradient-text-gold">generan resultados</span>
            </>
          }
          description="No solo instalamos tecnología — construimos relaciones a largo plazo con soluciones que evolucionan junto a tus necesidades."
          theme="dark"
          className="mb-14"
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUES.map((value) => {
            const Icon = IconMap[value.icon];
            return (
              <StaggerItem key={value.title}>
                <div className="group p-8 rounded-2xl border border-white/8 hover:border-gold-500/30 bg-white/3 hover:bg-white/5 transition-all duration-300">
                  <div className="inline-flex p-4 rounded-2xl bg-gold-500/10 mb-6">
                    {Icon && <Icon className="h-7 w-7 text-gold-400" />}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-navy-300 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Bottom stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/8 rounded-2xl overflow-hidden">
          {[
            { label: "Garantía en instalaciones", value: "Sí" },
            { label: "Soporte post-venta", value: "Continuo" },
            { label: "Cobertura", value: "Nacional" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-navy-900 px-8 py-6 text-center">
              <div className="text-2xl font-extrabold text-gold-400">{value}</div>
              <div className="text-xs text-navy-400 mt-1 tracking-wide">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
