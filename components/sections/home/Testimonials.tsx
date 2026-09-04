import fs from "node:fs";
import path from "node:path";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import { Link } from "@/i18n/navigation";
import { TestimonialVideo } from "@/components/sections/home/TestimonialVideo";
import { TestimonialsMoreModal } from "@/components/sections/home/TestimonialsMoreModal";
import { MarqueeRow } from "@/components/ui/MarqueeRow";
import { readTestimonialVideos } from "@/lib/data/testimonialVideos";

function getClientLogos(): string[] {
  const dir = path.join(process.cwd(), "public", "logos", "clientes");
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".png"))
    .map((f) => f.replace(/\.png$/i, ""))
    .sort();
}

export async function Testimonials() {
  const t = await getTranslations("testimonials");
  const clientLogos = getClientLogos();
  const videos = await readTestimonialVideos();
  const logos = [...clientLogos, ...clientLogos];

  return (
    <section className="w-full bg-white">
      {/* Client logos marquee */}
      <div className="container-tight py-5 flex items-center gap-8">
        <p className="shrink-0 text-navy-700 font-semibold text-lg max-w-40">{t("clients_intro")}</p>
        <MarqueeRow>
          {logos.map((name, i) => (
            <img
              key={name + i}
              src={`/logos/clientes/${name}.png`}
              alt={name}
              className="h-28 w-auto object-contain"
            />
          ))}
        </MarqueeRow>
      </div>

      {/* Testimonial */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,320px)_1fr] bg-navy-800 px-6 md:px-16 lg:px-24">
        <div className="py-6 md:py-0 px-3 md:px-4 flex items-center">
          <TestimonialVideo src="/media/videos/ahorro-real-escalon.mp4" />
        </div>

        <FadeIn direction="left" className="flex flex-col justify-center py-6 md:py-0 px-8 md:px-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
            {t("eyebrow")}
          </p>
          <blockquote className="text-2xl md:text-3xl font-bold text-white leading-tight mb-8 text-balance">
            &ldquo;{t("quote")}&rdquo;
          </blockquote>
          <Link
            href="/contacto"
            className="btn-shine inline-flex items-center justify-center h-13 px-8 border border-white/60 text-white text-base font-semibold rounded-xl hover:bg-white/10 transition-all duration-200 self-start"
          >
            {t("cta")}
          </Link>

          <TestimonialsMoreModal videos={videos} />
        </FadeIn>
      </div>
    </section>
  );
}
