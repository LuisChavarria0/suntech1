import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { pageMetadata, type Locale } from "@/lib/seo";
import { Hero } from "@/components/sections/home/Hero";
import { StatsBar } from "@/components/sections/home/StatsBar";
import { SystemTypes } from "@/components/sections/home/SystemTypes";
import { SelfConsumption } from "@/components/sections/home/SelfConsumption";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { Recommendations } from "@/components/sections/home/Recommendations";
import { PanelsShowcase } from "@/components/sections/home/PanelsShowcase";
import { Advantages } from "@/components/sections/home/Advantages";
import { Equipment } from "@/components/sections/home/Equipment";
import { Services } from "@/components/sections/home/Services";
// import { FeaturedProjects } from "@/components/sections/home/FeaturedProjects";
// import { WhySuntech } from "@/components/sections/home/WhySuntech";
// import { Partners } from "@/components/sections/home/Partners";
import { CTABanner } from "@/components/sections/home/CTABanner";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("seo");
  return pageMetadata({
    locale,
    path: "",
    title: t("home_title"),
    description: t("home_description"),
  });
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <SystemTypes />
      <SelfConsumption />
      <Testimonials />
      <Recommendations />
      <PanelsShowcase />
      <Advantages />
      <Equipment />
      <Services />
      {/* <FeaturedProjects /> */}
      {/* <WhySuntech /> */}
      {/* <Partners /> */}
      <CTABanner />
    </>
  );
}
