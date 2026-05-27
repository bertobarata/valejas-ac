import HeroSection from "@/components/home/HeroSection";
import LiveMatchBanner from "@/components/home/LiveMatchBanner";
import NewsSection from "@/components/home/NewsSection";
import ModalidadesGrid from "@/components/home/ModalidadesGrid";
import ClubIdentitySection from "@/components/home/ClubIdentitySection";
import StatsCounter from "@/components/home/StatsCounter";
import SociosCTA from "@/components/home/SociosCTA";

export default function HomePage() {
  return (
    <>
      {/* 1. Full-width hero with Three.js particle field */}
      <HeroSection />

      {/* 2. Live match / next game banner */}
      <LiveMatchBanner />

      {/* 3. Stats counter bar */}
      <StatsCounter />

      {/* 4. Latest news grid */}
      <NewsSection />

      {/* 5. Modalidades grid */}
      <ModalidadesGrid />

      {/* 6. Club identity – crest story teaser */}
      <ClubIdentitySection />

      {/* 7. Sócios CTA */}
      <SociosCTA />
    </>
  );
}
