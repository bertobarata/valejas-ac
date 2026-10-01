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

/** Depois do número: "por época", "por mês", "uma vez". */
export type PeriodoValor = "porEpoca" | "porMes" | "umaVez";

/** O que a inscrição cobre, quando o comunicado o diz. */
export type InclusaoValor =
  | "inscricaoClube" | "inscricaoAfLisboa" | "seguroDesportivo" | "cartaoSocio";

/**
 * O texto de cada valor (nome, período, o que inclui, nota) está em
 * messages/<lingua>/inscricoes.json → valores.*, pela `chave`.
 */
export interface ValorEpoca {
  id:         string;
  /** Chave em valores.itens.<chave>. */
  chave:      string;
  valor:      number;
  periodo:    PeriodoValor;
  inclui?:    InclusaoValor[];
  /** Tem o desconto de irmãos. */
  desconto?:  boolean;
  /** Tem nota por baixo (valores.itens.<chave>.nota). */
  nota?:      boolean;
}

export const INSCRICOES: ValorEpoca[] = [
  {
    id: "inscricao",
    chave: "inscricao",
    valor: 60,
    periodo: "porEpoca",
    inclui: ["inscricaoClube", "inscricaoAfLisboa", "seguroDesportivo", "cartaoSocio"],
    desconto: true,
  },
  {
    id: "reinscricao",
    chave: "reinscricao",
    valor: 55,
    periodo: "porEpoca",
    inclui: ["inscricaoClube", "inscricaoAfLisboa", "seguroDesportivo"],
    desconto: true,
    nota: true,   // para quem já jogou no clube na época anterior
  },
  {
    id: "exame-medico",
    chave: "exameMedico",
    valor: 15,
    periodo: "umaVez",
    nota: true,   // pode ser feito no médico de família
  },
  {
    id: "quota",
    chave: "quota",
    valor: QUOTA_MENSAL,
    periodo: "porMes",
    nota: true,   // obrigatória, já incluída na inscrição
  },
];

export const MENSALIDADES: ValorEpoca[] = [
  {
    id: "mensalidade-formacao",
    chave: "mensalidadeFormacao",   // petizes a juvenis
    valor: 30,
    periodo: "porMes",
    desconto: true,
  },
  {
    id: "mensalidade-juniores",
    chave: "mensalidadeJuniores",
    valor: 20,
    periodo: "porMes",
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
