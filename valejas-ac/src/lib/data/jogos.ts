/**
 * CAMADA DE DADOS — JOGOS E CLASSIFICAÇÃO
 * ─────────────────────────────────────────────────────────────────
 * Futsal, Equipa A — distrital da AF Lisboa.
 *
 * ⚠️ DADOS DE EXEMPLO. Os adversários chamam-se "Equipa Adversária"
 * de propósito: é preferível um marcador óbvio a nomes de clubes
 * inventados, que já enganaram uma vez neste site.
 *
 * Substituir pelo calendário e classificação reais da AF Lisboa.
 * Quando houver CMS, isto passa a vir do Sanity.
 * ─────────────────────────────────────────────────────────────────
 */

export const DADOS_DE_EXEMPLO = true;

export const CLUBE = "Valejas AC";

export interface Jogo {
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

export const PROXIMO_JOGO: Jogo | null = {
  data:  "2026-09-20T18:00:00+01:00",
  casa:  CLUBE,
  fora:  "Equipa Adversária",
  local: "Pavilhão Multiusos de Valejas",
  competicao: "Distrital AF Lisboa",
};

/** Mais recente primeiro. */
export const RESULTADOS: Jogo[] = [
  {
    data: "2026-09-06T18:00:00+01:00",
    casa: CLUBE, fora: "Equipa Adversária B",
    golosCasa: 4, golosFora: 2,
    local: "Pavilhão Multiusos de Valejas",
    competicao: "Distrital AF Lisboa",
  },
  {
    data: "2026-08-30T17:00:00+01:00",
    casa: "Equipa Adversária C", fora: CLUBE,
    golosCasa: 1, golosFora: 1,
    local: "Pavilhão da Equipa Adversária C",
    competicao: "Distrital AF Lisboa",
  },
  {
    data: "2026-08-23T18:00:00+01:00",
    casa: CLUBE, fora: "Equipa Adversária D",
    golosCasa: 2, golosFora: 3,
    local: "Pavilhão Multiusos de Valejas",
    competicao: "Distrital AF Lisboa",
  },
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

/** 20 classificados, como pedido pela Direção. */
export const CLASSIFICACAO: LinhaClassificacao[] = Array.from({ length: 20 }, (_, i) => {
  const posicao = i + 1;
  const jogos   = 10;
  // Pontos descem com a posição, e vitórias/empates/derrotas são
  // derivados deles — assim a tabela de exemplo é internamente coerente
  // em vez de números soltos que não fecham.
  const pontos   = 24 - i;
  const empates  = pontos % 3;
  const vitorias = (pontos - empates) / 3;
  const derrotas = jogos - vitorias - empates;

  return {
    posicao,
    equipa: posicao === 4 ? CLUBE : `Equipa Adversária ${posicao}`,
    jogos,
    vitorias,
    empates,
    derrotas,
    golosMarcados: 42 - i,
    golosSofridos: 14 + i,
    pontos,
  };
});

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
