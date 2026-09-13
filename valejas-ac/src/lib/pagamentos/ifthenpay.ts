/**
 * GATEWAY DE PAGAMENTO — IFTHENPAY (MB WAY)
 * ─────────────────────────────────────────────────────────────────
 * Só o MB WAY por gateway permite confirmação imediata no site: o
 * pedido chega à app do sócio, ele confirma, e nós perguntamos o
 * estado até dar pago. Referência Multibanco não serve — a
 * confirmação chega por callback, podendo demorar horas.
 *
 * Configuração (.env.local + Vercel):
 *   IFTHENPAY_MBWAY_KEY=xxx-xxxxxx
 *
 * Sem a chave, o módulo diz que não está configurado e o site cai
 * para pagamento manual (transferência), sem rebentar.
 *
 * ⚠️ Os códigos de estado abaixo seguem a documentação da Ifthenpay
 * à data da implementação. Confirmar contra a conta real do clube
 * antes de abrir ao público.
 * ─────────────────────────────────────────────────────────────────
 */

const BASE = "https://api.ifthenpay.com/spg/payment/mbway";

export type EstadoPagamento = "pendente" | "pago" | "recusado" | "expirado" | "erro";

export function gatewayConfigurado(): boolean {
  return Boolean(process.env.IFTHENPAY_MBWAY_KEY);
}

function chave(): string {
  const k = process.env.IFTHENPAY_MBWAY_KEY;
  if (!k) throw new Error("IFTHENPAY_MBWAY_KEY não definida.");
  return k;
}

export interface PedidoMBWay {
  /** Identificador do clube para esta cobrança. Máx. 15 caracteres. */
  orderId:     string;
  /** Valor em euros, com ponto decimal. */
  valor:       number;
  /** 9 dígitos, sem indicativo. */
  telemovel:   string;
  email:       string;
  descricao:   string;
}

export interface RespostaPedido {
  requestId: string;
}

/** Cria o pedido — o sócio recebe a notificação na app MB WAY. */
export async function pedirPagamentoMBWay(p: PedidoMBWay): Promise<RespostaPedido> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mbWayKey:     chave(),
      orderId:      p.orderId,
      amount:       p.valor.toFixed(2),
      mobileNumber: `351#${p.telemovel}`,
      email:        p.email,
      description:  p.descricao,
    }),
  });

  if (!res.ok) {
    throw new Error(`Gateway indisponível (${res.status}).`);
  }

  const json = await res.json();
  // "000" = pedido criado com sucesso.
  if (json?.Status !== "000" || !json?.RequestId) {
    throw new Error(json?.Message || "O gateway recusou o pedido de pagamento.");
  }
  return { requestId: String(json.RequestId) };
}

/** Pergunta ao gateway se o sócio já confirmou na app. */
export async function estadoPagamentoMBWay(requestId: string): Promise<EstadoPagamento> {
  const url = `${BASE}/status?mbWayKey=${encodeURIComponent(chave())}&requestId=${encodeURIComponent(requestId)}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) return "erro";

  const json = await res.json().catch(() => null);
  switch (json?.Status) {
    case "000": return "pago";
    case "020": return "pendente";
    case "101":
    case "122": return "recusado";
    case "102": return "expirado";
    default:    return "pendente";
  }
}

/** Identificador curto e único para a cobrança. Máx. 15 caracteres. */
export function gerarOrderId(): string {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VAC${t}${r}`.slice(0, 15);
}

/* ────────────────────────────────────────────────────────────────
 * REFERÊNCIA MULTIBANCO
 * Válida 24 horas, por decisão da Direção. Ao contrário do MB WAY,
 * o pagamento não confirma no ecrã: o sócio sai do site para pagar
 * e o gateway avisa-nos depois, por callback.
 *
 * Configuração:
 *   IFTHENPAY_MB_KEY=xxx-xxxxxx
 *   IFTHENPAY_CALLBACK_CHAVE=<segredo partilhado com a Ifthenpay>
 * ──────────────────────────────────────────────────────────────── */

const BASE_MB = "https://api.ifthenpay.com/multibanco/reference/init";

/** Horas de validade da referência. */
export const VALIDADE_REFERENCIA_HORAS = 24;

export function referenciaConfigurada(): boolean {
  return Boolean(process.env.IFTHENPAY_MB_KEY);
}

export interface ReferenciaMB {
  entidade:   string;
  referencia: string;
  valor:      number;
  /** ISO 8601 — instante em que deixa de ser paga. */
  expiraEm:   string;
}

export async function gerarReferenciaMB(
  orderId: string,
  valor: number,
  descricao: string
): Promise<ReferenciaMB> {
  const mbKey = process.env.IFTHENPAY_MB_KEY;
  if (!mbKey) throw new Error("IFTHENPAY_MB_KEY não definida.");

  const expira = new Date(Date.now() + VALIDADE_REFERENCIA_HORAS * 3600 * 1000);

  const res = await fetch(BASE_MB, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mbKey,
      orderId,
      amount:      valor.toFixed(2),
      description: descricao,
      // A referência deixa de ser paga passadas 24 horas.
      expiryDays:  1,
      expiryDate:  expira.toISOString(),
    }),
  });

  if (!res.ok) throw new Error(`Gateway indisponível (${res.status}).`);

  const json = await res.json();
  if (!json?.Entity || !json?.Reference) {
    throw new Error(json?.Message || "O gateway não devolveu referência.");
  }

  return {
    entidade:   String(json.Entity),
    referencia: String(json.Reference),
    valor,
    expiraEm:   json.ExpiryDate ? new Date(json.ExpiryDate).toISOString() : expira.toISOString(),
  };
}
