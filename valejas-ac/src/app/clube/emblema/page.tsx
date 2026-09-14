import type { Metadata } from "next";
import EmblemHero from "@/components/clube/EmblemHero";
import EagleSection from "@/components/clube/EagleSection";
import ColorsBento from "@/components/clube/ColorsBento";
import EmblemCTA from "@/components/clube/EmblemCTA";

export const metadata: Metadata = {
  title: "O Nosso Emblema",
  description:
    "O emblema do Valejas AC — a águia, as cores amarelo e azul e a história de uma identidade única desde 1966.",
};

export default function EmblemaPage() {
  return (
    <>
      <EmblemHero />
      <EagleSection />
      <ColorsBento />
      <EmblemCTA />
    </>
  );
}
