/**
 * CAMADA DE DADOS — HISTÓRIA DO CLUBE
 * ─────────────────────────────────────────────────────────────────
 * Fundado a 1 de novembro de 1966, em Valejas, freguesia de Barcarena,
 * concelho de Oeiras.
 *
 * Nota importante sobre o que aqui está: não existe registo público
 * com os nomes dos fundadores nem ata da fundação. A página assume
 * isso em vez de inventar — e convida quem souber a contar.
 * ─────────────────────────────────────────────────────────────────
 */

export const FUNDACAO = {
  data:      "1 de novembro de 1966",
  ano:       1966,
  localidade: "Valejas",
  freguesia: "Barcarena",
  concelho:  "Oeiras",
  distrito:  "Lisboa",
};

/** Anos completos desde a fundação, calculados — não escritos à mão. */
export function anosDeVida(): number {
  return new Date().getFullYear() - FUNDACAO.ano;
}

export interface Origem {
  nome:      string;
  descricao: string;
}

/** Por onde o clube começou, antes do futsal. */
export const ORIGENS: Origem[] = [
  {
    nome: "Atletismo",
    descricao:
      "Organização e participação em provas locais, incluindo o Grande Prémio de Atletismo do Valejas Atlético Clube.",
  },
  {
    nome: "Cicloturismo",
    descricao:
      "Passeios de bicicleta pela região e participação em iniciativas de cicloturismo.",
  },
  {
    nome: "Malha e convívio",
    descricao:
      "Jogo da malha e outras atividades recreativas tradicionais, ligadas às festas e à vida da localidade.",
  },
];

/** O que veio depois, sem datas precisas — por isso não é uma cronologia. */
export const DEPOIS = [
  "Futsal, hoje a modalidade âncora, com equipa profissional e formação completa",
  "Caminhadas, danças, ginástica e outras atividades de convívio",
  "Academia Sénior, para os maiores de 50",
];

export const LOCALIZACAO = {
  morada:       "Estrada das Palmeiras, Edifício V.A.C.",
  moradaAlt:    "Estrada das Palmeiras, 1A",
  codigoPostal: "2730-132",
  localidade:   "Queluz de Baixo",
  freguesia:    "Barcarena",
  concelho:     "Oeiras",
  pais:         "Portugal",
  coordenadas:  { lat: 38.73681, lng: -9.26915 },
};

/** Mapa embebido, sem chave de API e sem cookies do Google até haver interação. */
export function urlMapaEmbed(): string {
  const { lat, lng } = LOCALIZACAO.coordenadas;
  return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
}

/** Link para abrir no Google Maps ou na app de navegação. */
export function urlMapa(): string {
  const { lat, lng } = LOCALIZACAO.coordenadas;
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
