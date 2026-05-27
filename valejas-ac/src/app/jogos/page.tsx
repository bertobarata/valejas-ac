import type { Metadata } from "next";
import JogosHero from "@/components/jogos/JogosHero";
import ResultadosRecentes from "@/components/jogos/ResultadosRecentes";
import CalendarioDinamico from "@/components/jogos/CalendarioDinamico";
import TabelaClassificativa from "@/components/jogos/TabelaClassificativa";
import LiveTracker from "@/components/jogos/LiveTracker";

export const metadata: Metadata = {
  title: "Centro de Jogos",
  description:
    "Resultados, calendário, classificação e o próximo jogo do Valejas AC.",
};

export default function JogosPage() {
  return (
    <>
      {/* 1. Hero: Derby + Countdown + Next match card */}
      <JogosHero />

      {/* 2. Main two-column grid */}
      <section className="section-container py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Left — results + calendar */}
          <div className="lg:col-span-8 space-y-20">
            <ResultadosRecentes />
            <CalendarioDinamico />
          </div>

          {/* Right sidebar — standings + tracker */}
          <aside className="lg:col-span-4 space-y-8">
            <TabelaClassificativa />
            <LiveTracker />
          </aside>

        </div>
      </section>
    </>
  );
}
