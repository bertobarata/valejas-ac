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
 * No telemóvel são dois cartões por linha, e as colunas são
 * `minmax(0,1fr)` e não `1fr`: por omissão um item de grelha tem
 * `min-width: auto`, e o conteúdo mais largo do cartão alargava a coluna
 * até a página deslizar de lado.
 * ─────────────────────────────────────────────────────────────────
 */

import { useMemo, useState } from "react";
import clsx from "clsx";
import { SlidersHorizontal, X } from "lucide-react";
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
  /* No telemóvel os filtros ocupavam meio ecrã antes de se ver um produto.
     Passam para uma gaveta, que é o que uma loja faz num telefone. */
  const [gaveta, setGaveta]   = useState(false);

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

  /** Quantos filtros estão postos. Zero quer dizer que se vê tudo. */
  const postos = (familia !== "todas" ? 1 : 0) + (feitio !== "todos" ? 1 : 0);

  const filtros = (
    <>
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
    </>
  );

  return (
    <div className="section-container grid lg:grid-cols-[15rem_minmax(0,1fr)] gap-10 lg:gap-14 py-12 md:py-16">

      {/* ── Filtros, no ecrã grande ── */}
      <aside className="hidden lg:block lg:sticky lg:top-32 h-fit">
        <h2 className="flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-4">
          <SlidersHorizontal size={14} aria-hidden />
          Filtrar
        </h2>
        {filtros}
      </aside>

      {/* ── Filtros, no telemóvel: gaveta ── */}
      <button
        type="button"
        onClick={() => setGaveta(true)}
        aria-expanded={gaveta}
        className="lg:hidden btn-ghost w-full justify-center"
      >
        <SlidersHorizontal size={16} aria-hidden />
        Filtrar
        {postos > 0 && (
          <span className="ml-1 inline-flex items-center justify-center min-w-6 h-6 px-1.5 bg-yellow text-black font-body text-xs font-bold tabular-nums">
            {postos}
          </span>
        )}
      </button>

      {gaveta && (
        <div className="lg:hidden fixed inset-0 z-50 bg-surface flex flex-col">
          <div className="flex items-center justify-between border-b border-on-surface/10 px-5 h-16 shrink-0">
            <span className="font-headline font-black uppercase text-lg text-on-surface">
              Filtrar
            </span>
            <button
              type="button"
              onClick={() => setGaveta(false)}
              aria-label="Fechar os filtros"
              className="w-11 h-11 flex items-center justify-center text-on-surface"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6">{filtros}</div>

          <div className="border-t border-on-surface/10 p-5 shrink-0 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setGaveta(false)}
              className="btn-primary w-full justify-center"
            >
              Ver {visiveis.length} {visiveis.length === 1 ? "artigo" : "artigos"}
            </button>
            {postos > 0 && (
              <button
                type="button"
                onClick={() => { setFamilia("todas"); setFeitio("todos"); }}
                className="font-body text-sm text-on-surface-muted underline underline-offset-4 min-h-11"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      )}

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
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-3 gap-px bg-on-surface/10">
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
      {/* No telemóvel os filtros deitam-se numa fila que se enrola, ao
          centro como o resto da página. */}
      <div className="flex flex-wrap justify-center lg:justify-start lg:flex-col gap-2 lg:gap-0">
        {children}
      </div>
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
        "flex items-center justify-between gap-3 min-h-11",
        // Telemóvel: botões em fila. Ecrã grande: lista empilhada.
        "px-4 py-2.5 border",
        "lg:border-0 lg:border-b lg:border-b-on-surface/10 lg:px-3",
        conta === 0 && !ativo && "opacity-40 cursor-not-allowed",
        ativo
          ? [
              /*
                Amarelo a sério, com texto preto por cima: 15,2:1.
                Esteve em `bg-yellow/20` — um tom a 20% que não se via, e
                que ficou ainda mais fraco quando a barra lateral amarela
                saiu daqui. Um filtro escolhido tem de gritar: é a única
                coisa que explica porque é que faltam produtos na grelha.
                Fundo e não barra: a barra lateral é padrão banido.
              */
              "border-yellow bg-yellow text-black font-bold",
              "lg:border-b-yellow",
            ]
          : [
              "border-on-surface/20 text-on-surface-muted hover:text-on-surface",
              "lg:hover:bg-on-surface/5",
            ]
      )}
    >
      {nome}
      <span
        className={clsx(
          "font-body text-xs tabular-nums",
          ativo ? "text-black/65 font-bold" : "opacity-70"
        )}
      >
        {conta}
      </span>
    </button>
  );
}
