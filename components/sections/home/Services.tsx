import Link from "next/link";
import { ArrowRight, Sun, Shield, Cpu, CheckCircle2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { SERVICES } from "@/lib/data/services";
import type { Service } from "@/lib/types";

const IconMap = { Sun, Shield, Cpu } as Record<
  string,
  React.ComponentType<{ className?: string }>
>;

const accentClasses = {
  gold: {
    icon: "bg-gold-500/10 text-gold-500",
    border: "border-gold-500/20",
    hover: "hover:border-gold-500/40",
    badge: "bg-gold-500/10 text-gold-600",
    arrow: "text-gold-500",
  },
  electric: {
    icon: "bg-electric-500/10 text-electric-500",
    border: "border-electric-500/20",
    hover: "hover:border-electric-500/40",
    badge: "bg-electric-500/10 text-electric-600",
    arrow: "text-electric-500",
  },
  green: {
    icon: "bg-eco-500/10 text-eco-500",
    border: "border-eco-500/20",
    hover: "hover:border-eco-500/40",
    badge: "bg-eco-500/10 text-eco-600",
    arrow: "text-eco-500",
  },
};

function ServiceCard({ service }: { service: Service }) {
  const Icon = IconMap[service.icon];
  const accent = accentClasses[service.accentColor];

  return (
    <StaggerItem>
      <div
        className={[
          "card-base card-hover p-8 flex flex-col h-full border-2",
          accent.border,
          accent.hover,
        ].join(" ")}
      >
        {/* Icon */}
        <div className={`inline-flex p-4 rounded-2xl mb-6 self-start ${accent.icon}`}>
          {Icon && <Icon className="h-7 w-7" />}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-navy-900 mb-3">{service.title}</h3>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
          {service.description}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-8">
          {service.features.slice(0, 3).map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
              <CheckCircle2 className="h-4 w-4 text-eco-500 flex-shrink-0 mt-0.5" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Link */}
        <Link
          href={`/servicios/${service.slug}`}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold ${accent.arrow} hover:gap-3 transition-all duration-200 mt-auto`}
        >
          Ver más
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </StaggerItem>
  );
}

export function Services() {
  return (
    <section className="section-padding bg-slate-50">
      <div className="container-tight">
        <SectionHeader
          eyebrow="Nuestros servicios"
          title={
            <>
              Todo lo que necesitas{" "}
              <span className="gradient-text-gold">en un solo lugar</span>
            </>
          }
          description="Integramos tres líneas de servicio estratégicas para ofrecerte soluciones completas, personalizadas y con soporte continuo."
          className="mb-14"
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
