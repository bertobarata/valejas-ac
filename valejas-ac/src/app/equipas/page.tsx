import type { Metadata } from "next";
import EquipasHero from "@/components/equipas/EquipasHero";
import PlantelFilter from "@/components/equipas/PlantelFilter";
import CorpoTecnico from "@/components/equipas/CorpoTecnico";
import AcademiaCTA from "@/components/equipas/AcademiaCTA";
import { fetchJogadores } from "@/sanity/queries";
import { doSanity } from "@/lib/data/plantel";

export const metadata: Metadata = {
  title: "Equipas & Plantel",
  description:
    "O plantel de futsal do Valejas AC, equipa a equipa: da equipa A aos petizes.",
};

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
