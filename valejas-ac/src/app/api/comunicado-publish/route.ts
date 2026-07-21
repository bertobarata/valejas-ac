import { NextResponse } from "next/server";
import {
  postToFacebook,
  postToInstagram,
  isDryRun,
  type Comunicado,
  type CanalResultado,
} from "@/lib/social/meta";

// Precisa de runtime Node (fetch server-side + secrets). Não corre em edge estático.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook: chamado pelo Sanity quando um `comunicado` é publicado.
 * Faz fan-out para os canais escolhidos e devolve o resultado por canal.
 *
 * Segurança: se SANITY_WEBHOOK_SECRET estiver definido, exige
 *   Authorization: Bearer <secret>
 * (Configura o header no webhook em manage.sanity.io → API → Webhooks.)
 * Em modo demo sem secret, aceita para permitir demonstração.
 *
 * TODO(produção): substituir o bearer simples por verificação da
 * assinatura HMAC do Sanity (`@sanity/webhook` isValidSignature) e
 * escrever o estado de volta no documento via SANITY_API_TOKEN.
 */
export async function POST(req: Request) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
    }
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ erro: "Body inválido (JSON esperado)" }, { status: 400 });
  }

  const titulo = String(payload.titulo ?? "");
  if (!titulo) {
    return NextResponse.json({ erro: "Falta 'titulo'" }, { status: 400 });
  }

  const canais: string[] = Array.isArray(payload.canais)
    ? (payload.canais as string[])
    : ["site"];

  const siteBase = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const slug =
    typeof payload.slug === "object" && payload.slug
      ? String((payload.slug as { current?: string }).current ?? "")
      : String(payload.slug ?? "");

  const comunicado: Comunicado = {
    titulo,
    legenda: String(payload.resumoRedes ?? titulo),
    imagemUrl: payload.imagemUrl ? String(payload.imagemUrl) : undefined,
    urlSite: slug && siteBase ? `${siteBase}/comunicados/${slug}` : undefined,
  };

  const resultados: CanalResultado[] = [];
  if (canais.includes("facebook")) resultados.push(await postToFacebook(comunicado));
  if (canais.includes("instagram")) resultados.push(await postToInstagram(comunicado));

  return NextResponse.json({
    ok: true,
    dryRun: isDryRun(),
    comunicado: titulo,
    canais,
    resultados,
  });
}

// GET simples para health-check / demo no browser.
export async function GET() {
  return NextResponse.json({
    servico: "comunicado-publish",
    dryRun: isDryRun(),
    nota: isDryRun()
      ? "Modo demonstração — sem credenciais Meta, nada é publicado a sério."
      : "Credenciais Meta detetadas — publicações são reais.",
  });
}
