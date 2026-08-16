import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { FadeIn } from "@/components/ui/FadeIn";

const BRANDS = ["HUAWEI", "JA SOLAR", "JINKO SOLAR", "TRINA SOLAR"];

export async function Equipment() {
  const t = await getTranslations("equipment");

  const products = [
    {
      key: "panel",
      title: t("panel_title"),
      image: "/logos/panel.png",
      imgClass: "h-72",
      specs: [t("panel_1"), t("panel_2"), t("panel_3")],
    },
    {
      key: "inverter",
      title: t("inverter_title"),
      image: "/logos/equipo2.png",
      imgClass: "h-60",
      specs: [
        t("inverter_1"),
        t("inverter_2"),
        t("inverter_3"),
        t("inverter_4"),
      ],
    },
    {
      key: "battery",
      title: t("battery_title"),
      image: "/logos/bateria.png",
      imgClass: "h-72",
      specs: [t("battery_1"), t("battery_2"), t("battery_3"), t("battery_4")],
    },
  ];

  return (
    <section className="w-full bg-white pt-2 pb-8 md:pb-10 border-y border-slate-100 shadow-[0_4px_16px_rgba(10,15,30,0.12),0_-4px_16px_rgba(10,15,30,0.12)]">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_460px]">
        {/* Left: products */}
        <div className="px-8 md:px-16 lg:px-24 py-8 md:py-14 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-800 mb-12 text-center">
            {t("title")}
          </h2>

          <div className="grid grid-cols-3 gap-8 md:gap-14 items-end w-full max-w-4xl">
            {products.map((product) => (
              <div
                key={product.key}
                className="flex flex-col items-center text-center"
              >
                <p className="text-navy-700 font-medium mb-4">
                  {product.title}
                </p>
                <div className={`relative w-full ${product.imgClass}`}>
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <ul className="mt-4 space-y-1 text-center">
                  {product.specs.map((spec) => (
                    <li
                      key={spec}
                      className="text-navy-700 text-xs leading-snug"
                    >
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Right: warranty + brands */}
        <FadeIn
          direction="left"
          className="bg-slate-50 p-8 md:p-12 flex flex-col gap-8"
        >
          <div>
            <div className="relative h-10 w-10 mb-4">
              <Image
                src="/logos/GOTERAS.png"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <p className="text-navy-800 text-sm leading-relaxed">
              <span className="font-bold">{t("leak_title")}</span>{" "}
              {t("leak_desc")}
            </p>
          </div>

          <div>
            <p className="font-bold text-navy-800 text-sm mb-2">
              {t("brands_title")}
            </p>
            <p className="text-navy-700 text-sm leading-relaxed">
              {t("brands_desc")}
            </p>
          </div>

          <div className="flex flex-col items-center mt-2">
            {BRANDS.map((brand) => (
              <Image
                key={brand}
                src={`/logos/${brand}.png`}
                alt={brand}
                width={220}
                height={110}
                className="w-25 h-auto m-2"
              />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
