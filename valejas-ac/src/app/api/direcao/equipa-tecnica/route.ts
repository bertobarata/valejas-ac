/**
 * API — EQUIPA TÉCNICA (Área da Direção)
 * ─────────────────────────────────────────────────────────────────
 *   GET    → toda a equipa técnica (incluindo quem está desligado)
 *   POST   → cria ou atualiza um membro
 *   DELETE → apaga um membro (?id=...)
 *
 * Mesma sessão e mesmas regras da gestão do plantel. A fotografia
 * chega já carregada, como referência devolvida por
 * /api/direcao/plantel/fotografia.
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { sessaoValida, COOKIE_SESSAO } from "@/lib/auth-direcao";
import { sanityClientLive, isSanityConfigured } from "@/sanity/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    const membros = await sanityClientLive.fetch(
      `*[_type == "membroTecnico"] | order(ordem asc, nome asc){
        _id, nome, cargo, ordem, ativo,
        "fotoAssetId": fotografia.asset._ref,
        "fotoUrl": fotografia.asset->url
      }`
    );
    return NextResponse.json({ ok: true, membros });
  } catch (err) {
    console.error("Erro a ler equipa técnica:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, erro: "Não foi possível ler a equipa técnica." }, { status: 502 });
  }
}

export async function POST(req: Request) {
  if (!autorizado()) return NextResponse.json(SEM_SESSAO, { status: 401 });
  if (!podeEscrever()) return NextResponse.json(SEM_CMS, { status: 503 });

  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ ok: false, erro: "Pedido inválido." }, { status: 400 });

  const nome  = String(b.nome ?? "").trim().slice(0, 80);
  const cargo = String(b.cargo ?? "").trim().slice(0, 80);
  const ordemN = Number(b.ordem);
  const ordem = Number.isFinite(ordemN) ? Math.max(0, Math.min(999, Math.floor(ordemN))) : 10;

  const erros: string[] = [];
  if (!nome)  erros.push("Falta o nome.");
  if (!cargo) erros.push("Falta o cargo.");
  if (erros.length) {
    return NextResponse.json({ ok: false, erro: erros.join(" ") }, { status: 400 });
  }

  // Três casos, como no plantel: ausente = não mexe; "" = apaga; referência = substitui.
  const fotoCru = b.fotoAssetId;
  const mexeNaFoto = fotoCru !== undefined && fotoCru !== null;
  const fotoAssetId = mexeNaFoto ? String(fotoCru).trim() : "";
  if (fotoAssetId && !/^image-[a-f0-9]{40}-\d+x\d+-[a-z0-9]+$/.test(fotoAssetId)) {
    return NextResponse.json({ ok: false, erro: "Fotografia inválida." }, { status: 400 });
  }

  const doc = {
    _type: "membroTecnico",
    nome,
    cargo,
    ordem,
    ativo: b.ativo === undefined ? true : Boolean(b.ativo),
    ...(fotoAssetId
      ? { fotografia: { _type: "image", asset: { _type: "reference", _ref: fotoAssetId } } }
      : {}),
  };

  try {
    let resultado;
    if (b._id) {
      const id = String(b._id);
      // Só se edita o que é equipa técnica: este endpoint não serve para
      // reescrever jogadores ou comunicados por engano.
      const existe = await sanityClientLive.fetch(
        `count(*[_type == "membroTecnico" && _id == $id])`,
        { id }
      );
      if (!existe) {
        return NextResponse.json({ ok: false, erro: "Membro não encontrado." }, { status: 404 });
      }
      const patch = sanityClientLive.patch(id).set(doc);
      resultado = await (mexeNaFoto && !fotoAssetId ? patch.unset(["fotografia"]) : patch).commit();
    } else {
      resultado = await sanityClientLive.create(doc);
    }
    revalidatePath("/equipas");
    return NextResponse.json({ ok: true, id: resultado._id });
  } catch (err) {
    console.error("Erro a guardar membro técnico:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, erro: "Não foi possível guardar." }, { status: 502 });
  }
}

export async function DELETE(req: Request) {
  if (!autorizado()) return NextResponse.json(SEM_SESSAO, { status: 401 });
  if (!podeEscrever()) return NextResponse.json(SEM_CMS, { status: 503 });

  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!/^[A-Za-z0-9_-]{4,64}$/.test(id)) {
    return NextResponse.json({ ok: false, erro: "Identificador inválido." }, { status: 400 });
  }

  try {
    const apagados = await sanityClientLive.delete({
      query: `*[_type == "membroTecnico" && _id == $id]`,
      params: { id },
    });
    if (!apagados?.documentIds?.length) {
      return NextResponse.json({ ok: false, erro: "Membro não encontrado." }, { status: 404 });
    }
    revalidatePath("/equipas");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro a apagar membro técnico:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, erro: "Não foi possível apagar." }, { status: 502 });
  }
}
