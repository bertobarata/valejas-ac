/**
 * CAMADA DE DADOS — LOJA
 * ─────────────────────────────────────────────────────────────────
 * Decisões da Direção (13/09/2026):
 *  - Levantamento SEMPRE na sede. Nunca se envia para casa de ninguém
 *  - O que não está na sede encomenda-se, até 2 semanas
 *  - O sócio escolhe entre pagar um sinal ou pagar tudo online
 *
 * O catálogo é o do fornecedor — a ZEMIG Sportswear, onde a loja do
 * clube esteve alojada na plataforma CTT. Referências, preços,
 * tamanhos e fotografias vieram de lá a 14/09/2026.
 *
 * Duas coisas que o fornecedor não sabe e o clube tem de preencher:
 *
 *  1. STOCK. Aqui está tudo a zero, ou seja, tudo «por encomenda».
 *     É o mais honesto enquanto ninguém contar o que há na sede —
 *     prometer entrega imediata do que não existe é pior que avisar
 *     do prazo.
 *  2. PREÇO. Treze artigos estão «sob consulta» no fornecedor, e é
 *     assim que aparecem aqui: não se encomendam pelo site, pede-se
 *     orçamento ao clube.
 * ─────────────────────────────────────────────────────────────────
 */

/** Já não há produtos inventados: o catálogo é o real do fornecedor. */
export const CATALOGO_DE_EXEMPLO = false;

/** De onde vem o catálogo, para quem perguntar. */
export const FORNECEDOR = {
  nome: "ZEMIG Sportswear",
  atualizado: "14 de setembro de 2026",
};

/** Prazo máximo para o que não está em stock. */
export const PRAZO_ENCOMENDA_SEMANAS = 2;

/** Percentagem do total pedida como sinal de reserva. */
export const SINAL_PERCENTAGEM = 30;

export type CategoriaLoja =
  | "jogo"
  | "treino"
  | "adepto"
  | "acessorios";

export interface Variante {
  /** "6anos", "S", "M", "37-40". O que estiver escrito na etiqueta. */
  tamanho: string;
  /** Unidades na sede. 0 = encomenda-se, com o prazo de 2 semanas. */
  stock: number;
}

export interface Produto {
  slug:        string;
  nome:        string;
  /** Referência do fornecedor. É por ela que o clube encomenda. */
  referencia:  string;
  categoria:   CategoriaLoja;
  descricao:   string;
  /** Euros. Zero quando o preço é sob consulta. */
  preco:       number;
  /** Sem preço fechado: encomenda-se falando com o clube. */
  sobConsulta?: boolean;
  variantes:   Variante[];
  /** O que o conjunto inclui, quando é mais do que uma peça. */
  inclui?:     string[];
  /** Permite gravar nome e número. */
  personalizavel?: boolean;
  /** Ficheiro em /public/loja/. Sem ele, mostra-se um lugar reservado. */
  imagem?:     string;
  /** Conjunto montado a partir de outras peças do catálogo. */
  kit?:        boolean;
}

export const CATEGORIAS: {
  id: CategoriaLoja;
  nome: string;
  intro: string;
}[] = [
  {
    id: "jogo",
    nome: "Equipamento de jogo",
    intro:
      "O que se veste em dia de jogo. Os conjuntos vão com camisola e calção; as meias compram-se à parte.",
  },
  {
    id: "treino",
    nome: "Treino e agasalho",
    intro: "Para o trabalho de todas as semanas e para o frio à beira do campo.",
  },
  {
    id: "adepto",
    nome: "Para adeptos",
    intro:
      "Para quem vai ver. Podem levar nome e número — ou a fotografia de quem joga cá em casa.",
  },
  {
    id: "acessorios",
    nome: "Acessórios",
    intro: "Cachecóis, mochilas e o resto do que se leva para o pavilhão.",
  },
];

/** Tamanhos do fornecedor para vestuário: criança e adulto na mesma escala. */
const TAMANHOS_VESTUARIO = [
  "4 anos", "6 anos", "8 anos", "10 anos", "12 anos", "14 anos",
  "XS", "S", "M", "L", "XL", "2XL", "3XL",
];

/** Tamanhos das meias. */
const TAMANHOS_MEIAS = ["26-29", "30-36", "37-40", "Adulto"];

/**
 * Tudo a zero por agora — ver a nota de stock no topo do ficheiro.
 * Quando o clube contar o que tem na sede, é aqui que o número entra.
 */
function porEncomenda(tamanhos: string[]): Variante[] {
  return tamanhos.map((tamanho) => ({ tamanho, stock: 0 }));
}

