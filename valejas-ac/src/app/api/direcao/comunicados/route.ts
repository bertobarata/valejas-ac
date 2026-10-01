/**
 * API — COMUNICADOS PUBLICADOS
 * ─────────────────────────────────────────────────────────────────
 * Usada pela área da Direção para ver e apagar comunicados.
 * Protegida pela mesma sessão do resto da área.
 *
 *   GET    → comunicados guardados no site, mais recentes primeiro
 *   DELETE → apaga um comunicado do site (?id=...)
 *
 * Apagar aqui NÃO apaga das redes: o Make só publica, não remove.
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { quemEsta, COOKIE_SESSAO } from "@/lib/auth-direcao";
import { enviarEmail } from "@/lib/email";
import { EMAILS } from "@/lib/data/socios";
import { sanityClientLive, isSanityConfigured } from "@/sanity/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function podeEscrever(): boolean {
  return isSanityConfigured() && Boolean(process.env.SANITY_API_TOKEN);
}

const SEM_SESSAO = { ok: false, erro: "Sessão expirada. Entra outra vez." };
const SEM_CMS = {
  ok: false,
  erro: "O CMS ainda não está ligado. Falta configurar o Sanity no servidor.",
};

export async function GET() {
  if (!quemEsta(cookies().get(COOKIE_SESSAO)?.value)) {
    return NextResponse.json(SEM_SESSAO, { status: 401 });
  }
  if (!podeEscrever()) return NextResponse.json(SEM_CMS, { status: 503 });

  try {
    const comunicados = await sanityClientLive.fetch(
      `*[_type == "comunicado"] | order(data desc) {
        _id, titulo, data, canais, "slug": slug.current
      }`
    );
    return NextResponse.json({ ok: true, comunicados });
  } catch (err) {
    console.error("Erro a ler comunicados:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, erro: "Não foi possível ler os comunicados." }, { status: 502 });
  }
}

export async function DELETE(req: Request) {
  const quem = quemEsta(cookies().get(COOKIE_SESSAO)?.value);
  if (!quem) return NextResponse.json(SEM_SESSAO, { status: 401 });
  if (!podeEscrever()) return NextResponse.json(SEM_CMS, { status: 503 });

  const id = new URL(req.url).searchParams.get("id") ?? "";
  // Os ids do Sanity são alfanuméricos com hífen; nada mais passa para a query.
  if (!/^[A-Za-z0-9_-]{4,64}$/.test(id)) {
    return NextResponse.json({ ok: false, erro: "Identificador inválido." }, { status: 400 });
  }

  try {
    // Só apaga documentos do tipo comunicado — este endpoint não serve
    // para apagar jogos, plantel ou encomendas por engano.
    const comunicado: { titulo?: string; slug?: string } | null =
      await sanityClientLive.fetch(
        `*[_type == "comunicado" && _id == $id][0]{ titulo, "slug": slug.current }`,
        { id }
      );
    if (!comunicado) {
      return NextResponse.json({ ok: false, erro: "Comunicado não encontrado." }, { status: 404 });
    }

    // Apaga também um eventual rascunho com o mesmo id.
    await sanityClientLive
      .transaction()
      .delete(id)
      .delete(`drafts.${id}`)
      .commit();

    revalidatePath("/comunicados");
    revalidatePath("/");
    revalidatePath("/sitemap.xml");
    if (comunicado.slug) revalidatePath(`/comunicados/${comunicado.slug}`);

    // Registo para a comunicação, como na publicação. Falhar aqui não
    // desfaz o que já foi apagado.
    try {
      await enviarEmail({
        para: EMAILS.comunicacao,
        assunto: `Comunicado apagado — ${comunicado.titulo ?? id}`,
        texto: [
          "COMUNICADO APAGADO DO SITE",
          "",
          `Título : ${comunicado.titulo ?? "(sem título)"}`,
          `Por    : ${quem}`,
          `Quando : ${new Intl.DateTimeFormat("pt-PT", {
            dateStyle: "full", timeStyle: "short", timeZone: "Europe/Lisbon",
          }).format(new Date())}`,
          "",
          "Atenção: as publicações no Facebook e no Instagram, se existirem,",
          "continuam lá. Apagam-se à mão em cada rede.",
        ].join("\n"),
      });
    } catch (err) {
      console.error("Aviso de comunicado apagado falhou:", err instanceof Error ? err.message : err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro a apagar comunicado:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, erro: "Não foi possível apagar." }, { status: 502 });
  }
}
