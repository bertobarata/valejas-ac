/**
 * CAMADA DE DADOS — SÓCIOS & CONTACTO
 * ─────────────────────────────────────────────────────────────────
 * Dados de contacto do clube.
 * Os planos de sócio saíram daqui: a quota é única (1€/mês) e vive
 * em @/lib/data/quota.ts.
 * Futuramente pode ser migrado para Sanity.io ou outro CMS.
 * ─────────────────────────────────────────────────────────────────
 */

export const CONTACTO = {
  email:      "valejas.a.c@gmail.com",
  telefone:   "+351 214 365 104",
  morada:     "Estrada das Palmeiras, 1A",
  codigoPostal: "2730-132 Valejas",
  concelho:   "Oeiras",
  pais:       "Portugal",
  horario: [
    { dias: "Segunda a Sexta", horas: "09:30 – 17:00" },
    { dias: "Sábado",          horas: "Dias de jogo" },
    { dias: "Domingo",         horas: "Dias de jogo" },
  ],
  redesSociais: {
    instagram: "https://instagram.com/valejasa.c.desporto",
    facebook:  "https://facebook.com/valejasacdesporto",
    youtube:   "https://youtube.com/@valejastv",
  },
};
