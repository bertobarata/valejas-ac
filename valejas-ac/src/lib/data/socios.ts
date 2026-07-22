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
    id:       "aguia",
    nome:     "Águia",
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
      "Tudo do plano Águia",
      "Bilhete para todos os jogos em casa",
      "Lugar reservado no Pavilhão",
      "Camisola oficial da temporada",
      "Encontro anual com a equipa",
      "Prioridade em bilheteira para jogos fora",
    ],
  },
];

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
