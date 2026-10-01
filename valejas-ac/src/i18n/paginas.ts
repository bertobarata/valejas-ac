/**
 * Que páginas estão traduzidas (decisão do Berto, 01/10/2026).
 *
 * Traduz-se o que serve quem chega de fora: o início, as modalidades,
 * a Academia Sénior, o clube, as inscrições, os sócios, os contactos e
 * a loja. Os comunicados, os jogos, as equipas e as páginas legais
 * ficam em português — as versões noutras línguas mostram o texto
 * português com um aviso, e o canónico aponta para a portuguesa.
 */

import { LINGUAS, type Lingua } from "./routing";

export const ROTAS_TRADUZIDAS = [
  "",
  "/modalidades",
  "/academia-senior",
  "/clube",
  "/clube/emblema",
  "/instalacoes",
  "/orgaos-sociais",
  "/patrocinadores",
  "/inscricoes",
  "/inscricoes/direitos-de-imagem",
  "/socios-contacto",
  "/socios/inscricao",
  "/contactos",
  "/loja",
  "/loja/carrinho",
] as const;

export function estaTraduzida(rota: string): boolean {
  const limpa = rota === "/" ? "" : rota;
  return (ROTAS_TRADUZIDAS as readonly string[]).includes(limpa);
}

/** /modalidades em inglês é /en/modalidades; em português não leva prefixo. */
export function rotaNaLingua(rota: string, lingua: Lingua): string {
  const limpa = rota === "/" ? "" : rota;
  if (lingua === "pt") return limpa || "/";
  return `/${lingua}${limpa}`;
}

/** Mapa hreflang → endereço, para os metadados e o sitemap. */
export function alternativas(rota: string): Record<string, string> {
  const mapa: Record<string, string> = {};
  for (const l of LINGUAS) mapa[l === "kea" ? "kea" : l] = rotaNaLingua(rota, l);
  mapa["x-default"] = rotaNaLingua(rota, "pt");
  return mapa;
}