const CATALOGO: Produto[] = [
  // ── Equipamento de jogo ───────────────────────────────────────
  {
    slug: "equipamento-principal",
    nome: "Equipamento principal",
    referencia: "ZM-1000.02",
    categoria: "jogo",
    descricao:
      "As cores do clube: camisola às riscas amarelas e azuis, calção azul e meias a condizer. Sublimação total, com os patrocinadores da época.",
    preco: 27.68,
    inclui: ["Camisola", "Calção", "Meias"],
    personalizavel: true,
    variantes: porEncomenda(TAMANHOS_VESTUARIO),
    imagem: "/loja/equipamento-principal.webp",
  },
  {
    slug: "equipamento-branco",
    nome: "Equipamento alternativo branco",
    referencia: "ZM-1000.01",
    categoria: "jogo",
    descricao:
      "O equipamento alternativo, para quando as cores do adversário chocam com as nossas.",
    preco: 27.68,
    inclui: ["Camisola", "Calção", "Meias"],
    personalizavel: true,
    variantes: porEncomenda(TAMANHOS_VESTUARIO),
    imagem: "/loja/equipamento-branco.webp",
  },
  {
    slug: "equipamento-azul",
    nome: "Equipamento azul-marinho",
    referencia: "ZM-1000.04",
    categoria: "jogo",
    descricao: "Terceiro equipamento, em azul-marinho.",
    preco: 27.68,
    inclui: ["Camisola", "Calção", "Meias"],
    personalizavel: true,
    variantes: porEncomenda(TAMANHOS_VESTUARIO),
    imagem: "/loja/equipamento-azul.webp",
  },
  {
    slug: "equipamento-verde",
    nome: "Equipamento de guarda-redes",
    referencia: "ZM-1000.03",
    categoria: "jogo",
    descricao:
      "Verde, para o guarda-redes se distinguir de toda a gente dentro do campo.",
    preco: 27.68,
    inclui: ["Camisola", "Calção", "Meias"],
    personalizavel: true,
    variantes: porEncomenda(TAMANHOS_VESTUARIO),
    imagem: "/loja/equipamento-verde.webp",
  },
  {
    slug: "conjunto-azul",
    nome: "Conjunto de treino azul",
    referencia: "ZM-4000.01",
    categoria: "jogo",
    descricao:
      "Camisola azul e calção amarelo, do modelo standard do fornecedor. O conjunto mais barato do catálogo.",
    preco: 13.53,
    inclui: ["Camisola", "Calção"],
    variantes: porEncomenda(TAMANHOS_VESTUARIO),
    imagem: "/loja/conjunto-azul.webp",
  },
  {
    slug: "conjunto-verde",
    nome: "Conjunto de treino verde",
    referencia: "ZM-4000.02",
    categoria: "jogo",
    descricao: "Camisola verde e calção preto, modelo standard.",
    preco: 13.53,
    inclui: ["Camisola", "Calção"],
    variantes: porEncomenda(TAMANHOS_VESTUARIO),
    imagem: "/loja/conjunto-verde.webp",
  },
  {
    slug: "conjunto-branco",
    nome: "Conjunto branco",
    referencia: "ZM-2000.03",
    categoria: "jogo",
    descricao:
      "Camisola branca com o emblema e o nome do clube nas costas, com calção azul-marinho.",
    preco: 22.14,
    inclui: ["Camisola", "Calção"],
    variantes: porEncomenda(TAMANHOS_VESTUARIO),
    imagem: "/loja/conjunto-branco.webp",
  },
  {
    slug: "meias-azuis",
    nome: "Meias altas azuis",
    referencia: "ZM-14000.04",
    categoria: "jogo",
    descricao: "Meias altas de jogo, azuis.",
    preco: 4.61,
    variantes: porEncomenda(TAMANHOS_MEIAS),
    imagem: "/loja/meias-azuis.webp",
  },
  {
    slug: "meias-brancas",
    nome: "Meias altas brancas",
    referencia: "ZM-14000.03",
    categoria: "jogo",
    descricao: "Meias altas de jogo, brancas.",
    preco: 4.61,
    variantes: porEncomenda(TAMANHOS_MEIAS),
    imagem: "/loja/meias-brancas.webp",
  },
  {
    slug: "meias-marinho",
    nome: "Meias altas azul-marinho",
    referencia: "ZM-14000.06",
    categoria: "jogo",
    descricao: "Meias altas de jogo, azul-marinho.",
    preco: 4.61,
    variantes: porEncomenda(TAMANHOS_MEIAS),
    imagem: "/loja/meias-marinho.webp",
  },
  {
    slug: "meias-verdes",
    nome: "Meias altas verdes",
    referencia: "ZM-14000.05",
    categoria: "jogo",
    descricao: "Meias altas de jogo, verdes — a condizer com o equipamento de guarda-redes.",
    preco: 4.61,
    variantes: porEncomenda(TAMANHOS_MEIAS),
    imagem: "/loja/meias-verdes.webp",
  },

  // ── Treino e agasalho ─────────────────────────────────────────
  {
    slug: "fato-treino",
    nome: "Fato de treino completo",
    referencia: "ZM-5000.02",
    categoria: "treino",
    descricao:
      "Casaco com capuz e calças, em azul-marinho com as riscas do clube. O agasalho oficial.",
    preco: 39.98,
    inclui: ["Casaco com capuz", "Calças"],
    variantes: porEncomenda(TAMANHOS_VESTUARIO),
    imagem: "/loja/fato-treino.webp",
  },
  {
    slug: "sweat-capuz",
    nome: "Camisola com capuz",
    referencia: "ZM-23000.01",
    categoria: "treino",
    descricao:
      "Camisola com capuz, azul-marinho, com VALEJAS AC ao peito. Só o casaco, sem as calças.",
    preco: 0,
    sobConsulta: true,
    variantes: porEncomenda(TAMANHOS_VESTUARIO),
    imagem: "/loja/sweat-capuz.webp",
  },
  {
    slug: "calcas-treino",
    nome: "Calças de fato de treino",
    referencia: "ZM-18000.01",
    categoria: "treino",
    descricao: "As calças do fato de treino, vendidas à parte.",
    preco: 0,
    sobConsulta: true,
    variantes: porEncomenda(TAMANHOS_VESTUARIO),
    imagem: "/loja/calcas-treino.webp",
  },
  {
    slug: "bermuda",
    nome: "Bermuda",
    referencia: "ZM-11000.01",
    categoria: "treino",
    descricao: "Calção comprido azul-marinho, para treinar ou para o dia a dia.",
    preco: 0,
    sobConsulta: true,
    variantes: porEncomenda(TAMANHOS_VESTUARIO),
    imagem: "/loja/bermuda.webp",
  },

  // ── Para adeptos ──────────────────────────────────────────────
  {
    slug: "camisola-adepto-mote",
    nome: "Camisola de adepto «A união faz a força»",
    referencia: "ZM-10000.02",
    categoria: "adepto",
    descricao:
      "Azul-marinho, com o mote do clube à frente e VAC nas costas. Para a bancada, não para o campo.",
    preco: 0,
    sobConsulta: true,
    variantes: porEncomenda(TAMANHOS_VESTUARIO),
    imagem: "/loja/camisola-adepto-mote.webp",
  },
  {
    slug: "camisola-adepto-foto",
    nome: "Camisola de adepto personalizada",
    referencia: "ZM-10000.01",
    categoria: "adepto",
    descricao:
      "Sublimada com a fotografia de quem joga cá em casa, o nome e o número. Combina-se com o clube que fotografias usar.",
    preco: 0,
    sobConsulta: true,
    personalizavel: true,
    variantes: porEncomenda(TAMANHOS_VESTUARIO),
    imagem: "/loja/camisola-adepto-foto.webp",
  },
  {
    slug: "sweat-personalizada",
    nome: "Camisola personalizada de família",
    referencia: "ZM-27000.01",
    categoria: "adepto",
    descricao:
      "Camisola com «MÃE DO» ou «PAI DO» e o nome do atleta. Vista-se nas bancadas e reconhece-se de longe.",
    preco: 0,
    sobConsulta: true,
    personalizavel: true,
    variantes: porEncomenda(TAMANHOS_VESTUARIO),
    imagem: "/loja/sweat-personalizada.webp",
  },
  {
    slug: "casaco-california",
    nome: "Casaco California",
    referencia: "PB-6440.01",
    categoria: "adepto",
    descricao:
      "Casaco de corte universitário, preto com mangas brancas e o emblema ao peito.",
    preco: 0,
    sobConsulta: true,
    variantes: porEncomenda(TAMANHOS_VESTUARIO),
    imagem: "/loja/casaco-california.webp",
  },

  // ── Acessórios ────────────────────────────────────────────────
  {
    slug: "cachecol-lema",
    nome: "Cachecol do clube",
    referencia: "ZM-32000.03",
    categoria: "acessorios",
    descricao:
      "Azul e amarelo, com VALEJAS AC de um lado e «o nosso lema é ganhar, ganhar, ganhar» do outro.",
    preco: 0,
    sobConsulta: true,
    variantes: [{ tamanho: "Tamanho único", stock: 0 }],
    imagem: "/loja/cachecol-lema.webp",
  },
  {
    slug: "cachecol-personalizado",
    nome: "Cachecol personalizado",
    referencia: "ZM-32000.02",
    categoria: "acessorios",
    descricao: "Com o nome e o número de quem o veste, sublimado nas duas faces.",
    preco: 0,
    sobConsulta: true,
    personalizavel: true,
    variantes: [{ tamanho: "Tamanho único", stock: 0 }],
    imagem: "/loja/cachecol-personalizado.webp",
  },
  {
    slug: "cachecol-rosa",
    nome: "Cachecol rosa",
    referencia: "ZM-32000.01",
    categoria: "acessorios",
    descricao: "Versão em rosa, com VALEJAS AC nas duas faces.",
    preco: 0,
    sobConsulta: true,
    variantes: [{ tamanho: "Tamanho único", stock: 0 }],
    imagem: "/loja/cachecol-rosa.webp",
  },
  {
    slug: "mochila",
    nome: "Mochila do clube",
    referencia: "ZM-69000.01",
    categoria: "acessorios",
    descricao:
      "Mochila sublimada com as riscas e o emblema, com bolso para as chuteiras.",
    preco: 0,
    sobConsulta: true,
    variantes: [{ tamanho: "Tamanho único", stock: 0 }],
    imagem: "/loja/mochila.webp",
  },
];

