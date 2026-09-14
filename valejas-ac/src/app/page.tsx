import HeroSection from "@/components/home/HeroSection";
import ComunicadoDestaque from "@/components/home/ComunicadoDestaque";
import ProximoJogoHome from "@/components/home/ProximoJogoHome";
import ModalidadesGrid from "@/components/home/ModalidadesGrid";
import MoteBanner from "@/components/home/MoteBanner";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* O PRODUCT.md define sucesso como ver o último comunicado e o
          próximo jogo em segundos. É por isso que vêm antes de tudo. */}
      <ComunicadoDestaque />
      <ProximoJogoHome />

      {/* Modalidades */}
      <ModalidadesGrid />

      {/* Mote do clube */}
      <MoteBanner />

    </>
  );
}
