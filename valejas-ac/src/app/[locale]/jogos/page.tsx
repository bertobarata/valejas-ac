import type { Metadata } from "next";
import { paraPagina } from "@/lib/seo/metadados";
import ProximoJogo from "@/components/jogos/ProximoJogo";
import ResultadosRecentes from "@/components/jogos/ResultadosRecentes";
import TabelaClassificativa from "@/components/jogos/TabelaClassificativa";
import Calendario from "@/components/jogos/Calendario";
import { carregarJogos } from "@/lib/jogosDoSite";
import DadosEstruturados from "@/components/seo/DadosEstruturados";
import { proximosJogos } from "@/lib/seo/dadosEstruturados";

export const metadata: Metadata = paraPagina("/jogos", {
  title: "Jogos",
  description:
    "Próximo jogo, resultados recentes e classificação do Valejas AC no distrital da AF Lisboa.",
});

// Os jogos mudam ao fim de semana; não vale a pena reconstruir o site
// inteiro por isso, mas também não pode ficar preso a um build antigo.
export const revalidate = 300;

export default async function JogosPage() {
  // O calendário oficial é a base; por cima, os resultados que o
  // departamento de comunicação lançou, e a classificação recalculada.
  const { calendario, proximo, resultados, classificacao } = await carregarJogos();

  return (
    <div className="bg-surface">
      <DadosEstruturados dados={proximosJogos()} />
      {/* Cabeçalho */}
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-16 md:py-20">
          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            Futsal · Equipa A
          </p>
          <h1 className="section-title text-4xl md:text-6xl">
            Jogos e <span>classificação</span>
          </h1>
        </div>
      </section>

      {/* Duas colunas: jogos à esquerda, classificação à direita */}
      <section className="section-container py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 space-y-14">
            <ProximoJogo jogo={proximo} />
            <ResultadosRecentes jogos={resultados} />
            <Calendario jogos={calendario} />
          </div>

          <aside className="lg:col-span-5">
            <TabelaClassificativa linhas={classificacao} />
          </aside>
        </div>
      </section></div>
  );
}
