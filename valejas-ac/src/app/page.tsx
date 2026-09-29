import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ComunicadoDestaque from "@/components/home/ComunicadoDestaque";
import ProximoJogoHome from "@/components/home/ProximoJogoHome";
import ModalidadesGrid from "@/components/home/ModalidadesGrid";
import MoteBanner from "@/components/home/MoteBanner";
import ConhecerClube from "@/components/home/ConhecerClube";

/*
 * O próximo jogo e o comunicado em destaque vêm do CMS. Refaz-se de
 * minuto a minuto. Sem isto a página ficava tal como saiu
 * do último deploy: o que se mudava no Studio nunca chegava ao site.
 */
export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

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

      {/* Onde ir a seguir, para quem quer conhecer o clube por dentro */}
      <ConhecerClube />

    </>
  );
}
