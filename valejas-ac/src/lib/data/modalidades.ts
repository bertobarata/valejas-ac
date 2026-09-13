/**
 * CAMADA DE DADOS — MODALIDADES
 * ─────────────────────────────────────────────────────────────────
 * Lista confirmada em reunião com a Direção (13/09/2026).
 *
 * Saíram da lista anterior, por não existirem: futebol de 11,
 * futebol de 7, ciclismo, kung fu e yoga. Entraram: judo, karate
 * e teatro. O ciclismo dá lugar ao cicloturismo.
 *
 * A Academia Sénior não é uma modalidade — é um programa
 * comunitário e vive em @/lib/data/academiaSenior.ts.
 * ─────────────────────────────────────────────────────────────────
 */

/**
 * Agrupar por "competição" e "comunidade" deixou de funcionar quando o
 * karate e o cicloturismo passaram a competir: a fronteira ficou falsa.
 * O eixo passa a ser a natureza da atividade — desporto ou cultura — e
 * quem compete diz-se numa etiqueta, que é onde essa informação pertence.
 */
export type Grupo = "desporto" | "cultura";

export type Genero = "masculino" | "feminino" | "misto";

export interface Equipa {
  nome:      string;
  descricao: string;
}

export interface Parceria {
  nome:      string;
  descricao: string;
  valores?:  string[];
}

export interface Modalidade {
  slug:      string;
  nome:      string;
  grupo:     Grupo;
  tagline:   string;
  descricao: string;
  publico:   string;
  genero:    Genero;
  /** Equipas seniores, quando existem. */
  equipas?:  Equipa[];
  /** Escalões de formação, pela ordem real de progressão. */
  escaloes?: string[];
  /** Modalidade entregue com outra entidade. */
  parceria?: Parceria;
  /** Há competição federada nesta modalidade. */
  compete:   boolean;
  /** Só existe para os mais novos — não há vertente sénior. */
  apenasFormacao?: boolean;
  /** Leva ao plantel em /equipas. */
  ancora?:   boolean;
  /** Modalidade âncora do clube — tratamento visual próprio. */
  destaque?: boolean;
}

export const MODALIDADES: Modalidade[] = [
  // ── Desportos ─────────────────────────────────────────────────
  {
    slug: "futsal",
    nome: "Futsal",
    grupo: "desporto",
    compete: true,
    tagline: "A modalidade do clube",
    descricao:
      "O maior projeto do Valejas. Equipa profissional no distrital da AF Lisboa, equipa B logo atrás, e um percurso de formação completo dos petizes aos juniores — um miúdo pode entrar no clube em criança e chegar a sénior sem nunca mudar de camisola.",
    publico: "Seniores masculinos e formação masculina",
    genero: "masculino",
    equipas: [
      {
        nome: "Equipa A",
        descricao: "Equipa profissional, a competir no distrital da AF Lisboa.",
      },
      {
        nome: "Equipa B",
        descricao: "Degrau entre a formação e a equipa principal.",
      },
    ],
    escaloes: [
      "Petizes",
      "Traquinas",
      "Benjamins",
      "Infantis",
      "Iniciados",
      "Juvenis",
      "Juniores",
    ],
    ancora: true,
    destaque: true,
  },
  {
    slug: "atletismo",
    nome: "Atletismo",
    grupo: "desporto",
    compete: true,
    tagline: "Correr é de toda a gente",
    descricao:
      "Provas e treino regular, masculino e feminino, em todos os escalões — dos mais novos aos seniores.",
    publico: "Masculino e feminino, todos os escalões",
    genero: "misto",
  },

  {
    slug: "karate",
    nome: "Karate",
    grupo: "desporto",
    compete: true,
    tagline: "Técnica e cabeça fria",
    descricao:
      "Arte marcial com treino regular e competição. Foco, postura e condição física — para quem começa do zero e para quem já compete.",
    publico: "Jovens e adultos",
    genero: "misto",
  },
  {
    slug: "cicloturismo",
    nome: "Cicloturismo",
    grupo: "desporto",
    compete: true,
    tagline: "Estrada e grupo",
    descricao:
      "Passeios pela região e provas em grupo. Há lugar para quem quer competir e para quem só quer pedalar acompanhado.",
    publico: "Todas as idades",
    genero: "misto",
  },


  {
    slug: "judo",
    nome: "Judo",
    grupo: "desporto",
    compete: false,
    apenasFormacao: true,
    tagline: "Cair e levantar",
    descricao:
      "Só formação, para os mais novos, nas instalações do clube. Uma parceria que traz a Valejas uma escola de judo infantil com anos de casa.",
    publico: "Crianças e jovens",
    genero: "misto",
    parceria: {
      nome: "Judokinhas Kobayashi",
      descricao:
        "Uma das maiores escolas de judo infantil do país, dirigida por Renato Kobayashi e com o nome ligado ao mestre Kiyoshi Kobayashi. As aulas acontecem nas instalações do Valejas.",
      valores: [
        "Disciplina e respeito",
        "Autoconfiança",
        "Cooperação e amizade",
        "Autocontrolo",
        "Espírito desportivo",
      ],
    },
  },

  // ── Cultura e Comunidade ──────────────────────────────────────

  {
    slug: "danca",
    nome: "Dança",
    grupo: "cultura",
    compete: false,
    tagline: "Movimento e expressão",
    descricao:
      "Do ritmo à coreografia, para libertar, conviver e ganhar confiança.",
    publico: "Crianças, jovens e adultos",
    genero: "misto",
  },
  {
    slug: "teatro",
    nome: "Teatro",
    grupo: "cultura",
    compete: false,
    tagline: "Subir ao palco",
    descricao:
      "Representar, ensaiar e mostrar. Trabalho de grupo, voz e presença — e público para ver o resultado.",
    publico: "Todas as idades",
    genero: "misto",
  },
];

/**
 * Todas as modalidades têm vagas limitadas — ninguém se inscreve
 * diretamente, fala-se com o clube primeiro. Vive aqui para o texto
 * ser um só em todo o site.
 */
export const VAGAS = {
  titulo: "Fala connosco primeiro",
  texto:
    "Cada modalidade tem poucos lugares. Diz-nos o que te interessa e " +
    "respondemos logo se há vaga — antes de contares com ela.",
  curto: "Vagas limitadas — fala com o clube antes de te inscreveres",
};

export const GRUPOS: { id: Grupo; titulo: string; intro: string }[] = [
  {
    id: "desporto",
    titulo: "Desportos",
    intro:
      "Do pavilhão à pista e à estrada. Umas competem federadas, outras existem só para formar — está dito em cada uma.",
  },
  {
    id: "cultura",
    titulo: "Cultura e Comunidade",
    intro:
      "Atividades para criar, mostrar e conviver, sem competição à mistura.",
  },
];

export function getModalidadesPorGrupo(grupo: Grupo): Modalidade[] {
  return MODALIDADES.filter((m) => m.grupo === grupo);
}

export function getModalidade(slug: string): Modalidade | undefined {
  return MODALIDADES.find((m) => m.slug === slug);
}
