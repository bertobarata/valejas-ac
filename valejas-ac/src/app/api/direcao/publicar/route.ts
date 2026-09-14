/**
 * API — PUBLICAR COMUNICADO
 * ─────────────────────────────────────────────────────────────────
 * O Presidente escreve o texto e carrega em publicar. Aqui:
 *   1. guarda o comunicado no site (Sanity)
 *   2. monta o URL do cartão com o emblema
 *   3. envia para Facebook e Instagram
 *
 * Devolve o resultado canal a canal, para a página dizer ao
 * Presidente o que correu bem e o que não correu.
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { quemEsta, COOKIE_SESSAO } from "@/lib/auth-direcao";
import { enviarEmail } from "@/lib/email";
import { EMAILS } from "@/lib/data/socios";
import { sanityClient, isSanityConfigured } from "@/sanity/client";
import {
  postToFacebook, postToInstagram, isDryRun, type CanalResultado,
} from "@/lib/social/meta";
import { publicarViaMake, makeConfigurado } from "@/lib/social/make";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Título → slug limpo para o URL do site. */
function criarSlug(titulo: string): string {
  return titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Garante que o endereço não colide com um comunicado anterior.
 * Há assembleias geriais todos os anos — o segundo passa a
 * "assembleia-geral-ordinaria-2", o terceiro a "-3", e assim por diante.
 */
async function slugUnico(base: string): Promise<string> {
  if (!isSanityConfigured() || !process.env.SANITY_API_TOKEN) return base;

  try {
    const usados: string[] = await sanityClient.fetch(
      `*[_type == "comunicado" && defined(slug.current)].slug.current`
    );
    if (!usados.includes(base)) return base;

    let n = 2;
    while (usados.includes(`${base}-${n}`)) n++;
    return `${base}-${n}`;
  } catch (err) {
    // Se não conseguirmos consultar, é preferível um endereço feio a
    // dois comunicados a lutar pelo mesmo.
    console.error("Não foi possível verificar slugs:", err instanceof Error ? err.message : err);
    return `${base}-${Date.now().toString(36).slice(-4)}`;
  }
}

export async function POST(req: Request) {
  // Quem publicou fica no registo que vai para a comunicação.
  const quem = quemEsta(cookies().get(COOKIE_SESSAO)?.value);
  if (!quem) {
    return NextResponse.json({ ok: false, erro: "Sessão expirada. Entra outra vez." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, erro: "Pedido inválido." }, { status: 400 });
  }

  const titulo = String(body.titulo ?? "").trim();
  const texto  = String(body.texto ?? "").trim();
  const canais: string[] = Array.isArray(body.canais) ? body.canais : [];

  if (titulo.length < 5) {
    return NextResponse.json({ ok: false, erro: "O título é demasiado curto." }, { status: 400 });
  }
  if (texto.length < 20) {
    return NextResponse.json({ ok: false, erro: "O texto do comunicado é demasiado curto." }, { status: 400 });
  }

  const slug = await slugUnico(criarSlug(titulo));
  const data = new Date().toISOString();
  const paragrafos = texto.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const urlSite = `${base}/comunicados/${slug}`;

  // Cartão com o emblema — leva só o título. O texto do comunicado
  // vai na legenda da publicação, não dentro da imagem.
  const imagemUrl =
    `${base}/api/comunicado-imagem` +
    `?titulo=${encodeURIComponent(titulo)}` +
    `&data=${encodeURIComponent(data)}`;

  const avisos: string[] = [];

  // ── 1. Guardar no site ──
  if (isSanityConfigured() && process.env.SANITY_API_TOKEN) {
    try {
      await sanityClient.create({
        _type: "comunicado",
        titulo,
        slug: { _type: "slug", current: slug },
        data,
        autor: "A Direção",
        corpo: paragrafos.map((p) => ({
          _type: "block",
          style: "normal",
          children: [{ _type: "span", text: p }],
        })),
        resumoRedes: paragrafos[0]?.slice(0, 2200) ?? titulo,
        canais: ["site", ...canais],
        publicado: true,
      });
    } catch (err) {
      console.error("Falha ao guardar comunicado:", err instanceof Error ? err.message : err);
      avisos.push("O comunicado não ficou guardado no site. As redes podem ter recebido.");
    }
  } else {
    avisos.push("Sem CMS configurado — o comunicado não fica guardado no site.");
  }

  // ── 2. Redes sociais ──
  // A legenda repete o título, porque a imagem já não traz o texto:
  // quem lê a publicação tem de ver as duas coisas.
  const comunicado = {
    titulo,
    legenda: `${titulo}\n\n${paragrafos.join("\n\n")}`.slice(0, 2200),
    imagemUrl,
    urlSite,
  };

  // O Make é o caminho escolhido pelo clube. As chamadas diretas à
  // Meta ficam como alternativa, para o dia em que o clube tenha app
  // própria e queira largar o intermediário.
  let resultados: CanalResultado[] = [];
  if (makeConfigurado()) {
    resultados = await publicarViaMake(comunicado, canais);
  } else {
    if (canais.includes("facebook"))  resultados.push(await postToFacebook(comunicado));
    if (canais.includes("instagram")) resultados.push(await postToInstagram(comunicado));
  }

  /*
   * Cópia para a comunicação.
   *
   * O departamento fica com o registo do que saiu, quando saiu e por
   * onde — sem depender de alguém se lembrar de o dizer. Falhar aqui
   * não invalida a publicação: o comunicado já está no site e nas
   * redes quando isto corre.
   */
  try {
    const canalLegivel = canais.length
      ? canais.map((c) => (c === "facebook" ? "Facebook" : "Instagram")).join(" e ")
      : "só no site";
    await enviarEmail({
      para: EMAILS.comunicacao,
      assunto: `Comunicado publicado — ${titulo}`,
      texto: [
        "COMUNICADO PUBLICADO",
        "",
        `Título : ${titulo}`,
        `Saiu em: site${canais.length ? `, ${canalLegivel}` : ""}`,
        `Por    : ${quem ?? "Direção"}`,
        `Quando : ${new Intl.DateTimeFormat("pt-PT", {
          dateStyle: "full", timeStyle: "short", timeZone: "Europe/Lisbon",
        }).format(new Date())}`,
        "",
        urlSite ? `No site: ${urlSite}` : "",
        "",
        "─────────────────────────────────────────────",
        "",
        paragrafos.join("\n\n"),
      ].filter(Boolean).join("\n"),
    });
  } catch (err) {
    console.error("Cópia para a comunicação falhou:", err instanceof Error ? err.message : err);
  }

  return NextResponse.json({
    ok: true,
    dryRun: makeConfigurado() ? false : isDryRun(),
    slug,
    urlSite,
    imagemUrl,
    resultados,
    avisos,
  });
}
