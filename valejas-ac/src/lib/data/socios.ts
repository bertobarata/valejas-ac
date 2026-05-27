/**
 * CAMADA DE DADOS — SÓCIOS & CONTACTO
 * ─────────────────────────────────────────────────────────────────
 * Edita aqui os planos de sócios, benefícios e dados de contacto.
 * Futuramente pode ser migrado para Sanity.io ou outro CMS.
 * ─────────────────────────────────────────────────────────────────
 */

export interface PlanoSocio {
  id:         string;
  nome:       string;
  preco:      number;          // euros/mês
  periodo:    "mês" | "ano";
  destaque:   boolean;
  beneficios: string[];
}

export const PLANOS: PlanoSocio[] = [
  {
    id:       "adepto",
    nome:     "Adepto",
    preco:    5,
    periodo:  "mês",
    destaque: false,
    beneficios: [
      "Cartão oficial de sócio",
      "Newsletter exclusiva",
      "Desconto de 10% na loja oficial",
      "Acesso à área reservada do site",
    ],
  },
  {
    id:       "vanguarda",
    nome:     "Vanguarda",
    preco:    12,
    periodo:  "mês",
    destaque: true,
    beneficios: [
      "Tudo do plano Adepto",
      "Bilhete para 1 jogo em casa por mês",
      "Desconto de 20% na loja oficial",
      "Acesso a conteúdos de bastidores",
      "Convite para eventos do clube",
    ],
  },
  {
    id:       "elite",
    nome:     "Elite",
    preco:    25,
    periodo:  "mês",
    destaque: false,
    beneficios: [
      "Tudo do plano Vanguarda",
      "Bilhete para todos os jogos em casa",
      "Lugar reservado no Pavilhão",
      "Camisola oficial da temporada",
      "Encontro anual com a equipa",
      "Prioridade em bilheteira para jogos fora",
    ],
  },
];

export const CONTACTO = {
  email:      "geral@valejasac.pt",
  telefone:   "+351 219 000 000",
  morada:     "Rua da Vanguarda, 14",
  codigoPostal: "2635-000 Valejas",
  concelho:   "Mafra",
  pais:       "Portugal",
  horario: [
    { dias: "Segunda a Sexta", horas: "09:00 – 18:00" },
    { dias: "Sábado",          horas: "09:00 – 13:00" },
    { dias: "Domingo",         horas: "Fechado" },
  ],
  redesSociais: {
    instagram: "https://instagram.com/valejasac",
    youtube:   "https://youtube.com/@valejasac",
    tiktok:    "https://tiktok.com/@valejasac",
    discord:   "https://discord.gg/valejasac",
  },
};
