import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { FadeIn } from "@/components/ui/FadeIn";

export async function Advantages() {
  const t = await getTranslations("advantages");

  const items = [
    { logo: "/logos/CÁMARA DE COMERCIO.png", text: t("chamber") },
    { logo: "/logos/HUAWEI.png", text: t("huawei") },
    { logo: "/logos/BAC.png", text: t("bac") },
    { logo: "/logos/BANCO CUSCATLAN.png", text: t("cuscatlan") },
  ];

  return (
    <section className="w-full">
      {/* Orange header */}
      <div className="bg-gold-500 py-8 md:py-10">
        <h2 className="text-center text-2xl md:text-4xl font-bold text-white">{t("title")}</h2>
      </div>

      {/* Body */}
      <div className="relative bg-white overflow-hidden px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: accreditation list */}
          <div className="relative z-10 flex flex-col">
            <div className="flex flex-col gap-2 bg-white px-6 md:px-12 pt-6 pb-2">
              {items.slice(0, 2).map((item) => (
                <div key={item.logo} className="flex items-center gap-2">
                  <div className="relative h-24 w-24 shrink-0">
                    <Image src={item.logo} alt="" fill className="object-contain" />
                  </div>
                  <p className="text-navy-800 leading-snug text-sm md:text-base">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 px-6 md:px-12 pt-2 pb-6">
              {items.slice(2, 4).map((item) => (
                <div key={item.logo} className="flex items-center gap-2">
                  <div className="relative h-22 w-22 shrink-0">
                    <Image src={item.logo} alt="" fill className="object-contain" />
                  </div>
                  <p className="text-navy-800 leading-snug text-sm md:text-base">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: BFA + credito verde + panel image */}
          <div className="relative bg-white min-h-70 md:min-h-95">
            <FadeIn
              direction="right"
              className="relative z-10 flex flex-col items-center justify-center gap-1 h-full py-8 md:w-[62%]"
            >
              <div className="relative h-40 w-96">
                <Image src="/logos/BFA.png" alt="BFA" fill className="object-contain" />
              </div>
              <div className="relative -mt-24 h-64 w-96">
                <Image
                  src="/logos/CREDITO VERDE.png"
                  alt="Crédito verde — tasa desde el 8.50% anual"
                  fill
                  className="object-contain"
                />
              </div>
            </FadeIn>

            {/* Panel product photo */}
            <div className="hidden md:block absolute -top-10 -bottom-10 right-0 w-[38%]">
              <Image src="/logos/panel.png" alt="" fill className="object-contain object-right" />
            </div>
          </div>
        </div>

        {/* Decorative leaves */}
        <Image
          src="/logos/HOJA.png"
          alt=""
          width={160}
          height={160}
          aria-hidden="true"
          className="pointer-events-none select-none absolute left-0 bottom-0 h-32 w-32 md:h-44 md:w-44"
        />
      </div>
    </section>
  );
}
