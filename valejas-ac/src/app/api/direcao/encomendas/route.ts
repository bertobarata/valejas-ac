/**
 * API — ENCOMENDAS (Área da Direção)
 * ─────────────────────────────────────────────────────────────────
 *   GET   → lista as encomendas, mais recentes primeiro
 *   PATCH → muda estado, marca pagamento, escreve nota interna
 *
 * Só se altera o que o clube decide: estado, pago, notasInternas. As
 * peças, os preços e quem encomendou ficam como chegaram — se estiver
 * errado, cancela-se e faz-se outra, não se reescreve a história.
 *
 * Os dados vêm da base de dados do clube, não do CMS: uma encomenda
 * leva nome, email e telemóvel, e isso não pode viver num sítio que
 * qualquer pessoa leia.
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sessaoValida, COOKIE_SESSAO } from "@/lib/auth-direcao";
import {
  atualizarEncomenda, bdConfigurada, listarEncomendas, type Alteracoes,
} from "@/lib/db/encomendas";
import { ESTADOS, type EstadoEncomenda } from "@/lib/data/encomendas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function autorizado(): boolean {
  return sessaoValida(cookies().get(COOKIE_SESSAO)?.value);
}

function semBaseDeDados() {
  return NextResponse.json(
    {
      ok: false,
      erro:
        "A base de dados ainda não está ligada. As encomendas continuam a " +
        "chegar por email, mas só com a `DATABASE_URL` configurada é que " +
        "se acompanham aqui.",
    },
    { status: 503 }
  );
}

export async function GET() {
  if (!autorizado()) {
    return NextResponse.json({ ok: false, erro: "Sessão expirada." }, { status: 401 });
  }
  if (!bdConfigurada()) return semBaseDeDados();

  try {
    return NextResponse.json({ ok: true, encomendas: await listarEncomendas() });
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
  if (!bdConfigurada()) return semBaseDeDados();

  const b = await req.json().catch(() => null);
  const id = String(b?.id ?? "").trim();
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ ok: false, erro: "Falta a encomenda." }, { status: 400 });
  }

  const alteracoes: Alteracoes = {};

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
    const encontrada = await atualizarEncomenda(id, alteracoes);
    if (!encontrada) {
      return NextResponse.json({ ok: false, erro: "Encomenda não encontrada." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro a guardar encomenda:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, erro: "Não foi possível guardar a alteração." },
      { status: 502 }
    );
  }
}
