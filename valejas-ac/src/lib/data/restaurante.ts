/**
 * O RESTAURANTE DO CLUBE — NINHO DA ROLA
 * ─────────────────────────────────────────────────────────────────
 * Funciona nas instalações do clube e é também patrocinador. Aparece
 * em destaque nos contactos para quem quer reservar mesa: o clube
 * recebia essas chamadas e tinha de as passar.
 *
 * Telefone confirmado pelo Berto a 01/10/2026. O horário vem da ficha
 * pública do restaurante (Google) — se mudar, é aqui que se acerta.
 *
 * A morada fica de fora de propósito: a ficha pública diz «Rua Irene
 * Isidro, Edifício V.A.C.», a sede do clube está na Estrada das
 * Palmeiras, e até alguém confirmar qual é a porta certa, o mapa
 * procura o restaurante pelo nome.
 * ─────────────────────────────────────────────────────────────────
 */

export const RESTAURANTE = {
  nome:     "O Ninho da Rola",
  telefone: "+351 210 143 029",
  logo:     "/patrocinadores/ninho-da-rola.webp",
  mapa:     "https://www.google.com/maps/search/?api=1&query=O+Ninho+da+Rola+Barcarena",
  /** Dia (0 = domingo) → horário. `null` é fechado. */
  horario: [
    { dia: 1, abre: "07:00", fecha: "22:00" },
    { dia: 2, abre: "07:00", fecha: "22:00" },
    { dia: 3, abre: null,    fecha: null },
    { dia: 4, abre: "07:00", fecha: "22:00" },
    { dia: 5, abre: "07:00", fecha: "00:00" },
    { dia: 6, abre: "07:00", fecha: "00:00" },
    { dia: 0, abre: "09:00", fecha: "18:00" },
  ],
} as const;

/** «+351 210 143 029» → «tel:+351210143029». */
export function linkTelefone(numero: string): string {
  return "tel:" + numero.replace(/\s+/g, "");
}
