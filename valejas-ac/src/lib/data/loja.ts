/**
 * CAMADA DE DADOS — LOJA
 * ─────────────────────────────────────────────────────────────────
 * Decisões da Direção (13/09/2026):
 *  - Há stock na sede, e prazo máximo de 2 semanas para o que falta
 *  - Levantamento SEMPRE na sede. Nunca se envia para casa de ninguém
 *  - O kit obrigatório de formação é um pacote a preço fechado
 *  - O sócio escolhe entre pagar um sinal ou pagar tudo online
 *
 * ⚠️ CATÁLOGO DE EXEMPLO. Preços, tamanhos e stock são inventados e
 * têm de ser substituídos pelos reais antes de abrir ao público. Os
 * nomes dos produtos são genéricos de propósito — já houve conteúdo
 * inventado neste site a passar por real.
 * ─────────────────────────────────────────────────────────────────
 */

export const CATALOGO_DE_EXEMPLO = true;

/** Prazo máximo para o que não está em stock. */
export const PRAZO_ENCOMENDA_SEMANAS = 2;

/** Percentagem do total pedida como sinal de reserva. */
export const SINAL_PERCENTAGEM = 30;

export type CategoriaLoja =
  | "kit-formacao"
  | "jogo"
  | "treino"
  | "personalizado"
  | "sazonal";

export interface Variante {
  /** "6-8 anos", "S", "M", "42". O que estiver escrito na etiqueta. */
  tamanho: string;
  /** Unidades na sede. 0 = encomenda-se, com o prazo de 2 semanas. */
  stock: number;
}

export interface Produto {
  slug:        string;
  nome:        string;
  categoria:   CategoriaLoja;
  descricao:   string;
  /** Euros. */
  preco:       number;
  variantes:   Variante[];
  /** O que o pacote inclui. Só para o kit. */
  inclui?:     string[];
  /** Permite gravar nome e número. */
  personalizavel?: boolean;
  /** Ficheiro em /public/loja/. Sem ele, mostra-se um lugar reservado. */
  imagem?:     string;
}

export const CATEGORIAS: {
  id: CategoriaLoja;
  nome: string;
  intro: string;
}[] = [
  {
    id: "kit-formacao",
    nome: "Kit de formação",
    intro:
      "Obrigatório para quem joga nos escalões de formação. Vai completo, num preço só.",
  },
  {
    id: "jogo",
    nome: "Material de jogo",
    intro: "O que se veste em dia de jogo.",
  },
  {
    id: "treino",
    nome: "Material de treino",
    intro: "Para o trabalho de todas as semanas.",
  },
  {
    id: "personalizado",
    nome: "Personalizados",
    intro: "Com o nome e o número de quem os veste.",
  },
  {
    id: "sazonal",
    nome: "Material sazonal",
    intro: "O que aparece conforme a época e as ocasiões do clube.",
  },
];

export const PRODUTOS: Produto[] = [
  {
    slug: "kit-formacao-completo",
    nome: "Kit de Formação",
    categoria: "kit-formacao",
    descricao:
      "O equipamento completo exigido a quem joga na formação do clube. Principal, alternativo e treino, num pacote único.",
    preco: 85,
    inclui: [
      "Equipamento principal — camisola, calção e meias",
      "Equipamento alternativo — camisola, calção e meias",
      "Equipamento de treino — t-shirt e calção",
      "Saco do clube",
    ],
    variantes: [
      { tamanho: "6-8 anos",   stock: 4 },
      { tamanho: "8-10 anos",  stock: 6 },
      { tamanho: "10-12 anos", stock: 3 },
      { tamanho: "12-14 anos", stock: 0 },
      { tamanho: "14-16 anos", stock: 2 },
      { tamanho: "S",          stock: 5 },
      { tamanho: "M",          stock: 0 },
      { tamanho: "L",          stock: 1 },
    ],
  },
  {
    slug: "camisola-principal",
    nome: "Camisola Principal",
    categoria: "jogo",
    descricao: "A camisola de jogo, nas cores do clube.",
    preco: 32,
    personalizavel: true,
    variantes: [
      { tamanho: "8-10 anos", stock: 2 },
      { tamanho: "S", stock: 4 },
      { tamanho: "M", stock: 3 },
      { tamanho: "L", stock: 0 },
      { tamanho: "XL", stock: 1 },
    ],
  },
  {
    slug: "calcao-jogo",
    nome: "Calção de Jogo",
    categoria: "jogo",
    descricao: "Calção oficial, a condizer com a camisola principal.",
    preco: 18,
    variantes: [
      { tamanho: "S", stock: 6 },
      { tamanho: "M", stock: 4 },
      { tamanho: "L", stock: 2 },
    ],
  },
  {
    slug: "tshirt-treino",
    nome: "T-shirt de Treino",
    categoria: "treino",
    descricao: "Para o dia a dia no pavilhão.",
    preco: 20,
    variantes: [
      { tamanho: "8-10 anos", stock: 3 },
      { tamanho: "S", stock: 5 },
      { tamanho: "M", stock: 5 },
      { tamanho: "L", stock: 0 },
    ],
  },
  {
    slug: "casaco-treino",
    nome: "Casaco de Treino",
    categoria: "treino",
    descricao: "Para antes e depois, e para os pavilhões frios.",
    preco: 45,
    variantes: [
      { tamanho: "S", stock: 1 },
      { tamanho: "M", stock: 2 },
      { tamanho: "L", stock: 0 },
    ],
  },
  {
    slug: "camisola-personalizada",
    nome: "Camisola com Nome e Número",
    categoria: "personalizado",
    descricao:
      "A camisola principal com o nome e o número gravados. Feita por encomenda, sempre.",
    preco: 42,
    personalizavel: true,
    variantes: [
      { tamanho: "8-10 anos", stock: 0 },
      { tamanho: "S", stock: 0 },
      { tamanho: "M", stock: 0 },
      { tamanho: "L", stock: 0 },
    ],
  },
  {
    slug: "cachecol",
    nome: "Cachecol do Clube",
    categoria: "sazonal",
    descricao: "Para a bancada no inverno.",
    preco: 12,
    variantes: [{ tamanho: "Tamanho único", stock: 14 }],
  },
];

/* ── Ajudas ─────────────────────────────────────────────────────── */

export function produtosPorCategoria(c: CategoriaLoja): Produto[] {
  return PRODUTOS.filter((p) => p.categoria === c);
}

export function getProduto(slug: string): Produto | undefined {
  return PRODUTOS.find((p) => p.slug === slug);
}

export function temStock(p: Produto): boolean {
  return p.variantes.some((v) => v.stock > 0);
}

export function stockDe(p: Produto, tamanho: string): number {
  return p.variantes.find((v) => v.tamanho === tamanho)?.stock ?? 0;
}

/** O sinal, arredondado ao cêntimo acima. */
export function sinalDe(total: number): number {
  return Math.ceil((total * SINAL_PERCENTAGEM) / 100 * 100) / 100;
}

export function formatEuros(v: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: v % 1 === 0 ? 0 : 2,
  }).format(v);
}
