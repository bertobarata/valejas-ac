/**
 * API — LIMPEZA DAS ENCOMENDAS
 * ─────────────────────────────────────────────────────────────────
 * Apaga as encomendas que passaram do prazo de conservação — um ano.
 *
 * Quem chama isto é o cron da Vercel, uma vez por dia (ver `vercel.json`).
 * Não é para ser aberta por ninguém a partir do site.
 *
 * O RGPD não deixa guardar dados pessoais por guardar: tem de haver um
 * prazo, e alguém tem de o cumprir. Um clube não tem quem se lembre de
 * apagar encomendas de 2027, por isso apaga-se sozinho.
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { apagarEncomendasAntigas, bdConfigurada } from "@/lib/db/encomendas";
import { PRAZO_CONSERVACAO_DIAS } from "@/lib/data/encomendas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * A Vercel envia `Authorization: Bearer $CRON_SECRET` quando a variável
 * existe. Comparação em tempo constante — a mesma regra do resto do site.
 */
function doCron(req: Request): boolean {
  const segredo = process.env.CRON_SECRET;
  if (!segredo) return false;

  const enviado = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(enviado);
  const b = Buffer.from(segredo);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(req: Request) {
  if (!doCron(req)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!bdConfigurada()) {
    return NextResponse.json({ ok: true, apagadas: 0, nota: "Sem base de dados." });
  }

  try {
    const apagadas = await apagarEncomendasAntigas();
    if (apagadas > 0) {
      console.log(`Limpeza: ${apagadas} encomenda(s) com mais de ${PRAZO_CONSERVACAO_DIAS} dias apagada(s).`);
    }
    return NextResponse.json({ ok: true, apagadas, prazoDias: PRAZO_CONSERVACAO_DIAS });
  } catch (err) {
    console.error("Limpeza de encomendas falhou:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, erro: "Limpeza falhou." }, { status: 502 });
  }
}
