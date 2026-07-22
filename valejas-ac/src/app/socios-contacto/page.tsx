import type { Metadata } from "next";
import SociosHero from "@/components/socios/SociosHero";
import PlanosSocios from "@/components/socios/PlanosSocios";
import FichaInscricao from "@/components/socios/FichaInscricao";

export const metadata: Metadata = {
  title: "Sócios",
  description:
    "Torna-te sócio do Valejas AC. Planos, benefícios e ficha de inscrição. Faz parte da família do clube.",
};

export default function SociosPage() {
  return (
    <>
      <SociosHero />
      <PlanosSocios />
      <FichaInscricao />
    </>
  );
}
