/**
 * CAMADA DE DADOS — PATROCINADORES E PARCERIAS
 * ─────────────────────────────────────────────────────────────────
 * Quem apoia o clube. Lista fornecida pela Direção (13/09/2026).
 *
 * ⚠️ Faltam logótipos e links. Enquanto não existirem, cada apoio
 * aparece com o nome em tipografia do clube — o que é melhor do que
 * um logótipo esticado ou de má qualidade.
 * ─────────────────────────────────────────────────────────────────
 */

export type TipoApoio = "principal" | "institucional" | "local";

export interface Apoio {
  nome:      string;
  tipo:      TipoApoio;
  /** O que é ou o que faz pelo clube. Curto. */
  descricao: string;
  /** Site oficial, quando houver. */
  url?:      string;
  /** Ficheiro em /public/patrocinadores/, quando houver. */
  logo?:     string;
}

export const APOIOS: Apoio[] = [
  {
    nome: "ZEMIG",
    tipo: "principal",
    descricao:
      "Equipamento e merchandising do clube. É na ZEMIG que se faz a loja oficial do Valejas.",
    url: "https://zemigsportswear.lojasonlinectt.pt/category/2-comprar-on-line-230-valejas-ac",
  },
  {
    nome: "Junta de Freguesia de Barcarena",
    tipo: "institucional",
    descricao:
      "A freguesia onde o clube nasceu e onde continua a trabalhar.",
  },
  {
    nome: "Oeiras Valley",
    tipo: "institucional",
    descricao:
      "A marca do concelho de Oeiras, onde o Valejas compete e forma.",
  },
  {
    nome: "Restaurante QB",
    tipo: "local",
    descricao: "Apoio local ao clube.",
  },
  {
    nome: "Ninho da Rola",
    tipo: "local",
    descricao: "Apoio local ao clube.",
  },
  {
    nome: "Muchacho",
    tipo: "local",
    descricao: "Apoio local ao clube.",
  },
];

export const TIPOS: { id: TipoApoio; titulo: string; intro: string }[] = [
  {
    id: "principal",
    titulo: "Patrocinador principal",
    intro: "Quem veste o clube.",
  },
  {
    id: "institucional",
    titulo: "Apoios institucionais",
    intro: "As instituições do território onde o Valejas vive.",
  },
  {
    id: "local",
    titulo: "Comércio local",
    intro: "Casas da terra que dão a mão ao clube.",
  },
];

export function apoiosPorTipo(tipo: TipoApoio): Apoio[] {
  return APOIOS.filter((a) => a.tipo === tipo);
}

/** Iniciais, enquanto não houver logótipos. */
export function iniciaisApoio(nome: string): string {
  const limpo = nome.replace(/^(Restaurante|Junta de Freguesia de)\s+/i, "").trim();
  const partes = limpo.split(/\s+/);
  return partes.length === 1
    ? limpo.slice(0, 2).toUpperCase()
    : ((partes[0][0] ?? "") + (partes[partes.length - 1][0] ?? "")).toUpperCase();
}
