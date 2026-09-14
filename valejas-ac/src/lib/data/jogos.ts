/**
 * CAMADA DE DADOS — JOGOS E CLASSIFICAÇÃO
 * ─────────────────────────────────────────────────────────────────
 * Futsal, Equipa A — TRUECLINIC | Campeonato Distrital da I Divisão
 * da AF Lisboa, época 2026/27.
 *
 * O calendário é o oficial, tirado do programa de jogos da AF Lisboa
 * (PDF TRUECLINIC-CD-I-DIVISÃO-FUTSAL): trinta jornadas, datas, horas
 * e pavilhões. Nada aqui é inventado.
 *
 * Os RESULTADOS ficam vazios até se jogar. A CLASSIFICAÇÃO tem os
 * dezasseis clubes reais com tudo a zero — é o que é verdade antes da
 * primeira jornada. Um e outro atualizam-se em /direcao/jogos.
 * ─────────────────────────────────────────────────────────────────
 */

export const DADOS_DE_EXEMPLO = false;

export const CLUBE = "Valejas AC";

export const COMPETICAO = "TRUECLINIC | Campeonato Distrital I Divisão";

export const EPOCA = "2026/27";

/** Onde o Valejas joga em casa. */
export const PAVILHAO_CASA = "Pavilhão do Valejas Atlético Clube, Barcarena";

export interface Jogo {
  /** Número da jornada no campeonato, 1 a 30. */
  jornada?:  number;
  /** ISO 8601. */
  data:      string;
  casa:      string;
  fora:      string;
  local:     string;
  /** Só em jogos já disputados. */
  golosCasa?: number;
  golosFora?: number;
  competicao?: string;
}

/**
 * O calendário todo, por ordem. Trinta jornadas, de setembro a maio.
 */
