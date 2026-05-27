import type { Metadata } from "next";
import EmblemHero from "@/components/clube/EmblemHero";
import EagleSection from "@/components/clube/EagleSection";
import FaixaSagrada from "@/components/clube/FaixaSagrada";
import ColorsBento from "@/components/clube/ColorsBento";
import EmblemCTA from "@/components/clube/EmblemCTA";

export const metadata: Metadata = {
  title: "O Nosso Emblema",
  description:
    "O emblema do Valejas AC — a águia, a faixa sagrada, as cores e a história de uma identidade única.",
};

export default function ClubePage() {
  return (
    <>
      <EmblemHero />
      <EagleSection />
      <FaixaSagrada />
      <ColorsBento />
      <EmblemCTA />
    </>
  );
}
