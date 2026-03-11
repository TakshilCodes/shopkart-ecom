import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LandingPageHero from "@/components/LandingHero";
import TopSellingProducts from "@/components/TopsellingProducts";
import FeatureCards from "@/components/FeatureCards";
import BrandLogos from "@/components/BrandLogos";

export default async function Home() {

  return (
    <div>
      <LandingPageHero />
      <TopSellingProducts />
      <BrandLogos/>
      <FeatureCards/>
    </div>
  );
}