/**
 * API — REFERÊNCIA MULTIBANCO
 * Gera entidade + referência válidas 24 horas.
 * O pagamento é confirmado depois, por callback do gateway.
 */

import { NextResponse } from "next/server";
import { gerarReferenciaMB, referenciaConfigurada, gerarOrderId } from "@/lib/pagamentos/ifthenpay";
import { totalAPagar, getPeriodicidade, type Periodicidade } from "@/lib/data/quota";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!referenciaConfigurada()) {
    return NextResponse.json(
      { ok: false, erro: "Referência Multibanco ainda não está ativa." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const periodicidade = String(body.periodicidade ?? "") as Periodicidade;
    const periodo = getPeriodicidade(periodicidade);
    if (!periodo) {
      return NextResponse.json({ ok: false, erro: "Periodicidade inválida." }, { status: 400 });
    }

    const orderId = gerarOrderId();
    const ref = await gerarReferenciaMB(
      orderId,
      totalAPagar(periodicidade, "referencia"),
      `Quota Valejas AC - ${periodo.nome}`
    );

    return NextResponse.json({ ok: true, orderId, ...ref });
  } catch (err) {
    console.error("Erro na referência MB:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, erro: "Não foi possível gerar a referência." },
      { status: 502 }
    );
  }
}
