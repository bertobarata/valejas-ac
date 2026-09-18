/**
 * CAMADA DE DADOS — EMBLEMAS DOS ADVERSÁRIOS
 * ─────────────────────────────────────────────────────────────────
 * Ficheiros entregues pela Direção a 17/09/2026, organizados por
 * escalão. Vieram com fundos e tamanhos diferentes; estão todos
 * normalizados em ladrilho branco de 200×200 em `/public/emblemas/`.
 *
 * O adversário de um jogo é texto livre — escreve-se à mão em
 * /direcao/jogos. Ninguém vai escrever sempre igual, e por isso a
 * procura é por chave reduzida: sem acentos, sem maiúsculas, sem
 * espaços nem pontuação. «Fonsecas Calçada» e «fonsecas calcada»
 * dão no mesmo sítio.
 *
 * Quando não há emblema, não há emblema. A lista de jogos continua a
 * ler-se pelos nomes — é assim que se lê um calendário no jornal.
 * ─────────────────────────────────────────────────────────────────
 */

/** Os 45 ficheiros que existem em /public/emblemas/. */
const EMBLEMAS = [
  "3-dagosto-1885", "academia-johnson", "academico-ciencia", "alenquer-real",
  "alfornelos", "arranho", "benfica-b", "cad-academico-desporto", "carregado",
  "casal-rato", "caxienses", "cf-estrela", "cpcd", "estoril-praia",
  "fonsecas-calcada", "forte-da-casa", "graca", "grob", "infantado",
  "jardim-amoreira", "joma", "leoes-de-porto-salvo", "metralhas", "mira-sintra",
  "mtba", "novos-talentos", "nucleo-sintra", "oeiras-futsal", "oriental-rc",
  "patuscos", "preganca", "queijas-e-benfica", "quinta-do-lombo",
  "salesianos-do-estoril", "salesianos-lisboa", "sao-marcos", "sj-deus",
  "sporting-b", "tojeira", "unidos-cacem", "unidos-caxiense", "unidos-dearcena",
  "up-venda-nova", "varejense", "vinhais",
] as const;

/**
 * Clubes cujo nome no calendário não se parece com o nome do ficheiro.
 * Cada linha é um caso real do campeonato de 2026/27 — não é uma lista
 * defensiva a adivinhar o futuro.
 */
const SINONIMOS: Record<string, string> = {
  // A Direção escreve o nome curto; o ficheiro veio com a sigla.
  academicodesportos: "cad-academico-desporto",
  cad: "cad-academico-desporto",
  // «Forte Casa» no calendário, «Forte da Casa» no ficheiro.
  fortecasa: "forte-da-casa",
  // O calendário inverte as duas palavras.
  futsaloeiras: "oeiras-futsal",
  // «SM 3 Agosto» é o Sport Machadense 3 de Agosto de 1885.
  sm3agosto: "3-dagosto-1885",
  "3agosto": "3-dagosto-1885",
  // O «A» distingue a equipa, não o clube.
  infantadoa: "infantado",
  // O ficheiro só tem a segunda palavra.
  uniaoalfornelos: "alfornelos",
};

/** Sem acentos, sem maiúsculas, sem nada que não seja letra ou algarismo. */
function chave(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** Par chave→ficheiro, uma vez só, ao carregar o módulo. */
const PARES: [string, string][] = EMBLEMAS.map((e) => [chave(e), e]);
const PORCHAVE = new Map<string, string>(PARES);

/**
 * Endereço do emblema de um clube, ou `undefined` se não houver.
 *
 * Depois do nome exato e dos sinónimos, tenta-se por prefixo: é isso
 * que apanha «Varejense AC» a partir de «Varejense» sem inventar uma
 * entrada para cada forma de escrever o mesmo clube. Prefixos com
 * menos de quatro letras não contam — «SM» acertaria em meio mundo.
 */
export function emblemaDe(nomeClube: string): string | undefined {
  const k = chave(nomeClube);
  if (!k) return undefined;

  const achado =
    PORCHAVE.get(k) ??
    SINONIMOS[k] ??
    (k.length >= 4
      ? PARES.find(([kk]) => kk.startsWith(k) || k.startsWith(kk))?.[1]
      : undefined);

  return achado ? `/emblemas/${achado}.webp` : undefined;
}
