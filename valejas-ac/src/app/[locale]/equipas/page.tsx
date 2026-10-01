import type { Metadata } from "next";
import { paraPagina } from "@/lib/seo/metadados";
import EquipasHero from "@/components/equipas/EquipasHero";
import PlantelFilter from "@/components/equipas/PlantelFilter";
import CorpoTecnico from "@/components/equipas/CorpoTecnico";
import AcademiaCTA from "@/components/equipas/AcademiaCTA";
import { fetchJogadores } from "@/sanity/queries";
import { doSanity } from "@/lib/data/plantel";

/*
 * Refaz-se de minuto a minuto. Sem isto a página ficava tal como saiu
 * do último deploy: o que se mudava no Studio nunca chegava ao site.
 */
export const revalidate = 60;

export const metadata: Metadata = paraPagina("/equipas", {
  title: "Equipas & Plantel",
  description:
    "O plantel de futsal do Valejas AC, equipa a equipa: da equipa A aos petizes.",
});

export default async function EquipasPage() {
  // O plantel vem do CMS, escrito em /direcao/plantel. Sem CMS, o
  // componente mostra o plantel de exemplo.
  const doCms = await fetchJogadores();
  const jogadores = doCms?.map(doSanity) ?? undefined;

  return (
    <>
      <EquipasHero />
      <PlantelFilter jogadores={jogadores} />
      <CorpoTecnico />
      <AcademiaCTA /></>
  );
}
