/**
 * API — CALLBACK DO GATEWAY
 * ─────────────────────────────────────────────────────────────────
 * A Ifthenpay chama este endereço quando uma referência é paga.
 * Como o site não tem base de dados, a única coisa que fazemos é
 * avisar o clube por email de que o dinheiro entrou — o Presidente
 * cruza com a ficha que já recebeu.
 *
 * Configuração:
 *   IFTHENPAY_CALLBACK_CHAVE=<segredo combinado com a Ifthenpay>
 * O URL a registar no backoffice da Ifthenpay é:
 *   https://<dominio>/api/pagamento/callback?chave=<segredo>
 *     &orderId=[ORDER_ID]&amount=[AMOUNT]&requestId=[REQUEST_ID]
 *     &payment_datetime=[PAYMENT_DATETIME]
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { enviarEmail, emailDoClube, emailPara } from "@/lib/email";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const segredo = process.env.IFTHENPAY_CALLBACK_CHAVE;

  // Sem segredo configurado o endereço fica fechado — qualquer um
  // podia forjar confirmações de pagamento.
  if (!segredo || params.get("chave") !== segredo) {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  const orderId   = params.get("orderId")   ?? "(sem referência)";
  const valor     = params.get("amount")    ?? "(desconhecido)";
  const quando    = params.get("payment_datetime") ?? new Date().toISOString();
  const requestId = params.get("requestId") ?? "";

  try {
    await enviarEmail({
      para:    emailPara("pagamentos") || "log@localhost",
      assunto: `Quota paga — ${orderId}`,
      texto: [
        "PAGAMENTO DE QUOTA RECEBIDO",
        "",
        `Identificador : ${orderId}`,
        `Valor         : ${valor} €`,
        `Data          : ${quando}`,
        requestId ? `Request ID    : ${requestId}` : "",
        "",
        "Cruzar com a ficha de sócio recebida com o mesmo identificador",
        "e emitir o número de sócio no Softgab.",
      ].filter(Boolean).join("\n"),
    });
  } catch (err) {
    console.error("Callback: falha ao avisar o clube:", err instanceof Error ? err.message : err);
    // Responder OK na mesma: se falharmos, a Ifthenpay repete o callback.
  }

  // A Ifthenpay espera exatamente este corpo.
  return new NextResponse("OK", { status: 200 });
}
