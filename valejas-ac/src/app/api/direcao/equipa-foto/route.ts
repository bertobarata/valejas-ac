/**
 * API — FOTOGRAFIA DA EQUIPA (Área da Direção)
 * ─────────────────────────────────────────────────────────────────
 *   GET  → a fotografia atual (ou nada)
 *   POST → { fotoAssetId } liga uma fotografia já carregada;
 *          { fotoAssetId: "" } tira-a e o topo volta a mostrar o emblema
 *
 * A fotografia é carregada primeiro em /api/direcao/plantel/fotografia,
 * que devolve a referência. Documento único: `_id: "fotoEquipa"`.
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { sessaoValida, COOKIE_SESSAO } from "@/lib/auth-direcao";
import { sanityClientLive, isSanityConfigured } from "@/sanity/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ID = "fotoEquipa";
const autorizado = () => sessaoValida(cookies().get(COOKIE_SESSAO)?.value);
const podeEscrever = () => isSanityConfigured() && Boolean(process.env.SANITY_API_TOKEN);

const SEM_SESSAO = { ok: false, erro: "Sessão expirada." };
const SEM_CMS = {
  ok: false,
  erro: "O CMS ainda não está ligado. Falta configurar o Sanity no servidor.",
};

export async function GET() {
  if (!autorizado()) return NextResponse.json(SEM_SESSAO, { status: 401 });
  if (!podeEscrever()) return NextResponse.json(SEM_CMS, { status: 503 });

  try {
    const doc = await sanityClientLive.fetch(
      `*[_id == $id][0]{
        "fotoAssetId": fotografia.asset._ref,
        "fotoUrl": fotografia.asset->url
      }`,
      { id: ID }
    );
    return NextResponse.json({ ok: true, fotoAssetId: doc?.fotoAssetId ?? "", fotoUrl: doc?.fotoUrl ?? "" });
  } catch (err) {
    console.error("Erro a ler fotografia da equipa:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, erro: "Não foi possível ler a fotografia." }, { status: 502 });
  }
}

export async function POST(req: Request) {
  if (!autorizado()) return NextResponse.json(SEM_SESSAO, { status: 401 });
  if (!podeEscrever()) return NextResponse.json(SEM_CMS, { status: 503 });

  const b = await req.json().catch(() => null);
  if (!b || typeof b.fotoAssetId !== "string") {
    return NextResponse.json({ ok: false, erro: "Pedido inválido." }, { status: 400 });
  }

  const fotoAssetId = b.fotoAssetId.trim();
  if (fotoAssetId && !/^image-[a-f0-9]{40}-\d+x\d+-[a-z0-9]+$/.test(fotoAssetId)) {
    return NextResponse.json({ ok: false, erro: "Fotografia inválida." }, { status: 400 });
  }

  try {
    if (fotoAssetId) {
      await sanityClientLive.createOrReplace({
        _id: ID,
        _type: "fotoEquipa",
        fotografia: { _type: "image", asset: { _type: "reference", _ref: fotoAssetId } },
      });
    } else {
      await sanityClientLive.createIfNotExists({ _id: ID, _type: "fotoEquipa" });
      await sanityClientLive.patch(ID).unset(["fotografia"]).commit();
    }
    revalidatePath("/equipas");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro a guardar fotografia da equipa:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, erro: "Não foi possível guardar." }, { status: 502 });
  }
}
