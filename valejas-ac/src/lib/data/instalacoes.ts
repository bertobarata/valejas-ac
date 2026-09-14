/**
 * CAMADA DE DADOS — INSTALAÇÕES
 * ─────────────────────────────────────────────────────────────────
 * Os dois espaços do clube. Descrições a partir do que é conhecido
 * publicamente e do que a Direção confirmou.
 *
 * ⚠️ Faltam as fotografias. Cada espaço tem `fotos: []` à espera de
 * ficheiros em /public/instalacoes/. Enquanto estiver vazio, a página
 * mostra um lugar reservado em vez de imagens de banco — um clube de
 * bairro com fotos de stock seria pior do que sem fotos nenhumas.
 * ─────────────────────────────────────────────────────────────────
 */

export interface Foto {
  /** Caminho em /public/instalacoes/ */
  ficheiro:  string;
  /** Descrição para quem não vê a imagem. Obrigatória. */
  alt:       string;
  /** Legenda visível, opcional. */
  legenda?:  string;
}

export interface Instalacao {
  slug:      string;
  nome:      string;
  tipo:      string;
  descricao: string;
  /** O que lá acontece. */
  usos:      string[];
  morada?:   string;
  fotos:     Foto[];
}

export const INSTALACOES: Instalacao[] = [
  {
    slug: "sede",
    nome: "Sede do Clube",
    tipo: "Edifício V.A.C.",
    descricao:
      "O ponto de encontro do Valejas. É aqui que a Direção trabalha, que se tratam as inscrições e os cartões de sócio, e que a Academia Sénior funciona todas as tardes.",
    usos: [
      "Direção e secretaria",
      "Inscrições e entrega de cartões de sócio",
      "Academia Sénior",
      "Sueca, bilhar e convívio",
      "Eventos e festas do clube",
    ],
    // Como consta no papel timbrado do clube.
    morada: "Estrada das Palmeiras, Edifício V.A.C. — Valejas, 2730-132 Barcarena",
    fotos: [],
  },
  {
    slug: "pavilhao",
    // É assim que se chama no programa de jogos da AF Lisboa. Chamava-se
    // aqui "Pavilhão Multiusos", que não é o nome por que a federação o
    // conhece nem o que aparece nas convocatórias.
    nome: "Pavilhão do Valejas Atlético Clube",
    tipo: "Piso flutuante, 40 × 20 m",
    descricao:
      "O recinto onde o futsal joga e treina, dos petizes à equipa principal. É aqui que se disputam os quinze jogos em casa do campeonato distrital.",
    usos: [
      "Jogos de futsal, todos os escalões",
      "Treinos da Equipa A, Equipa B e formação",
      "Karate, judo e dança",
      "Provas e convívios do clube",
    ],
    morada: "Barcarena, Oeiras",
    fotos: [],
  },
];

export function getInstalacao(slug: string): Instalacao | undefined {
  return INSTALACOES.find((i) => i.slug === slug);
}
