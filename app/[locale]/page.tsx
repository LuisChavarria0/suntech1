import { Hero } from "@/components/sections/home/Hero";
import { StatsBar } from "@/components/sections/home/StatsBar";
import { SystemTypes } from "@/components/sections/home/SystemTypes";
import { SelfConsumption } from "@/components/sections/home/SelfConsumption";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { PanelsShowcase } from "@/components/sections/home/PanelsShowcase";
import { Advantages } from "@/components/sections/home/Advantages";
import { Equipment } from "@/components/sections/home/Equipment";
import { Services } from "@/components/sections/home/Services";
// import { FeaturedProjects } from "@/components/sections/home/FeaturedProjects";
// import { WhySuntech } from "@/components/sections/home/WhySuntech";
// import { Partners } from "@/components/sections/home/Partners";
import { CTABanner } from "@/components/sections/home/CTABanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <SystemTypes />
      <SelfConsumption />
      <Testimonials />
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
