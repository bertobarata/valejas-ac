/**
 * CAMADA DE DADOS — MODALIDADES
 * ─────────────────────────────────────────────────────────────────
 * Dois mundos (confirmado com Berto 2026-07-20):
 *  - COMPETIÇÃO: futebol + futsal federados, forte na formação (escalões).
 *  - COMUNIDADE: aulas recreativas pagas, abertas à comunidade.
 * ─────────────────────────────────────────────────────────────────
 */

export type Grupo = "competicao" | "comunidade";

export interface Modalidade {
  slug:      string;
  nome:      string;
  grupo:     Grupo;
  tagline:   string;
  descricao: string;
  publico:   string;
  ancora?:   boolean;   // leva ao plantel (/equipas)
}

export const MODALIDADES: Modalidade[] = [
  // ── Competição ────────────────────────────────────────────────
  {
    slug: "futebol",
    nome: "Futebol",
    grupo: "competicao",
    tagline: "Do bairro para o campo",
    descricao:
      "Futebol de 11 na AF Lisboa, da equipa principal à formação. Juniores A (Sub-19), B (Sub-17), C (Sub-15) e Veteranos.",
    publico: "Equipa principal, Juniores A/B/C e Veteranos",
    ancora: true,
  },
  {
    slug: "futsal",
    nome: "Futsal",
    grupo: "competicao",
    tagline: "Intensidade no pavilhão",
    descricao:
      "O maior projeto do clube. Equipa principal e B, formação dos Sub-9 aos Sub-19 (masculino e feminino) e Veteranos. Acompanha os jogos de todos os escalões.",
    publico: "Sénior, formação Sub-9 a Sub-19, feminino e Veteranos",
    ancora: true,
  },
  {
    slug: "futebol-7",
    nome: "Futebol de 7",
    grupo: "competicao",
    tagline: "Os primeiros passos",
    descricao:
      "O ponto de entrada dos mais novos no jogo. Campo mais curto, mais toques na bola, mais alegria.",
    publico: "Camadas jovens (Sub-11)",
  },

  // ── Comunidade ────────────────────────────────────────────────
  {
    slug: "ciclismo",
    nome: "Ciclismo",
    grupo: "comunidade",
    tagline: "Estrada e grupo",
    descricao:
      "Treino e pedalada em grupo para quem leva a bicicleta a sério. Atividade paga, aberta à comunidade.",
    publico: "Adultos",
  },
  {
    slug: "cicloturismo",
    nome: "Cicloturismo",
    grupo: "comunidade",
    tagline: "Pedalar sem cronómetro",
    descricao:
      "Passeios pela região, ao ritmo de todos. Conhecer estradas e fazer companhia, sem pressão de competição.",
    publico: "Todas as idades",
  },
  {
    slug: "kung-fu",
    nome: "Kung Fu",
    grupo: "comunidade",
    tagline: "Disciplina e corpo",
    descricao:
      "Arte marcial para foco, técnica e condição física. Aulas para quem começa do zero e para quem quer evoluir.",
    publico: "Jovens e adultos",
  },
  {
    slug: "danca",
    nome: "Dança",
    grupo: "comunidade",
    tagline: "Movimento e expressão",
    descricao:
      "Do ritmo à coreografia, para libertar, conviver e ganhar confiança. Turmas por idades.",
    publico: "Crianças, jovens e adultos",
  },
  {
    slug: "yoga",
    nome: "Yoga",
    grupo: "comunidade",
    tagline: "Respirar e equilibrar",
    descricao:
      "Aulas para força, flexibilidade e uma cabeça mais tranquila. Um espaço calmo dentro do clube.",
    publico: "Todas as idades",
  },
];

export const GRUPOS: { id: Grupo; titulo: string; intro: string }[] = [
  {
    id: "competicao",
    titulo: "Competição",
    intro: "Futebol e futsal federados, com o clube a formar dos mais novos aos veteranos.",
  },
  {
    id: "comunidade",
    titulo: "Comunidade",
    intro: "Aulas recreativas abertas a todos, para mexer, respirar e conviver.",
  },
];

export function getModalidadesPorGrupo(grupo: Grupo): Modalidade[] {
  return MODALIDADES.filter((m) => m.grupo === grupo);
}
