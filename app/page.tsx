import { Hero } from "@/components/sections/home/Hero";
import { StatsBar } from "@/components/sections/home/StatsBar";
import { Services } from "@/components/sections/home/Services";
import { FeaturedProjects } from "@/components/sections/home/FeaturedProjects";
import { WhySuntech } from "@/components/sections/home/WhySuntech";
import { Partners } from "@/components/sections/home/Partners";
import { CTABanner } from "@/components/sections/home/CTABanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <Services />
      <FeaturedProjects />
      <WhySuntech />
      <Partners />
      <CTABanner />
    </>
  );
}
