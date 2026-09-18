/**
 * API — PLANTEL (Área da Direção)
 * ─────────────────────────────────────────────────────────────────
 *   GET    → todos os jogadores
 *   POST   → cria ou atualiza um jogador
 *   DELETE → apaga um jogador
 *
 * Mesma sessão e mesmas regras da gestão de jogos.
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sessaoValida, COOKIE_SESSAO } from "@/lib/auth-direcao";
import { sanityClientLive, isSanityConfigured } from "@/sanity/client";
import { EQUIPAS, ORDEM_POSICOES } from "@/lib/data/plantel";

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
        "O CMS ainda não está ligado. Sem ele não há onde guardar o plantel — " +
        "falta configurar o Sanity no servidor.",
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
    const jogadores = await sanityClientLive.fetch(
      `*[_type == "jogador"] | order(equipa asc, numero asc){
        _id, nome, numero, posicao, equipa, capitao, ativo,
        "fotoAssetId": fotografia.asset._ref,
        "fotoUrl": fotografia.asset->url
      }`
    );
    return NextResponse.json({ ok: true, jogadores });
  } catch (err) {
    console.error("Erro a ler plantel:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, erro: "Não foi possível ler o plantel." },
      { status: 502 }
    );
  }
}

export async function POST(req: Request) {
  if (!autorizado()) {
    return NextResponse.json({ ok: false, erro: "Sessão expirada." }, { status: 401 });
  }
  if (!podeEscrever()) return semCMS();

  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ ok: false, erro: "Pedido inválido." }, { status: 400 });

  const nome    = String(b.nome ?? "").trim();
  const numero  = Math.floor(Number(b.numero));
  const posicao = String(b.posicao ?? "").trim();
  const equipa  = String(b.equipa ?? "").trim();

  const erros: string[] = [];
  if (!nome)                                  erros.push("Falta o nome.");
  if (!Number.isFinite(numero) || numero < 1 || numero > 99) {
    erros.push("Número de camisola inválido (1 a 99).");
  }
  if (!(ORDEM_POSICOES as string[]).includes(posicao)) erros.push("Posição inválida.");
  if (!EQUIPAS.some((e) => e.id === equipa))           erros.push("Equipa inválida.");
  if (erros.length) {
    return NextResponse.json({ ok: false, erro: erros.join(" ") }, { status: 400 });
  }

  /*
   * A fotografia chega já carregada, como referência devolvida por
   * /api/direcao/plantel/fotografia. O formato é fixo e verificado aqui
   * — sem isto, o corpo do pedido podia apontar o campo a qualquer
   * documento do dataset.
   *
   * Três casos distintos, e a diferença importa:
   *   ausente      → não se mexe na fotografia que lá está
   *   string vazia → apaga-se a fotografia
   *   referência   → substitui-se
   */
  const fotoCru = b.fotoAssetId;
  const mexeNaFoto = fotoCru !== undefined && fotoCru !== null;
  const fotoAssetId = mexeNaFoto ? String(fotoCru).trim() : "";
  if (fotoAssetId && !/^image-[a-f0-9]{40}-\d+x\d+-[a-z0-9]+$/.test(fotoAssetId)) {
    return NextResponse.json(
      { ok: false, erro: "Fotografia inválida." },
      { status: 400 }
    );
  }

  const doc = {
    _type: "jogador",
    nome,
    numero,
    posicao,
    equipa,
    capitao: Boolean(b.capitao),
    ativo:   b.ativo === undefined ? true : Boolean(b.ativo),
    ...(fotoAssetId
      ? {
          fotografia: {
            _type: "image",
            asset: { _type: "reference", _ref: fotoAssetId },
          },
        }
      : {}),
  };

  try {
    // Um capitão por equipa: ao marcar um, os outros deixam de o ser.
    if (doc.capitao) {
      const outros: { _id: string }[] = await sanityClientLive.fetch(
        `*[_type == "jogador" && equipa == $equipa && capitao == true]{ _id }`,
        { equipa }
      );
      await Promise.all(
        outros
          .filter((o) => o._id !== b._id)
          .map((o) => sanityClientLive.patch(o._id).set({ capitao: false }).commit())
      );
    }

    let resultado;
    if (b._id) {
      const patch = sanityClientLive.patch(String(b._id)).set(doc);
      // Tirar a fotografia é apagar o campo, não gravá-lo vazio: um
      // campo de imagem vazio continua a contar como imagem partida.
      resultado = await (mexeNaFoto && !fotoAssetId
        ? patch.unset(["fotografia"])
        : patch
      ).commit();
    } else {
      resultado = await sanityClientLive.create(doc);
    }
    return NextResponse.json({ ok: true, id: resultado._id });
  } catch (err) {
    console.error("Erro a guardar jogador:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, erro: "Não foi possível guardar o jogador." },
      { status: 502 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!autorizado()) {
    return NextResponse.json({ ok: false, erro: "Sessão expirada." }, { status: 401 });
  }
  if (!podeEscrever()) return semCMS();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, erro: "Falta o jogador." }, { status: 400 });

  try {
    await sanityClientLive.delete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro a apagar jogador:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, erro: "Não foi possível apagar o jogador." },
      { status: 502 }
    );
  }
}
