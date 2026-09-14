"use client";

/**
 * CATÁLOGO COM FILTROS
 * ─────────────────────────────────────────────────────────────────
 * Vinte e três artigos em quatro famílias. Empilhados numa página só,
 * quem procurava meias tinha de passar por equipamentos, fatos de
 * treino e cachecóis pelo caminho.
 *
 * Os filtros ficam à esquerda no ecrã grande, onde a vista os apanha
 * sem procurar, e viram uma fila de botões no telemóvel. Cada filtro
 * diz quantas peças tem: um filtro que leva a zero resultados é uma
 * perda de tempo que se evita antes do clique.
 * ─────────────────────────────────────────────────────────────────
 */

import { useMemo, useState } from "react";
import clsx from "clsx";
import { SlidersHorizontal } from "lucide-react";
import {
  CATEGORIAS, PRODUTOS, type CategoriaLoja, type Produto,
} from "@/lib/data/loja";

import CartaoProduto from "@/components/loja/CartaoProduto";

/** O kit tem bloco próprio no topo da loja; aqui mostram-se as peças soltas. */
const PECAS: Produto[] = PRODUTOS.filter((p) => !p.kit);

type Familia = CategoriaLoja | "todas";
type Feitio  = "todos" | "preco" | "consulta" | "personalizavel";

const FEITIOS: { id: Feitio; nome: string; teste: (p: Produto) => boolean }[] = [
  { id: "todos",          nome: "Tudo",                teste: () => true },
  { id: "preco",          nome: "Com preço",           teste: (p) => !p.sobConsulta },
  { id: "consulta",       nome: "Sob consulta",        teste: (p) => Boolean(p.sobConsulta) },
  { id: "personalizavel", nome: "Personalizáveis",     teste: (p) => Boolean(p.personalizavel) },
];

export default function CatalogoLoja() {
  const [familia, setFamilia] = useState<Familia>("todas");
  const [feitio, setFeitio]   = useState<Feitio>("todos");

  const testeFeitio = FEITIOS.find((f) => f.id === feitio)!.teste;

  const visiveis = useMemo(
    () => PECAS.filter(
      (p) => (familia === "todas" || p.categoria === familia) && testeFeitio(p)
    ),
    [familia, testeFeitio]
  );

  /** Quantas peças sobram se este filtro for escolhido, sem mexer no outro. */
  const contaFamilia = (f: Familia) =>
    PECAS.filter((p) => (f === "todas" || p.categoria === f) && testeFeitio(p)).length;

  const contaFeitio = (teste: (p: Produto) => boolean) =>
    PECAS.filter((p) => (familia === "todas" || p.categoria === familia) && teste(p)).length;

  const titulo =
    familia === "todas"
      ? "Todo o equipamento"
      : CATEGORIAS.find((c) => c.id === familia)!.nome;

  const intro =
    familia === "todas"
      ? "Equipamento de jogo, treino, peças de adepto e acessórios."
      : CATEGORIAS.find((c) => c.id === familia)!.intro;

  return (
    <div className="section-container grid lg:grid-cols-[15rem_minmax(0,1fr)] gap-10 lg:gap-14 py-12 md:py-16">

      {/* ── Filtros ── */}
      <aside className="lg:sticky lg:top-32 h-fit">
        <h2 className="flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-4">
          <SlidersHorizontal size={14} aria-hidden />
          Filtrar
        </h2>

        <Grupo titulo="Família">
          <Opcao
            nome="Tudo"
            conta={contaFamilia("todas")}
            ativo={familia === "todas"}
            aoEscolher={() => setFamilia("todas")}
          />
          {CATEGORIAS.map((c) => (
            <Opcao
              key={c.id}
              nome={c.nome}
              conta={contaFamilia(c.id)}
              ativo={familia === c.id}
              aoEscolher={() => setFamilia(c.id)}
            />
          ))}
        </Grupo>

        <Grupo titulo="Preço">
          {FEITIOS.map((f) => (
            <Opcao
              key={f.id}
              nome={f.nome}
              conta={contaFeitio(f.teste)}
              ativo={feitio === f.id}
              aoEscolher={() => setFeitio(f.id)}
            />
          ))}
        </Grupo>
      </aside>

      {/* ── Produtos ── */}
      <section>
        <div className="max-w-2xl mb-8">
          <h2 className="font-headline font-black uppercase text-2xl md:text-3xl tracking-tighter text-on-surface">
            {titulo}
          </h2>
          <p className="font-body text-on-surface-muted mt-2 leading-relaxed">{intro}</p>
          <p className="font-body text-sm text-on-surface-muted mt-2" role="status" aria-live="polite">
            {visiveis.length} {visiveis.length === 1 ? "artigo" : "artigos"}
          </p>
        </div>

        {visiveis.length === 0 ? (
          <p className="font-body text-on-surface-muted">
            Nada com estes filtros. Tira um deles para voltar a ver o catálogo.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-on-surface/10">
            {visiveis.map((p) => (
              <CartaoProduto key={p.slug} produto={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="mb-8 last:mb-0">
      <legend className="font-headline font-black uppercase text-sm text-on-surface mb-3">
        {titulo}
      </legend>
      {/* No telemóvel os filtros deitam-se numa fila que se enrola. */}
      <div className="flex flex-wrap lg:flex-col gap-2 lg:gap-0">{children}</div>
    </fieldset>
  );
}

function Opcao({
  nome, conta, ativo, aoEscolher,
}: {
  nome: string;
  conta: number;
  ativo: boolean;
  aoEscolher: () => void;
}) {
  return (
    <button
      type="button"
      onClick={aoEscolher}
      aria-pressed={ativo}
      disabled={conta === 0 && !ativo}
      className={clsx(
        "font-body text-sm transition-colors duration-200 text-left",
        "px-4 py-2.5 lg:px-0 lg:py-2 border lg:border-0 lg:border-b lg:border-on-surface/10",
        "flex items-center justify-between gap-3",
        conta === 0 && !ativo && "opacity-40 cursor-not-allowed",
        ativo
          ? "border-yellow bg-yellow/10 text-on-surface font-semibold lg:bg-transparent lg:text-yellow"
          : "border-on-surface/20 text-on-surface-muted hover:text-on-surface"
      )}
    >
      {nome}
      <span className="font-body text-xs tabular-nums opacity-70">{conta}</span>
    </button>
  );
}
