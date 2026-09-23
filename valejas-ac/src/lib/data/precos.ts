/**
 * CAMADA DE DADOS — VALORES DA ÉPOCA
 * ─────────────────────────────────────────────────────────────────
 * Fonte: comunicado da Direção de 01/09/2026, «Valores de Inscrições,
 * Mensalidades e Equipamentos de treino», época 2026/2027.
 *
 * O comunicado saiu em papel para atletas e encarregados de educação.
 * Estes são os mesmos números, para quem chega pelo site e ainda não
 * tem o papel na mão.
 *
 * ⚠️ Por confirmar com a Direção antes de ir a produção: o comunicado
 * é de setembro e os valores podem ter mudado. Ver PRECOS_CONFIRMADOS.
 *
 * A quota de sócio vive em @/lib/data/quota — é o mesmo 1€/mês, e não
 * se escreve duas vezes.
 * ─────────────────────────────────────────────────────────────────
 */

import { QUOTA_MENSAL } from "@/lib/data/quota";

/**
 * A Direção ainda não reviu estes valores no site. Enquanto for
 * `false`, as páginas mostram o aviso de que se confirmam na secretaria.
 */
export const PRECOS_CONFIRMADOS = false;

/** Época a que os valores dizem respeito. */
export const EPOCA = "2026/2027";

/** Desconto por cada irmão, aplicado à inscrição e à mensalidade. */
export const DESCONTO_IRMAOS = 5;

export interface ValorEpoca {
  id:         string;
  nome:       string;
  valor:      number;
  /** "por época", "por mês" — o que aparece a seguir ao número. */
  periodo:    string;
  /** O que está incluído, quando o comunicado o diz. */
  inclui?:    string[];
  /** Tem o desconto de irmãos. */
  desconto?:  boolean;
  nota?:      string;
}

export const INSCRICOES: ValorEpoca[] = [
  {
    id: "inscricao",
    nome: "Inscrição",
    valor: 60,
    periodo: "por época",
    inclui: [
      "Inscrição no clube",
      "Inscrição na AF Lisboa",
      "Seguro desportivo",
      "Cartão de sócio",
    ],
    desconto: true,
  },
  {
    id: "reinscricao",
    nome: "Reinscrição",
    valor: 55,
    periodo: "por época",
    inclui: [
      "Inscrição no clube",
      "Inscrição na AF Lisboa",
      "Seguro desportivo",
    ],
    desconto: true,
    nota: "Para quem já jogou no clube na época anterior.",
  },
  {
    id: "exame-medico",
    nome: "Exame médico",
    valor: 15,
    periodo: "uma vez",
    nota: "Obrigatório para treinar e competir. Pode ser feito no médico de família, e nesse caso não se paga ao clube.",
  },
  {
    id: "quota",
    nome: "Quota de sócio",
    valor: QUOTA_MENSAL,
    periodo: "por mês",
    nota: "Obrigatória, e já incluída na inscrição e na reinscrição.",
  },
];

export const MENSALIDADES: ValorEpoca[] = [
  {
    id: "mensalidade-formacao",
    nome: "Petizes a juvenis",
    valor: 30,
    periodo: "por mês",
    desconto: true,
  },
  {
    id: "mensalidade-juniores",
    nome: "Juniores",
    valor: 20,
    periodo: "por mês",
    desconto: true,
  },
];

/** Valor a pagar já com o desconto de irmãos aplicado. */
export function comDescontoIrmaos(valor: number): number {
  return Math.max(0, valor - DESCONTO_IRMAOS);
}

/**
 * O que custa pôr um atleta a jogar no primeiro ano: inscrição mais a
 * primeira mensalidade. Sem o kit, que se compra na loja, e sem o exame
 * médico, que muitas famílias fazem pelo médico de família.
 */
export function custoDeEntrada(mensalidade: number): number {
  const inscricao = INSCRICOES.find((v) => v.id === "inscricao")?.valor ?? 0;
  return inscricao + mensalidade;
}
