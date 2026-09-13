"use client";

/**
 * PLANTEL DE FUTSAL
 * ─────────────────────────────────────────────────────────────────
 * Decisão da Direção (13/09/2026):
 *  - Não há equipa feminina de futsal → o filtro de género saiu.
 *  - Não queremos estatísticas → saíram golos, assistências, defesas,
 *    rating e jogos. A versão anterior tinha cartões que rodavam para
 *    mostrar números; sem números, a rotação deixou de ter função.
 *  - Não se mostra o plantel todo de uma vez. Escolhe-se uma equipa,
 *    e as equipas aparecem dos mais velhos para os mais novos.
 *
 * O que fica é o que um plantel precisa de ter: quem é, que número
 * veste e onde joga, arrumado por posição.
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getModalidade } from "@/lib/data/modalidades";

gsap.registerPlugin(ScrollTrigger);

// ── Tipos ──────────────────────────────────────────────────────────
/** Identificador de equipa: seniores ou escalão de formação. */
type Equipa = string;

type Posicao = "Guarda-Redes" | "Fixo" | "Ala" | "Pivot" | "Universal";

type Jogador = {
  numero:   number;
  nome:     string;
  posicao:  Posicao;
  equipa:   Equipa;
  capitao?: boolean;
};

/**
 * Equipas por ordem descendente de idade — seniores primeiro, petizes
 * no fim. Os escalões vêm da mesma fonte que a página de modalidades,
 * invertidos, para não haver duas listas a divergir com o tempo.
 */
const ESCALOES_FUTSAL = getModalidade("futsal")?.escaloes ?? [];

const EQUIPAS: { id: Equipa; label: string }[] = [
  { id: "a", label: "Equipa A" },
  { id: "b", label: "Equipa B" },
  ...[...ESCALOES_FUTSAL].reverse().map((e) => ({
    id: e.toLowerCase(),
    label: e,
  })),
];

// ── Dados de exemplo — substituir pelo plantel real ────────────────
// ⚠️ Nomes inventados. A Direção tem de fornecer o plantel verdadeiro,
//    separado por Equipa A e Equipa B. Registado no TODO.md.
const JOGADORES: Jogador[] = [
  { numero: 1,  nome: "Tiago Santos",   posicao: "Guarda-Redes", equipa: "a" },
  { numero: 13, nome: "Fábio Lima",     posicao: "Guarda-Redes", equipa: "a" },
  { numero: 3,  nome: "Pedro Nunes",    posicao: "Fixo",         equipa: "a" },
  { numero: 7,  nome: "Bruno Mendes",   posicao: "Fixo",         equipa: "a" },
  { numero: 10, nome: "Ricardo Fontes", posicao: "Ala",          equipa: "a", capitao: true },
  { numero: 8,  nome: "Dani Ferreira",  posicao: "Ala",          equipa: "a" },
  { numero: 11, nome: "André Costa",    posicao: "Ala",          equipa: "a" },
  { numero: 19, nome: "Alex Silva",     posicao: "Pivot",        equipa: "a" },
];

/** Ordem de apresentação — a mesma que se usa numa ficha de jogo. */
const ORDEM_POSICOES: Posicao[] = ["Guarda-Redes", "Fixo", "Ala", "Pivot", "Universal"];

const PLURAL: Record<Posicao, string> = {
  "Guarda-Redes": "Guarda-Redes",
  Fixo:           "Fixos",
  Ala:            "Alas",
  Pivot:          "Pivots",
  Universal:      "Universais",
};

export default function PlantelFilter() {
  const [equipa, setEquipa] = useState<Equipa>("a");
  const sectionRef = useRef<HTMLElement>(null);

  const visiveis = useMemo(
    () => JOGADORES.filter((j) => j.equipa === equipa),
    [equipa]
  );

  const nomeEquipa = EQUIPAS.find((e) => e.id === equipa)?.label ?? "";

  const porPosicao = useMemo(
    () =>
      ORDEM_POSICOES.map((p) => ({
        posicao: p,
        jogadores: visiveis.filter((j) => j.posicao === p),
      })).filter((g) => g.jogadores.length > 0),
    [visiveis]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".jogador-card",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [equipa]);

  return (
    <section ref={sectionRef} className="bg-surface py-20 md:py-28">
      <div className="section-container">
        <div className="mb-10">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-yellow mb-3">
            Futsal masculino
          </p>
          <h2 className="section-title">
            O <span>plantel</span>
          </h2>
        </div>

        {/* Filtro por equipa */}
        <div role="group" aria-label="Filtrar por equipa" className="flex flex-wrap gap-2 mb-12">
          {EQUIPAS.map((e) => {
            const ativo = equipa === e.id;
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => setEquipa(e.id)}
                aria-pressed={ativo}
                className={clsx(
                  "font-headline font-black text-xs uppercase tracking-widest px-5 py-3 transition-colors duration-200",
                  ativo
                    ? "bg-yellow text-blue-deep"
                    : "border border-on-surface/20 text-on-surface-muted hover:border-on-surface/50 hover:text-on-surface"
                )}
              >
                {e.label}
              </button>
            );
          })}
        </div>

        {/* Plantel, por posição */}
        {porPosicao.length === 0 ? (
          <p className="font-body text-on-surface-muted py-12">
            O plantel de {nomeEquipa} ainda não está publicado.
          </p>
        ) : (
          <div className="space-y-14">
            {porPosicao.map((grupo) => (
              <div key={grupo.posicao}>
                <h3 className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-on-surface-muted border-b border-on-surface/10 pb-3 mb-6">
                  {PLURAL[grupo.posicao]}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-on-surface/10">
                  {grupo.jogadores.map((j) => (
                    <article
                      key={`${j.equipa}-${j.numero}`}
                      className="jogador-card group bg-surface-high hover:bg-surface-highest transition-colors duration-300"
                    >
                      {/* Retrato — placeholder até haver fotografias reais */}
                      <div className="relative aspect-[3/4] bg-gradient-to-b from-blue-deep to-surface-low overflow-hidden">
                        <span
                          aria-hidden
                          className="absolute inset-0 flex items-center justify-center font-headline font-black text-[7rem] leading-none text-white/10 group-hover:text-yellow/20 transition-colors duration-300"
                        >
                          {j.numero}
                        </span>
                        {j.capitao && (
                          <span className="absolute top-3 left-3 font-body text-xs font-bold uppercase tracking-widest bg-yellow text-blue-deep px-2 py-1">
                            Capitão
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <p className="font-headline font-black uppercase text-base text-on-surface leading-tight">
                          {j.nome}
                        </p>
                        <p className="font-body text-sm text-on-surface-muted mt-0.5">
                          {j.posicao}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
