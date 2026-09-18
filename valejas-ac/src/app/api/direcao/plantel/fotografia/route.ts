/**
 * API — FOTOGRAFIA DE JOGADOR (Área da Direção)
 * ─────────────────────────────────────────────────────────────────
 *   POST (multipart/form-data, campo `ficheiro`) → carrega a imagem
 *   para o Sanity e devolve a referência do recurso.
 *
 * A referência devolvida não fica ligada a ninguém: é o POST do
 * plantel que a grava no jogador. Assim o formulário pode carregar a
 * fotografia enquanto se escreve o resto, e um upload abandonado não
 * deixa um jogador meio criado.
 *
 * Mesma sessão e mesmas regras do resto da área da Direção.
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sessaoValida, COOKIE_SESSAO } from "@/lib/auth-direcao";
import { sanityClientLive, isSanityConfigured } from "@/sanity/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Só formatos que um browser mostra sem plugins. A lista é fechada de
 * propósito: aceitar SVG aqui seria aceitar HTML e JavaScript servidos
 * do domínio do clube.
 */
const TIPOS_ACEITES = new Set(["image/jpeg", "image/png", "image/webp"]);

/** As máquinas fotográficas do clube dão ficheiros de 7 MB; 15 dá folga. */
const TAMANHO_MAXIMO = 15 * 1024 * 1024;

export async function POST(req: Request) {
  if (!sessaoValida(cookies().get(COOKIE_SESSAO)?.value)) {
    return NextResponse.json({ ok: false, erro: "Sessão expirada." }, { status: 401 });
  }

  if (!isSanityConfigured() || !process.env.SANITY_API_TOKEN) {
    return NextResponse.json(
      {
        ok: false,
        erro:
          "O CMS ainda não está ligado. Sem ele não há onde guardar a " +
          "fotografia — falta configurar o Sanity no servidor.",
      },
      { status: 503 }
    );
  }

  let ficheiro: File | null = null;
  try {
    const dados = await req.formData();
    const campo = dados.get("ficheiro");
    if (campo instanceof File) ficheiro = campo;
  } catch {
    return NextResponse.json({ ok: false, erro: "Pedido inválido." }, { status: 400 });
  }

  if (!ficheiro) {
    return NextResponse.json({ ok: false, erro: "Falta o ficheiro." }, { status: 400 });
  }

  if (!TIPOS_ACEITES.has(ficheiro.type)) {
    return NextResponse.json(
      { ok: false, erro: "A fotografia tem de ser JPG, PNG ou WebP." },
      { status: 400 }
    );
  }

  if (ficheiro.size > TAMANHO_MAXIMO) {
    return NextResponse.json(
      {
        ok: false,
        erro: `A fotografia tem ${(ficheiro.size / 1e6).toFixed(1)} MB e o limite é 15 MB.`,
      },
      { status: 413 }
    );
  }

  try {
    const bytes = Buffer.from(await ficheiro.arrayBuffer());
    const recurso = await sanityClientLive.assets.upload("image", bytes, {
      filename: ficheiro.name,
      contentType: ficheiro.type,
    });

    return NextResponse.json({
      ok: true,
      assetId: recurso._id,
      // Pré-visualização imediata no formulário, sem esperar por gravação.
      url: recurso.url,
    });
  } catch (err) {
    console.error(
      "Erro a carregar fotografia:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json(
      { ok: false, erro: "Não foi possível carregar a fotografia." },
      { status: 502 }
    );
  }
}
