/**
 * API — ESTADO DA VALEJAS TV
 * ─────────────────────────────────────────────────────────────────
 * Responde se o canal do clube está em direto e para onde levar.
 * O botão TV da barra pergunta aqui ao abrir a página.
 *
 *   { "live": true,  "url": "https://www.youtube.com/watch?v=…" }
 *   { "live": false, "url": "https://youtube.com/@valejastv" }
 *
 * A resposta fica em cache 2 minutos: um direto que começa aparece
 * no site no máximo 2 minutos depois.
 * ─────────────────────────────────────────────────────────────────
 */

import { estadoTV } from "@/lib/tv";

export const revalidate = 120;

export async function GET() {
  return Response.json(await estadoTV(), {
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60" },
  });
}