export const CALENDARIO: Jogo[] = [
  { jornada:  1, data: "2026-09-19T21:00:00+01:00",
    casa: "Pregança", fora: CLUBE,
    local: "Pavilhão Desportivo Pregança do Mar, Pregança do Mar, Lourinhã" },
  { jornada:  2, data: "2026-09-26T19:00:00+01:00",
    casa: CLUBE, fora: "Jardim Amoreira",
    local: PAVILHAO_CASA },
  { jornada:  3, data: "2026-10-03T18:00:00+01:00",
    casa: "Novos Talentos", fora: CLUBE,
    local: "Pavilhão Escola Secundária Matias Aires, Mira Sintra, Agualva" },
  { jornada:  4, data: "2026-10-10T19:00:00+01:00",
    casa: CLUBE, fora: "Fonsecas Calçada",
    local: PAVILHAO_CASA },
  { jornada:  5, data: "2026-10-18T19:00:00+01:00",
    casa: "Futsal Oeiras", fora: CLUBE,
    local: "Pavilhão S. Julião da Barra, Oeiras" },
  { jornada:  6, data: "2026-10-24T19:00:00+01:00",
    casa: CLUBE, fora: "GROB",
    local: PAVILHAO_CASA },
  { jornada:  7, data: "2026-10-31T19:30:00+00:00",
    casa: "Académico Desportos", fora: CLUBE,
    local: "Recinto Coberto do Académico de Desportos, Póvoa de Santa Iria" },
  { jornada:  8, data: "2026-11-07T19:00:00+00:00",
    casa: CLUBE, fora: "União Alfornelos",
    local: PAVILHAO_CASA },
  { jornada:  9, data: "2026-11-21T21:00:00+00:00",
    casa: "Infantado A", fora: CLUBE,
    local: "Pavilhão João Villaret, Loures" },
  { jornada: 10, data: "2026-11-28T19:00:00+00:00",
    casa: CLUBE, fora: "Forte Casa",
    local: PAVILHAO_CASA },
  { jornada: 11, data: "2026-12-05T18:00:00+00:00",
    casa: "Carregado", fora: CLUBE,
    local: "Pavilhão Associação Desportiva Carregado, Carregado" },
  { jornada: 12, data: "2026-12-12T19:00:00+00:00",
    casa: CLUBE, fora: "Oriental RC",
    local: PAVILHAO_CASA },
  { jornada: 13, data: "2026-12-19T19:00:00+00:00",
    casa: CLUBE, fora: "Tojeira",
    local: PAVILHAO_CASA },
  { jornada: 14, data: "2027-01-10T18:00:00+00:00",
    casa: "Varejense", fora: CLUBE,
    local: "Recinto Coberto Varejense, Alto de São João, Lisboa" },
  { jornada: 15, data: "2027-01-16T19:00:00+00:00",
    casa: CLUBE, fora: "SM 3 Agosto",
    local: PAVILHAO_CASA },
  { jornada: 16, data: "2027-01-23T19:00:00+00:00",
    casa: CLUBE, fora: "Pregança",
    local: PAVILHAO_CASA },
  { jornada: 17, data: "2027-01-30T21:00:00+00:00",
    casa: "Jardim Amoreira", fora: CLUBE,
    local: "Pavilhão Escola Secundária Ramada, Odivelas" },
  { jornada: 18, data: "2027-02-13T19:00:00+00:00",
    casa: CLUBE, fora: "Novos Talentos",
    local: PAVILHAO_CASA },
  { jornada: 19, data: "2027-02-27T18:30:00+00:00",
    casa: "Fonsecas Calçada", fora: CLUBE,
    local: "Pavilhão Municipal de Alvalade, Alvalade" },
  { jornada: 20, data: "2027-03-06T19:00:00+00:00",
    casa: CLUBE, fora: "Futsal Oeiras",
    local: PAVILHAO_CASA },
  { jornada: 21, data: "2027-03-13T21:30:00+00:00",
    casa: "GROB", fora: CLUBE,
    local: "Pavilhão Escola Secundária Pedro Alexandrino, Póvoa de Santo Adrião" },
  { jornada: 22, data: "2027-03-20T19:00:00+00:00",
    casa: CLUBE, fora: "Académico Desportos",
    local: PAVILHAO_CASA },
  { jornada: 23, data: "2027-04-11T18:30:00+01:00",
    casa: "União Alfornelos", fora: CLUBE,
    local: "Pavilhão Escola Secundária Fernando Namora, Brandoa" },
  { jornada: 24, data: "2027-04-17T19:00:00+01:00",
    casa: CLUBE, fora: "Infantado A",
    local: PAVILHAO_CASA },
  { jornada: 25, data: "2027-04-24T20:00:00+01:00",
    casa: "Forte Casa", fora: CLUBE,
    local: "Pavilhão Municipal Forte da Casa, Forte da Casa" },
  { jornada: 26, data: "2027-05-01T19:00:00+01:00",
    casa: CLUBE, fora: "Carregado",
    local: PAVILHAO_CASA },
  { jornada: 27, data: "2027-05-08T19:00:00+01:00",
    casa: "Oriental RC", fora: CLUBE,
    local: "Pavilhão Desportivo de Marvila, Marvila" },
  { jornada: 28, data: "2027-05-15T19:00:00+01:00",
    casa: "Tojeira", fora: CLUBE,
    local: "Pavilhão Joaquim Aranha | Tojeira, Bairro Novo da Conceição, Abóboda" },
  { jornada: 29, data: "2027-05-22T19:00:00+01:00",
    casa: CLUBE, fora: "Varejense",
    local: PAVILHAO_CASA },
  { jornada: 30, data: "2027-05-29T21:00:00+01:00",
    casa: "SM 3 Agosto", fora: CLUBE,
    local: "Pavilhão dos Lóios, Marvila" },
].map((j) => ({ ...j, competicao: COMPETICAO }));

/** O próximo jogo por disputar, calculado a partir do calendário. */
export function proximoJogo(agora: Date = new Date()): Jogo | null {
  return CALENDARIO.find((j) => new Date(j.data) >= agora) ?? null;
}

export const PROXIMO_JOGO: Jogo | null = proximoJogo();

/**
 * Resultados. Vazio até se jogar — o departamento de comunicação
 * preenche-os em /direcao/jogos, e daí vêm pelo Sanity.
 */
export const RESULTADOS: Jogo[] = [];