/**
 * KIT OBRIGATÓRIO DE ATLETA
 * ─────────────────────────────────────────────────────────────────
 * Quem se inscreve para jogar leva isto: o equipamento das cores do
 * clube, o alternativo para quando as cores chocam com as do
 * adversário, e um conjunto para treinar durante a semana.
 *
 * O preço vem do comunicado da Direção de 01/09/2026 e é um preço de
 * pacote: 110€ fechados, abaixo da soma das peças ao balcão. Era
 * calculado a partir do catálogo e dava 68,89€ — número que o clube
 * nunca cobrou, porque o kit da Direção leva mais peças do que as três
 * que a soma contava.
 * ─────────────────────────────────────────────────────────────────
 */

/** Preço de pacote fechado pela Direção para a época 2026/2027. */
export const PRECO_KIT = 110;

/**
 * O que o comunicado diz que o kit leva. É esta a lista que a família
 * lê no papel, por isso é esta que o site mostra — não a dos slugs.
 */
const CONTEUDO_DO_KIT = [
  "2 equipamentos de jogo",
  "1 camisola de treino",
  "1 calção de treino",
  "1 par de meias de treino",
  "1 fato de treino com capuz",
  "1 polo",
  "1 bermuda",
];

/**
 * As peças do catálogo que se mostram por baixo do kit. Cobrem o
 * essencial do conteúdo acima; o polo ainda não existe no catálogo da
 * ZEMIG que recebemos a 14/09.
 */
