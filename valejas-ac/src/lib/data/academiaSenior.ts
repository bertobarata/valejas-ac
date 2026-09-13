/**
 * CAMADA DE DADOS — ACADEMIA SÉNIOR
 * ─────────────────────────────────────────────────────────────────
 * Programa comunitário do Valejas A.C. Social para maiores de 50 anos.
 * Não é uma modalidade desportiva — por isso vive à parte de
 * @/lib/data/modalidades.ts e tem página própria.
 *
 * Objetivo da Direção: uma comunidade mais velha ativa e integrada
 * no clube. Envelhecimento ativo, combate ao isolamento, aprendizagem
 * e convívio.
 * ─────────────────────────────────────────────────────────────────
 */

export interface AtividadeSenior {
  nome:      string;
  descricao: string;
  /** Agrupa as atividades para não serem uma lista solta. */
  familia:   "corpo" | "criar" | "aprender" | "conviver";
}

export const ACADEMIA = {
  nome:     "Academia Sénior de Valejas",
  projeto:  "Valejas A.C. Social",
  idade:    "Maiores de 50 anos",
  local:    "Sede do Valejas Atlético Clube",
  tagline:  "Envelhecer com o clube, não longe dele",
  intro:
    "Um espaço para aprender coisas novas, manter-se ativo e criar relações. " +
    "Não é uma escola nem um lar — é a parte do clube onde a vida continua " +
    "depois dos 50.",
  horario: [
    { dias: "Segunda a sexta", horas: "14h30 – 17h30" },
    { dias: "Sábado",          horas: "09h00 – 13h00" },
  ],
};

export const ATIVIDADES: AtividadeSenior[] = [
  // ── Corpo ──
  {
    nome: "Chi Kung",
    descricao: "Movimento lento e respiração, para equilíbrio e articulações.",
    familia: "corpo",
  },
  {
    nome: "Fit Sénior",
    descricao: "Exercício adaptado, feito para manter força e autonomia.",
    familia: "corpo",
  },
  {
    nome: "Danças tradicionais",
    descricao: "Os bailes de sempre, com música e companhia.",
    familia: "corpo",
  },

  // ── Criar ──
  {
    nome: "Coro",
    descricao: "Cantar em grupo, sem ninguém pedir currículo.",
    familia: "criar",
  },
  {
    nome: "Pintura e desenho",
    descricao: "Aulas para quem nunca pegou num pincel e para quem já pegou.",
    familia: "criar",
  },

  // ── Aprender ──
  {
    nome: "Informática e inclusão digital",
    descricao: "Telemóvel, computador e serviços online, ao ritmo de cada um.",
    familia: "aprender",
  },
  {
    nome: "Temas de saúde",
    descricao: "Sessões sobre o corpo, a idade e o que fazer com ambos.",
    familia: "aprender",
  },

  // ── Conviver ──
  {
    nome: "Sueca",
    descricao: "Competições organizadas pelo clube, à mesa da sede.",
    familia: "conviver",
  },
  {
    nome: "Bilhar",
    descricao: "Também com competições próprias, também com plateia.",
    familia: "conviver",
  },
  {
    nome: "Idas ao teatro",
    descricao: "Saídas de grupo para assistir a espetáculos.",
    familia: "conviver",
  },
  {
    nome: "Atividades culturais",
    descricao: "Visitas, convívios e o que a época pedir.",
    familia: "conviver",
  },
];

export const FAMILIAS: { id: AtividadeSenior["familia"]; titulo: string }[] = [
  { id: "corpo",    titulo: "Mexer o corpo" },
  { id: "criar",    titulo: "Criar" },
  { id: "aprender", titulo: "Aprender" },
  { id: "conviver", titulo: "Conviver" },
];

export function atividadesPorFamilia(f: AtividadeSenior["familia"]): AtividadeSenior[] {
  return ATIVIDADES.filter((a) => a.familia === f);
}
