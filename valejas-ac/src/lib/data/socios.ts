/**
 * CAMADA DE DADOS — SÓCIOS & CONTACTO
 * ─────────────────────────────────────────────────────────────────
 * Dados de contacto do clube.
 * Os planos de sócio saíram daqui: a quota é única (1€/mês) e vive
 * em @/lib/data/quota.ts.
 * Futuramente pode ser migrado para Sanity.io ou outro CMS.
 * ─────────────────────────────────────────────────────────────────
 */

/**
 * Quem recebe o quê, decidido com a Direção a 14/09/2026:
 *
 *   geral@        porta de entrada. Contactos, encomendas, fichas de
 *                 sócio e tudo o que não tenha caixa própria
 *   coordenacao@  as modalidades todas — inscrições e treinos
 *   comunicacao@  comunicados, imprensa e propostas de parceria
 *   presidente@   e direcao@ não recebem nada do site: são caixas de
 *                 trabalho das pessoas, não endereços de atendimento
 */
export const EMAILS = {
  geral:       "geral@valejasac.pt",
  coordenacao: "coordenacao@valejasac.pt",
  comunicacao: "comunicacao@valejasac.pt",
};

export const CONTACTO = {
  email:      EMAILS.geral,
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
    // A página certa, indicada pela comunicação do clube a 23/09/2026.
    // O endereço anterior, /valejasacdesporto, não é a página oficial.
    facebook:  "https://www.facebook.com/profile.php?id=61590043516439",
    youtube:   "https://youtube.com/@valejastv",
  },
};
