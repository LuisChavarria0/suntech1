import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { STATS } from "@/lib/data/company";

export function StatsBar() {
  return (
    <section className="bg-navy-800 py-14 md:py-16">
      <div className="container-tight">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="text-center group"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  duration={1800}
                />
              </div>
              <div className="mt-2 text-sm text-navy-400 font-medium tracking-wide">
                {stat.label}
              </div>
              <div className="mt-3 mx-auto w-8 h-0.5 bg-gold-500 rounded-full opacity-60 group-hover:opacity-100 group-hover:w-12 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
