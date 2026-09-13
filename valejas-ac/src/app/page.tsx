import HeroSection from "@/components/home/HeroSection";
import NewsSection from "@/components/home/NewsSection";
import ModalidadesGrid from "@/components/home/ModalidadesGrid";
import MoteBanner from "@/components/home/MoteBanner";
import SociosCTA from "@/components/home/SociosCTA";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Notícias */}
      <NewsSection />

      {/* Modalidades */}
      <ModalidadesGrid />

      {/* Mote do clube */}
      <MoteBanner />

      {/* Sócios CTA */}
      <SociosCTA />
    </>
  );
}
