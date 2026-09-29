import type { Metadata } from "next";

/**
 * METADADOS POR PÁGINA
 * ─────────────────────────────────────────────────────────────────
 * O Next junta os metadados da página aos do layout, mas não mistura
 * objetos por dentro: se a página não trouxer `openGraph` nem
 * `alternates`, herda os do layout tal e qual. E os do layout são os
 * da página inicial — canónico `/`, título «O clube da nossa terra».
 *
 * Resultado, antes disto: todas as páginas diziam ao Google que eram
 * cópias da inicial, e um link da loja partilhado no WhatsApp aparecia
 * como a página inicial. Esta função dá a cada página o seu canónico e
 * a sua própria pré-visualização.
 * ─────────────────────────────────────────────────────────────────
 */

export const NOME_SITE = "Valejas Atlético Clube";

export const OPEN_GRAPH_BASE: NonNullable<Metadata["openGraph"]> = {
  siteName: NOME_SITE,
  locale: "pt_PT",
  type: "website",
  images: [{ url: "/imagem-partilha", width: 1200, height: 630, alt: NOME_SITE }],
};

export function paraPagina(
  rota: string,
  meta: Metadata & { title: string; description: string },
): Metadata {
  return {
    ...meta,
    alternates: { canonical: rota },
    openGraph: {
      ...OPEN_GRAPH_BASE,
      url: rota,
      title: `${meta.title} | Valejas AC`,
      description: meta.description,
    },
  };
}