/** Os dezasseis clubes da prova, por ordem alfabética. */
export const CLUBES_DA_PROVA = [
  "Académico Desportos",
  "Carregado",
  "Fonsecas Calçada",
  "Forte Casa",
  "Futsal Oeiras",
  "GROB",
  "Infantado A",
  "Jardim Amoreira",
  "Novos Talentos",
  "Oriental RC",
  "Pregança",
  "SM 3 Agosto",
  "Tojeira",
  "União Alfornelos",
  CLUBE,
  "Varejense",
];

export interface LinhaClassificacao {
  posicao: number;
  equipa:  string;
  jogos:   number;
  vitorias: number;
  empates:  number;
  derrotas: number;
  golosMarcados: number;
  golosSofridos: number;
  pontos:  number;
}

/**
 * Classificação. Antes da primeira jornada está tudo a zero, e é
 * assim que tem de aparecer: uma tabela inventada num site de clube
 * passa por verdadeira. Atualiza-se em /direcao/jogos.
 */
export const CLASSIFICACAO: LinhaClassificacao[] = CLUBES_DA_PROVA
  .map((equipa, i) => ({
    posicao: i + 1,
    equipa,
    jogos: 0,
    vitorias: 0,
    empates: 0,
    derrotas: 0,
    golosMarcados: 0,
    golosSofridos: 0,
    pontos: 0,
  }));

/* ── Ajudas de apresentação ─────────────────────────────────────── */

export function ehValejas(nome: string): boolean {
  return nome === CLUBE;
}

export function formatarData(iso: string): string {
  return new Intl.DateTimeFormat("pt-PT", {
    weekday: "long", day: "2-digit", month: "long",
    timeZone: "Europe/Lisbon",
  }).format(new Date(iso));
}

export function formatarHora(iso: string): string {
  return new Intl.DateTimeFormat("pt-PT", {
    hour: "2-digit", minute: "2-digit", timeZone: "Europe/Lisbon",
  }).format(new Date(iso));
}

export function formatarDataCurta(iso: string): string {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit", month: "short", year: "numeric",
    timeZone: "Europe/Lisbon",
  }).format(new Date(iso));
}

/** Vitória, empate ou derrota, do ponto de vista do Valejas. */
export function resultadoParaValejas(j: Jogo): "vitoria" | "empate" | "derrota" | null {
  if (j.golosCasa === undefined || j.golosFora === undefined) return null;
  const nossos    = ehValejas(j.casa) ? j.golosCasa : j.golosFora;
  const deles     = ehValejas(j.casa) ? j.golosFora : j.golosCasa;
  if (nossos > deles) return "vitoria";
  if (nossos < deles) return "derrota";
  return "empate";
}

/* ────────────────────────────────────────────────────────────────
 * PONTE COM O CMS
 * O departamento de comunicação escreve em /direcao/jogos, que
 * guarda no Sanity. O Sanity pensa em "adversário + jogo em casa";
 * o site pensa em "casa vs fora". Esta é a tradução entre os dois.
 * ──────────────────────────────────────────────────────────────── */

export interface JogoSanity {
  _id:              string;
  adversario:       string;
  data:             string;
  local?:           string;
  competicao?:      string;
  ehEmCasa?:        boolean;
  jogado?:          boolean;
  golosNossos?:     number;
  golosAdversario?: number;
}

export function doSanity(j: JogoSanity): Jogo {
  const emCasa = j.ehEmCasa !== false;
  return {
    data:  j.data,
    casa:  emCasa ? CLUBE : j.adversario,
    fora:  emCasa ? j.adversario : CLUBE,
    local: j.local ?? "",
    competicao: j.competicao,
    golosCasa: j.jogado
      ? (emCasa ? j.golosNossos : j.golosAdversario) ?? 0
      : undefined,
    golosFora: j.jogado
      ? (emCasa ? j.golosAdversario : j.golosNossos) ?? 0
      : undefined,
  };
}

/** O próximo por jogar, ou nada se não houver nenhum agendado. */
export function proximoDe(jogos: Jogo[]): Jogo | null {
  const agora = Date.now();
  const futuros = jogos
    .filter((j) => j.golosCasa === undefined && new Date(j.data).getTime() >= agora)
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  return futuros[0] ?? null;
}

/** Jogos já disputados, do mais recente para trás. */
export function resultadosDe(jogos: Jogo[], quantos = 5): Jogo[] {
  return jogos
    .filter((j) => j.golosCasa !== undefined)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, quantos);
}
