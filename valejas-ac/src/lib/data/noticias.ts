/**
 * CAMADA DE DADOS — NOTÍCIAS
 * ─────────────────────────────────────────────────────────────────
 * Estes dados virão futuramente de um CMS (Sanity.io recomendado).
 * Enquanto o CMS não estiver configurado, edita diretamente este
 * ficheiro ou o ficheiro JSON correspondente.
 * ─────────────────────────────────────────────────────────────────
 */

export type Categoria = "Resultados" | "Mercado" | "Clube" | "Entrevista" | "Comunicado";

export interface Artigo {
  slug:       string;
  categoria:  Categoria;
  titulo:     string;
  excerto:    string;
  conteudo?:  string;
  data:       string;        // ISO date string, e.g. "2024-06-24"
  autor:      string;
  imagemUrl?: string;        // caminho em /public/images/news/
  destaque:   boolean;       // true = artigo em destaque no topo
}

/**
 * Sem artigos.
 *
 * Havia aqui quatro notícias inventadas — um reforço vindo do "São Paulo
 * FC" para um clube de futsal de Barcarena, uma academia em construção,
 * uma entrevista e um derby 5-1, todos datados de 2024 num site de 2026.
 * Ocupavam a maior secção da homepage e passavam por reais.
 *
 * O site trata a lista vazia como estado legítimo: a secção de notícias
 * desaparece da homepage e a página mostra que ainda não há nada, em vez
 * de fingir conteúdo. Quando a Direção tiver notícias a sério, é
 * acrescentar aqui ou ligar o Sanity.
 */
export const ARTIGOS: Artigo[] = [];

export function getArtigoDestaque(): Artigo | undefined {
  return ARTIGOS.find((a) => a.destaque);
}

export function getArtigosByCategoria(cat: Categoria | "Tudo"): Artigo[] {
  if (cat === "Tudo") return ARTIGOS;
  return ARTIGOS.filter((a) => a.categoria === cat);
}

export function getArtigoBySlug(slug: string): Artigo | undefined {
  return ARTIGOS.find((a) => a.slug === slug);
}

export const CATEGORIAS: Array<Categoria | "Tudo"> = [
  "Tudo", "Resultados", "Mercado", "Clube", "Entrevista", "Comunicado",
];

export function formatData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "numeric", month: "long", year: "numeric",
  });
}
