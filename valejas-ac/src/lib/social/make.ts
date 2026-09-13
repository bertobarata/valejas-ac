/**
 * FAN-OUT PARA REDES VIA MAKE.COM
 * ─────────────────────────────────────────────────────────────────
 * O Make já tem aprovação da Meta para publicar em Páginas de
 * Facebook e contas de Instagram Business. Em vez de o clube passar
 * pela app review da Meta e por chaves que expiram de 60 em 60 dias,
 * o site manda o comunicado ao Make e o Make publica.
 *
 * Configuração (.env.local + Vercel):
 *   MAKE_WEBHOOK_URL=https://hook.eu2.make.com/xxxxxxxxxxxx
 *   MAKE_WEBHOOK_SEGREDO=<string aleatória>   (opcional mas recomendado)
 *
 * O segredo vai no cabeçalho X-Valejas-Segredo. No cenário do Make,
 * um filtro logo a seguir ao webhook descarta tudo o que não traga o
 * valor certo — sem isso, quem descobrir o URL publica no nome do clube.
 *
 * Limitação honesta: o Make responde "recebido", não "publicado". A
 * publicação acontece nos segundos seguintes, dentro do cenário. Se
 * o Facebook recusar, isso aparece no histórico do Make, não aqui.
 * ─────────────────────────────────────────────────────────────────
 */

import type { CanalResultado, Comunicado } from "./meta";

export function makeConfigurado(): boolean {
  return Boolean(process.env.MAKE_WEBHOOK_URL);
}

export async function publicarViaMake(
  c: Comunicado,
  canais: string[]
): Promise<CanalResultado[]> {
  const url = process.env.MAKE_WEBHOOK_URL;
  const alvos = canais.filter((x) => x === "facebook" || x === "instagram") as
    ("facebook" | "instagram")[];

  if (alvos.length === 0) return [];

  if (!url) {
    return alvos.map((canal) => ({
      canal,
      ok: true,
      dryRun: true,
      detalhe: `[DEMONSTRAÇÃO] Enviaria para ${canal} através do Make.`,
    }));
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.MAKE_WEBHOOK_SEGREDO
          ? { "X-Valejas-Segredo": process.env.MAKE_WEBHOOK_SEGREDO }
          : {}),
      },
      body: JSON.stringify({
        titulo:    c.titulo,
        legenda:   c.urlSite ? `${c.legenda}\n\n${c.urlSite}` : c.legenda,
        imagemUrl: c.imagemUrl,
        urlSite:   c.urlSite,
        facebook:  alvos.includes("facebook"),
        instagram: alvos.includes("instagram"),
      }),
    });

    if (!res.ok) {
      const detalhe = `O Make recusou o pedido (${res.status}).`;
      return alvos.map((canal) => ({ canal, ok: false, dryRun: false, detalhe }));
    }

    return alvos.map((canal) => ({
      canal,
      ok: true,
      dryRun: false,
      detalhe: "Enviado para publicação. Aparece na rede dentro de instantes.",
    }));
  } catch (e) {
    const detalhe = e instanceof Error ? e.message : "Falha ao contactar o Make.";
    return alvos.map((canal) => ({ canal, ok: false, dryRun: false, detalhe }));
  }
}
