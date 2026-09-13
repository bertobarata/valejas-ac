/**
 * API — GESTÃO DE JOGOS E CLASSIFICAÇÃO
 * ─────────────────────────────────────────────────────────────────
 * Usada pelo departamento de comunicação em /direcao/jogos.
 * Tudo protegido pela mesma sessão da área da Direção.
 *
 *   GET    → jogos + classificação guardados
 *   POST   → cria ou atualiza um jogo
 *   PUT    → substitui a classificação inteira
 *   DELETE → apaga um jogo
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sessaoValida, COOKIE_SESSAO } from "@/lib/auth-direcao";
import { sanityClientLive, isSanityConfigured } from "@/sanity/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ID_CLASSIFICACAO = "classificacao";

function autorizado(): boolean {
  return sessaoValida(cookies().get(COOKIE_SESSAO)?.value);
}

function semCMS() {
  return NextResponse.json(
    {
      ok: false,
      erro:
        "O CMS ainda não está ligado. Sem ele não há onde guardar os jogos — " +
        "falta configurar o Sanity no servidor.",
    },
    { status: 503 }
  );
}

function podeEscrever(): boolean {
  return isSanityConfigured() && Boolean(process.env.SANITY_API_TOKEN);
}

export async function GET() {
  if (!autorizado()) {
    return NextResponse.json({ ok: false, erro: "Sessão expirada." }, { status: 401 });
  }
  if (!podeEscrever()) return semCMS();

  try {
    const [jogos, classificacao] = await Promise.all([
      sanityClientLive.fetch(
        `*[_type == "jogo"] | order(data desc){
          _id, adversario, data, local, competicao, ehEmCasa,
          jogado, golosNossos, golosAdversario
        }`
      ),
      sanityClientLive.fetch(`*[_id == $id][0]{ competicao, atualizadoEm, linhas }`, {
        id: ID_CLASSIFICACAO,
      }),
    ]);
    return NextResponse.json({ ok: true, jogos, classificacao });
  } catch (err) {
    console.error("Erro a ler jogos:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, erro: "Não foi possível ler os dados." }, { status: 502 });
  }
}

export async function POST(req: Request) {
  if (!autorizado()) {
    return NextResponse.json({ ok: false, erro: "Sessão expirada." }, { status: 401 });
  }
  if (!podeEscrever()) return semCMS();

  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ ok: false, erro: "Pedido inválido." }, { status: 400 });

  const adversario = String(b.adversario ?? "").trim();
  const data       = String(b.data ?? "").trim();

  if (!adversario) {
    return NextResponse.json({ ok: false, erro: "Falta o adversário." }, { status: 400 });
  }
  if (Number.isNaN(new Date(data).getTime())) {
    return NextResponse.json({ ok: false, erro: "Data inválida." }, { status: 400 });
  }

  const jogado = Boolean(b.jogado);
  const doc = {
    _type: "jogo",
    adversario,
    data: new Date(data).toISOString(),
    local:      String(b.local ?? "").trim(),
    competicao: String(b.competicao ?? "Campeonato Distrital"),
    ehEmCasa:   Boolean(b.ehEmCasa),
    jogado,
    // Só faz sentido guardar golos de jogos já disputados.
    golosNossos:     jogado ? Number(b.golosNossos ?? 0) : undefined,
    golosAdversario: jogado ? Number(b.golosAdversario ?? 0) : undefined,
  };

  try {
    const resultado = b._id
      ? await sanityClientLive.patch(String(b._id)).set(doc).commit()
      : await sanityClientLive.create(doc);
    return NextResponse.json({ ok: true, id: resultado._id });
  } catch (err) {
    console.error("Erro a guardar jogo:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, erro: "Não foi possível guardar o jogo." }, { status: 502 });
  }
}

export async function PUT(req: Request) {
  if (!autorizado()) {
    return NextResponse.json({ ok: false, erro: "Sessão expirada." }, { status: 401 });
  }
  if (!podeEscrever()) return semCMS();

  const b = await req.json().catch(() => null);
  if (!b || !Array.isArray(b.linhas)) {
    return NextResponse.json({ ok: false, erro: "Classificação inválida." }, { status: 400 });
  }

  const linhas = b.linhas.map((l: Record<string, unknown>, i: number) => ({
    _key: `l${i}`,
    _type: "linha",
    posicao:       Number(l.posicao ?? i + 1),
    equipa:        String(l.equipa ?? "").trim(),
    jogos:         Number(l.jogos ?? 0),
    vitorias:      Number(l.vitorias ?? 0),
    empates:       Number(l.empates ?? 0),
    derrotas:      Number(l.derrotas ?? 0),
    golosMarcados: Number(l.golosMarcados ?? 0),
    golosSofridos: Number(l.golosSofridos ?? 0),
    pontos:        Number(l.pontos ?? 0),
  })).filter((l: { equipa: string }) => l.equipa.length > 0);

  try {
    await sanityClientLive.createOrReplace({
      _id: ID_CLASSIFICACAO,
      _type: "classificacao",
      competicao: String(b.competicao ?? "Distrital AF Lisboa"),
      atualizadoEm: new Date().toISOString(),
      linhas,
    });
    return NextResponse.json({ ok: true, total: linhas.length });
  } catch (err) {
    console.error("Erro a guardar classificação:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, erro: "Não foi possível guardar a classificação." },
      { status: 502 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!autorizado()) {
    return NextResponse.json({ ok: false, erro: "Sessão expirada." }, { status: 401 });
  }
  if (!podeEscrever()) return semCMS();

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, erro: "Falta o id." }, { status: 400 });

  try {
    await sanityClientLive.delete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro a apagar jogo:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, erro: "Não foi possível apagar." }, { status: 502 });
  }
}