export const PECAS_DO_KIT = [
  "equipamento-principal",
  "equipamento-branco",
  "conjunto-azul",
  "fato-treino",
  "bermuda",
] as const;

function montarKit(catalogo: Produto[]): Produto {
  const pecas = PECAS_DO_KIT
    .map((slug) => catalogo.find((p) => p.slug === slug))
    .filter((p): p is Produto => Boolean(p));

  return {
    slug: "kit-atleta",
    nome: "Kit obrigatório de atleta",
    referencia: pecas.map((p) => p.referencia).join(" + "),
    categoria: "jogo",
    descricao:
      "O que todo o atleta do clube tem de ter, num pedido só: dois " +
      "equipamentos de jogo, o que é preciso para treinar durante a " +
      "semana, e o agasalho para a beira do campo.",
    preco: PRECO_KIT,
    inclui: CONTEUDO_DO_KIT,
    personalizavel: true,
    // Todas as peças partilham a mesma escala de tamanhos.
    variantes: pecas[0]?.variantes ?? [],
    imagem: "/loja/kit-atleta.webp",
    kit: true,
  };
}

export const KIT_ATLETA: Produto = montarKit(CATALOGO);

/** O kit primeiro: é o que a maioria vem cá buscar. */
export const PRODUTOS: Produto[] = [KIT_ATLETA, ...CATALOGO];

/** As peças soltas que o kit junta, para as mostrar por baixo dele. */
export function pecasDoKit(): Produto[] {
  return PECAS_DO_KIT
    .map((slug) => CATALOGO.find((p) => p.slug === slug))
    .filter((p): p is Produto => Boolean(p));
}

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

/** Produtos que se podem encomendar pelo site: os que têm preço fechado. */
export function temPrecoFechado(p: Produto): boolean {
  return !p.sobConsulta && p.preco > 0;
}

/** Sinal de reserva, arredondado aos cêntimos. */
export function sinalDe(total: number): number {
  return Math.round(total * (SINAL_PERCENTAGEM / 100) * 100) / 100;
}

export function formatEuros(v: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(v) ? 0 : 2,
  }).format(v);
}
