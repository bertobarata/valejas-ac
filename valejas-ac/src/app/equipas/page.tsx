import type { Metadata } from "next";
import EquipasHero from "@/components/equipas/EquipasHero";
import PlantelFilter from "@/components/equipas/PlantelFilter";
import CorpoTecnico from "@/components/equipas/CorpoTecnico";
import AcademiaCTA from "@/components/equipas/AcademiaCTA";

export const metadata: Metadata = {
  title: "Equipas & Plantel",
  description:
    "Conheça o plantel do Valejas AC — Futsal Elite, corpo técnico e Academia Vanguarda.",
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
