/**
 * CAMADA DE DADOS — PATROCINADORES E PARCERIAS
 * ─────────────────────────────────────────────────────────────────
 * Quem apoia o clube. Lista fornecida pela Direção (13/09/2026),
 * logótipos entregues pela Direção a 17/09/2026.
 *
 * Os logótipos vieram com fundos diferentes — uns brancos, dois
 * pretos — e em qualidades muito diferentes. Estão todos normalizados
 * em ladrilho branco de 440×440 em `/public/patrocinadores/`, para a
 * faixa não parecer uma colagem. Quem não tem ficheiro continua a
 * aparecer só com o nome em tipografia do clube, que é melhor do que
 * um logótipo esticado.
 *
 * ⚠️ Faltam os logótipos dos dois apoios que mais se veem: a ZEMIG,
 * que veste o clube, e a Junta de Freguesia de Barcarena.
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
  /**
   * Apoio cujo logótipo chegou mas que não consta da lista que a
   * Direção deu a 13/09. Fica fora do site até alguém do clube
   * confirmar que é apoiante e em que escalão entra — pôr uma casa na
   * parede de patrocínios sem ela saber é pior do que não a pôr.
   */
  porConfirmar?: boolean;
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
    logo: "/patrocinadores/oeiras-valley.webp",
  },
  {
    nome: "Restaurante QB",
    tipo: "local",
    descricao: "Restaurante em Queluz de Baixo.",
    logo: "/patrocinadores/qb-restaurante.webp",
  },
  {
    nome: "Ninho da Rola",
    tipo: "local",
    descricao: "Restaurante e café.",
    logo: "/patrocinadores/ninho-da-rola.webp",
  },
  {
    nome: "Muchacho",
    tipo: "local",
    descricao: "Restaurante.",
    logo: "/patrocinadores/muchacho.webp",
  },
  {
    // Confirmado pelo presidente a 23/09/2026, com o ramo descrito por
    // ele: veio na pasta de logótipos mas não na lista de 13/09.
    nome: "Ciao Cuore",
    tipo: "local",
    descricao: "Restaurante italiano e sushi.",
    logo: "/patrocinadores/ciao-cuore.webp",
  },
  /*
   * Os dois seguintes foram indicados pelo presidente a 23/09/2026, e
   * não constavam da lista de 13/09. Sem logótipo — o cartão mostra o
   * nome enquanto não houver ficheiro.
   */
  {
    nome: "Drive 360",
    tipo: "local",
    descricao: "Peças para automóveis.",
  },
  {
    nome: "António Rosa",
    tipo: "local",
    descricao: "Engenharia civil e certificação energética.",
  },
  /*
   * Veio na pasta de logótipos mas não na lista da Direção, e o
   * presidente não se pronunciou sobre ele a 23/09. O ficheiro está
   * tratado e o sítio está feito: tirar o `porConfirmar` publica-o.
   */
  {
    nome: "RE/MAX Grupo Sunset",
    tipo: "local",
    descricao: "Mediação imobiliária.",
    logo: "/patrocinadores/remax-grupo-sunset.webp",
    porConfirmar: true,
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

/** Só o que está confirmado pela Direção chega ao site. */
export function apoiosPorTipo(tipo: TipoApoio): Apoio[] {
  return APOIOS.filter((a) => a.tipo === tipo && !a.porConfirmar);
}

