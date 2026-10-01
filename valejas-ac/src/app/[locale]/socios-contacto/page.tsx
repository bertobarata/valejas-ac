import type { Metadata } from "next";
import { paraPagina } from "@/lib/seo/metadados";
import SociosHero from "@/components/socios/SociosHero";
import QuotaSocio from "@/components/socios/QuotaSocio";

export const metadata: Metadata = paraPagina("/socios-contacto", {
  title: "Sócios",
  description:
    "Torna-te sócio do Valejas AC. Quota de 1€ por mês. Faz parte da casa do clube.",
});

export default function SociosPage() {
  return (
    <>
      <SociosHero />
      <QuotaSocio />
    </>
  );
}
