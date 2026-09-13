/**
 * API — ENCOMENDAS (Área da Direção)
 * ─────────────────────────────────────────────────────────────────
 *   GET   → lista as encomendas, mais recentes primeiro
 *   PATCH → muda estado, marca pagamento, escreve nota interna
 *
 * Só se altera o que o clube decide: estado, pago, notasInternas. As
 * peças, os preços e quem encomendou ficam como chegaram — se estiver
 * errado, cancela-se e faz-se outra, não se reescreve a história.
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sessaoValida, COOKIE_SESSAO } from "@/lib/auth-direcao";
import { sanityClientLive, isSanityConfigured } from "@/sanity/client";
import { ESTADOS, type EstadoEncomenda } from "@/lib/data/encomendas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function autorizado(): boolean {
  return sessaoValida(cookies().get(COOKIE_SESSAO)?.value);
}

function podeEscrever(): boolean {
  return isSanityConfigured() && Boolean(process.env.SANITY_API_TOKEN);
}

function semCMS() {
  return NextResponse.json(
    {
      ok: false,
      erro:
        "O CMS ainda não está ligado. As encomendas continuam a chegar por " +
        "email, mas só com o Sanity configurado é que se acompanham aqui.",
    },
    { status: 503 }
  );
}

export async function GET() {
  if (!autorizado()) {
    return NextResponse.json({ ok: false, erro: "Sessão expirada." }, { status: 401 });
  }
  if (!podeEscrever()) return semCMS();

  try {
    const encomendas = await sanityClientLive.fetch(
      `*[_type == "encomenda"] | order(data desc)[0...200]{
        _id, numero, data, nome, email, telemovel, socio, atleta, notas,
        notasInternas, total, aPagarAgora, momento, estado, pago,
        linhas[]{ slug, nome, tamanho, quantidade, preco, emStock, personalizacao }
      }`
    );
    return NextResponse.json({ ok: true, encomendas });
  } catch (err) {
    console.error("Erro a ler encomendas:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, erro: "Não foi possível ler as encomendas." },
      { status: 502 }
    );
  }
}

export async function PATCH(req: Request) {
  if (!autorizado()) {
    return NextResponse.json({ ok: false, erro: "Sessão expirada." }, { status: 401 });
  }
  if (!podeEscrever()) return semCMS();

  const b = await req.json().catch(() => null);
  const id = String(b?._id ?? "").trim();
  if (!id) return NextResponse.json({ ok: false, erro: "Falta a encomenda." }, { status: 400 });

  const alteracoes: Record<string, unknown> = {};

  if (b.estado !== undefined) {
    const estado = String(b.estado) as EstadoEncomenda;
    if (!ESTADOS.some((e) => e.id === estado)) {
      return NextResponse.json({ ok: false, erro: "Estado inválido." }, { status: 400 });
    }
    alteracoes.estado = estado;
  }
  if (b.pago !== undefined)          alteracoes.pago = Boolean(b.pago);
  if (b.notasInternas !== undefined) alteracoes.notasInternas = String(b.notasInternas).slice(0, 1000);

  if (Object.keys(alteracoes).length === 0) {
    return NextResponse.json({ ok: false, erro: "Nada para alterar." }, { status: 400 });
  }

  try {
    await sanityClientLive.patch(id).set(alteracoes).commit();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro a guardar encomenda:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, erro: "Não foi possível guardar a alteração." },
      { status: 502 }
    );
  }
}
