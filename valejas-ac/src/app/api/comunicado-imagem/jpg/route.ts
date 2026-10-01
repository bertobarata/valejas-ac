/**
 * API — IMAGEM DO COMUNICADO, EM JPEG
 * ─────────────────────────────────────────────────────────────────
 * O mesmo cartão de /api/comunicado-imagem, convertido para JPEG.
 *
 * Existe porque a API do Instagram só aceita JPEG — um PNG é
 * recusado e a publicação falha. O PNG continua a ser o original
 * (pré-visualização no painel, partilhas da página do comunicado).
 *
 * Uso:
 *   /api/comunicado-imagem/jpg?titulo=...&data=...
 *
 * A conversão é feita pelo sharp — a mesma biblioteca que o Next
 * usa para otimizar imagens em produção.
 * ─────────────────────────────────────────────────────────────────
 */

import sharp from "sharp";
import { GET as gerarPng } from "../route";
import { LARGURA, ALTURA } from "@/lib/social/cartao";

// O sharp é nativo (Node) — não corre em edge.
export const runtime = "nodejs";


export async function GET(req: Request) {
  const png = await gerarPng(req);
  if (!png.ok) return png;

  const jpeg = await sharp(Buffer.from(await png.arrayBuffer()))
    .resize(LARGURA, ALTURA)
    .jpeg({ quality: 90 })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      // Igual ao PNG: a Meta vai buscar esta imagem; vale a pena ficar em cache.
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
