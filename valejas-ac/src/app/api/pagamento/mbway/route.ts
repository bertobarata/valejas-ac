/**
 * API — PAGAMENTO MB WAY
 * ─────────────────────────────────────────────────────────────────
 * POST  → cria o pedido; o sócio recebe notificação na app.
 * GET   → devolve o estado, para o site confirmar sozinho.
 *
 * Não guarda nada. O requestId vive no browser do sócio durante a
 * sessão de pagamento e desaparece quando a página fecha.
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import {
  pedirPagamentoMBWay, estadoPagamentoMBWay, gatewayConfigurado, gerarOrderId,
} from "@/lib/pagamentos/ifthenpay";
import { validarTelemovel, validarEmail, formatar } from "@/lib/validacao";
import { totalAPagar, getPeriodicidade, type Periodicidade } from "@/lib/data/quota";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!gatewayConfigurado()) {
    return NextResponse.json(
      { ok: false, erro: "Pagamento automático ainda não está ativo." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const telemovel = formatar.telemovel(String(body.telemovel ?? ""));
    const email = String(body.email ?? "").trim();
    const periodicidade = String(body.periodicidade ?? "") as Periodicidade;

    if (!validarTelemovel(telemovel)) {
      return NextResponse.json({ ok: false, erro: "Telemóvel inválido." }, { status: 400 });
    }
    if (!validarEmail(email)) {
      return NextResponse.json({ ok: false, erro: "Email inválido." }, { status: 400 });
    }
    const periodo = getPeriodicidade(periodicidade);
    if (!periodo) {
      return NextResponse.json({ ok: false, erro: "Periodicidade inválida." }, { status: 400 });
    }

    const orderId = gerarOrderId();
    const { requestId } = await pedirPagamentoMBWay({
      orderId,
      valor:     totalAPagar(periodicidade, "mbway"),
      telemovel,
      email,
      descricao: `Quota Valejas AC - ${periodo.nome}`,
    });

    return NextResponse.json({ ok: true, requestId, orderId });
  } catch (err) {
    console.error("Erro no pedido MB WAY:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, erro: err instanceof Error ? err.message : "Não foi possível iniciar o pagamento." },
      { status: 502 }
    );
  }
}

export async function GET(req: Request) {
  if (!gatewayConfigurado()) {
    return NextResponse.json({ ok: false, erro: "Gateway não configurado." }, { status: 503 });
  }

  const requestId = new URL(req.url).searchParams.get("requestId");
  if (!requestId) {
    return NextResponse.json({ ok: false, erro: "Falta o requestId." }, { status: 400 });
  }

  const estado = await estadoPagamentoMBWay(requestId);
  return NextResponse.json({ ok: true, estado });
}
