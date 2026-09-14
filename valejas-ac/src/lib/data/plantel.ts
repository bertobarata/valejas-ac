/**
 * CAMADA DE DADOS — PLANTEL DE FUTSAL
 * ─────────────────────────────────────────────────────────────────
 * Decisões da Direção (13/09/2026):
 *  - Não há equipa feminina de futsal
 *  - Sem estatísticas: nem golos, nem assistências, nem ratings
 *  - Uma equipa de cada vez, dos mais velhos para os mais novos
 *
 * O plantel real escreve-se em /direcao/plantel e fica guardado no
 * Sanity. O que está aqui em baixo são nomes de exemplo, e é o que
 * aparece enquanto o CMS não estiver ligado — estão assinalados.
 * ─────────────────────────────────────────────────────────────────
 */

import { getModalidade } from "@/lib/data/modalidades";

export type Posicao = "Guarda-Redes" | "Fixo" | "Ala" | "Pivot" | "Universal";

export interface Jogador {
  numero:   number;
  nome:     string;
  posicao:  Posicao;
  /** Id da equipa: "a", "b" ou o escalão em minúsculas. */
  equipa:   string;
  capitao?: boolean;
}

/** Ordem de apresentação — a mesma que se usa numa ficha de jogo. */
export const ORDEM_POSICOES: Posicao[] = [
  "Guarda-Redes", "Fixo", "Ala", "Pivot", "Universal",
];

export const PLURAL_POSICAO: Record<Posicao, string> = {
  "Guarda-Redes": "Guarda-Redes",
  Fixo:           "Fixos",
  Ala:            "Alas",
  Pivot:          "Pivots",
  Universal:      "Universais",
};

/**
 * Equipas por ordem descendente de idade — seniores primeiro, petizes
 * no fim. Os escalões vêm da mesma fonte que a página de modalidades,
 * invertidos, para não haver duas listas a divergir com o tempo.
 */
const ESCALOES_FUTSAL = getModalidade("futsal")?.escaloes ?? [];

export const EQUIPAS: { id: string; label: string }[] = [
  { id: "a", label: "Equipa A" },
  { id: "b", label: "Equipa B" },
  ...[...ESCALOES_FUTSAL].reverse().map((e) => ({
    id: e.toLowerCase(),
    label: e,
  })),
];

export function nomeDaEquipa(id: string): string {
  return EQUIPAS.find((e) => e.id === id)?.label ?? id;
}

/** ⚠️ Nomes inventados, à espera do plantel verdadeiro da Direção. */
export const PLANTEL_DE_EXEMPLO: Jogador[] = [
  { numero: 1,  nome: "Tiago Santos",   posicao: "Guarda-Redes", equipa: "a" },
  { numero: 13, nome: "Fábio Lima",     posicao: "Guarda-Redes", equipa: "a" },
  { numero: 3,  nome: "Pedro Nunes",    posicao: "Fixo",         equipa: "a" },
  { numero: 7,  nome: "Bruno Mendes",   posicao: "Fixo",         equipa: "a" },
  { numero: 10, nome: "Ricardo Fontes", posicao: "Ala",          equipa: "a", capitao: true },
  { numero: 8,  nome: "Dani Ferreira",  posicao: "Ala",          equipa: "a" },
  { numero: 11, nome: "André Costa",    posicao: "Ala",          equipa: "a" },
  { numero: 19, nome: "Alex Silva",     posicao: "Pivot",        equipa: "a" },
];

/* ── Ponte com o CMS ─────────────────────────────────────────────── */

export interface JogadorSanity {
  _id:      string;
  nome:     string;
  numero:   number;
  posicao:  string;
  equipa:   string;
  capitao?: boolean;
  ativo?:   boolean;
}

export function doSanity(j: JogadorSanity): Jogador {
  return {
    numero:  j.numero,
    nome:    j.nome,
    posicao: (ORDEM_POSICOES as string[]).includes(j.posicao)
      ? (j.posicao as Posicao)
      : "Universal",
    equipa:  j.equipa,
    ...(j.capitao ? { capitao: true } : {}),
  };
}

/** Agrupado por posição, pela ordem da ficha de jogo, sem grupos vazios. */
export function porPosicao(jogadores: Jogador[]) {
  return ORDEM_POSICOES
    .map((posicao) => ({
      posicao,
      jogadores: jogadores
        .filter((j) => j.posicao === posicao)
        .sort((a, b) => a.numero - b.numero),
    }))
    .filter((g) => g.jogadores.length > 0);
}
