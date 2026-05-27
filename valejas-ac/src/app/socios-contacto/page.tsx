import type { Metadata } from "next";
import SociosHero from "@/components/socios/SociosHero";
import PlanosSocios from "@/components/socios/PlanosSocios";
import FichaInscricao from "@/components/socios/FichaInscricao";
import ContactoSection from "@/components/socios/ContactoSection";

export const metadata: Metadata = {
  title: "Sócios & Contacto",
  description:
    "Torna-te sócio do Valejas AC. Planos, benefícios, ficha de inscrição e contactos do clube.",
};

export default function SociosContactoPage() {
  return (
    <>
      <SociosHero />
      <PlanosSocios />
      <FichaInscricao />
      <ContactoSection />
    </>
  );
}
