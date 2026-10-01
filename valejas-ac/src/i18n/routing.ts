/**
 * LÍNGUAS DO SITE
 * ─────────────────────────────────────────────────────────────────
 * Cinco línguas, fechadas a 14/09/2026 (TODO §9). O português não leva
 * prefixo — valejasac.pt/modalidades continua a ser o que sempre foi —
 * e as outras vivem em /en, /es, /fr e /kea.
 *
 * `localeDetection: false` é de propósito: o site nunca escolhe a
 * língua por quem visita, nem pelo navegador nem pelo país. Quem vive
 * em Valejas e fala crioulo tem um telemóvel em português e um IP
 * português. A língua muda-se no seletor, e fica enquanto se navega.
 *
 * `kea` é o código ISO do crioulo de Cabo Verde (kabuverdianu). A
 * tradução é da variante de Santiago, em ALUPEC.
 * ─────────────────────────────────────────────────────────────────
 */

import { defineRouting } from "next-intl/routing";

export const LINGUAS = ["pt", "en", "es", "fr", "kea"] as const;
export type Lingua = (typeof LINGUAS)[number];

/** Nome de cada língua escrito nela própria — é assim que se reconhece. */
export const NOME_LINGUA: Record<Lingua, string> = {
  pt:  "Português",
  en:  "English",
  es:  "Español",
  fr:  "Français",
  kea: "Kriolu",
};

/** Para o `og:locale` e o `hreflang`. */
export const LOCALE_OG: Record<Lingua, string> = {
  pt:  "pt_PT",
  en:  "en_GB",
  es:  "es_ES",
  fr:  "fr_FR",
  kea: "kea_CV",
};

export const routing = defineRouting({
  locales:         LINGUAS,
  defaultLocale:   "pt",
  localePrefix:    "as-needed",
  localeDetection: false,
});
