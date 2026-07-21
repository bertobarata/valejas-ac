import type { Metadata } from "next";
import EquipasHero from "@/components/equipas/EquipasHero";
import PlantelFilter from "@/components/equipas/PlantelFilter";
import CorpoTecnico from "@/components/equipas/CorpoTecnico";
import AcademiaCTA from "@/components/equipas/AcademiaCTA";

export const metadata: Metadata = {
  title: "Equipas & Plantel",
  description:
    "Conheça o plantel de futsal do Valejas AC — jogadores, corpo técnico e formação.",
};

export default function EquipasPage() {
  return (
    <>
      <EquipasHero />
      <PlantelFilter />
      <CorpoTecnico />
      <AcademiaCTA />
    </>
  );
}
