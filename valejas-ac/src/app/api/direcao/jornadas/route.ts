/**
 * API — RESULTADOS POR JORNADA (Área da Direção)
 * ─────────────────────────────────────────────────────────────────
 *   GET  → resultados lançados + a base da classificação
 *   POST → { jornada, jogos: [{ casa, fora, golosCasa, golosFora }] }
 *          substitui os resultados dessa jornada
 *   DELETE (?jornada=N) → apaga os resultados dessa jornada
 *
 * A classificação não se guarda calculada: recalcula-se a partir da
 * base e destes resultados (src/lib/classificacao.ts). Assim, corrigir
 * um resultado corrige a tabela, sem segunda gravação.
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { sessaoValida, COOKIE_SESSAO } from "@/lib/auth-direcao";
import { sanityClientLive, isSanityConfigured } from "@/sanity/client";
import { CLUBES_DA_PROVA } from "@/lib/data/jogos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const autorizado = () => sessaoValida(cookies().get(COOKIE_SESSAO)?.value);
const podeEscrever = () => isSanityConfigured() && Boolean(process.env.SANITY_API_TOKEN);

const SEM_SESSAO = { ok: false, erro: "Sessão expirada." };
const SEM_CMS = {
  ok: false,
  erro: "O CMS ainda não está ligado. Falta configurar o Sanity no servidor.",
};

const idDe = (jornada: number, i: number) =>
  `resultado.j${String(jornada).padStart(2, "0")}.${i}`;

function atualizarPaginas() {
  revalidatePath("/jogos");
  revalidatePath("/");
}

export async function GET() {
  if (!autorizado()) return NextResponse.json(SEM_SESSAO, { status: 401 });
  if (!podeEscrever()) return NextResponse.json(SEM_CMS, { status: 503 });

  try {
    const [resultados, base] = await Promise.all([
      sanityClientLive.fetch(
        `*[_type == "resultadoJornada"] | order(jornada asc, _id asc){
          jornada, casa, fora, golosCasa, golosFora
        }`
      ),
      sanityClientLive.fetch(`*[_id == "classificacao"][0]{ linhas, ateJornada }`),
    ]);
    return NextResponse.json({
      ok: true,
      resultados,
      linhas: base?.linhas ?? [],
      ateJornada: Number(base?.ateJornada ?? 0),
    });
  } catch (err) {
    console.error("Erro a ler jornadas:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, erro: "Não foi possível ler os resultados." }, { status: 502 });
  }
}

export async function POST(req: Request) {
  if (!autorizado()) return NextResponse.json(SEM_SESSAO, { status: 401 });
  if (!podeEscrever()) return NextResponse.json(SEM_CMS, { status: 503 });

  const b = await req.json().catch(() => null);
  const jornada = Math.floor(Number(b?.jornada));
  if (!Number.isFinite(jornada) || jornada < 1 || jornada > 30) {
    return NextResponse.json({ ok: false, erro: "Jornada inválida (1 a 30)." }, { status: 400 });
  }
  if (!Array.isArray(b?.jogos) || b.jogos.length > 8) {
    return NextResponse.json({ ok: false, erro: "No máximo oito jogos por jornada." }, { status: 400 });
  }

  const clubes = new Set<string>(CLUBES_DA_PROVA);
  const usados = new Set<string>();
  const jogos: { casa: string; fora: string; golosCasa: number; golosFora: number }[] = [];

  for (const j of b.jogos as Record<string, unknown>[]) {
    const casa = String(j.casa ?? "");
    const fora = String(j.fora ?? "");
    const gc = Number(j.golosCasa);
    const gf = Number(j.golosFora);

    if (!clubes.has(casa) || !clubes.has(fora)) {
      return NextResponse.json({ ok: false, erro: "Equipa desconhecida num dos jogos." }, { status: 400 });
    }
    if (casa === fora) {
      return NextResponse.json({ ok: false, erro: `${casa} não pode jogar contra si própria.` }, { status: 400 });
    }
    if (usados.has(casa) || usados.has(fora)) {
      return NextResponse.json(
        { ok: false, erro: `${usados.has(casa) ? casa : fora} aparece em dois jogos da mesma jornada.` },
        { status: 400 }
      );
    }
    if (![gc, gf].every((n) => Number.isInteger(n) && n >= 0 && n <= 99)) {
      return NextResponse.json({ ok: false, erro: `Golos inválidos em ${casa} – ${fora}.` }, { status: 400 });
    }
    usados.add(casa); usados.add(fora);
    jogos.push({ casa, fora, golosCasa: gc, golosFora: gf });
  }

  try {
    const tx = sanityClientLive.transaction();
    const ids = jogos.map((_, i) => idDe(jornada, i));
    jogos.forEach((j, i) =>
      tx.createOrReplace({ _id: ids[i], _type: "resultadoJornada", jornada, ...j })
    );
    // Quem saiu da lista (jogo apagado no formulário) sai também do CMS.
    const antigos: string[] = await sanityClientLive.fetch(
      `*[_type == "resultadoJornada" && jornada == $j]._id`, { j: jornada }
    );
    antigos.filter((id) => !ids.includes(id)).forEach((id) => tx.delete(id));
    await tx.commit();

    atualizarPaginas();
    return NextResponse.json({ ok: true, guardados: jogos.length });
  } catch (err) {
    console.error("Erro a guardar jornada:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, erro: "Não foi possível guardar a jornada." }, { status: 502 });
  }
}

export async function DELETE(req: Request) {
  if (!autorizado()) return NextResponse.json(SEM_SESSAO, { status: 401 });
  if (!podeEscrever()) return NextResponse.json(SEM_CMS, { status: 503 });

  const jornada = Math.floor(Number(new URL(req.url).searchParams.get("jornada")));
  if (!Number.isFinite(jornada) || jornada < 1 || jornada > 30) {
    return NextResponse.json({ ok: false, erro: "Jornada inválida." }, { status: 400 });
  }

  try {
    await sanityClientLive.delete({
      query: `*[_type == "resultadoJornada" && jornada == $j]`,
      params: { j: jornada },
    });
    atualizarPaginas();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro a apagar jornada:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, erro: "Não foi possível apagar a jornada." }, { status: 502 });
  }
}
