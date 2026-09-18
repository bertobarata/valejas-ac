/**
 * IMAGENS DO SANITY
 * ─────────────────────────────────────────────────────────────────
 * O Sanity guarda o ficheiro original e serve recortes à medida pelo
 * seu CDN — não se guardam cinco tamanhos de cada fotografia.
 *
 * O enquadramento não é escolhido aqui. Cada imagem tem um *hotspot*
 * — o ponto que tem de ficar visível, arrastado no Studio por quem
 * carrega a fotografia. Um retrato de 4000×6000 cortado a 3:4 perde
 * metade da altura; o hotspot é o que garante que a metade perdida
 * não é a cabeça.
 *
 * Este módulo só corre no servidor: as páginas resolvem os endereços
 * antes de entregar os dados aos componentes de cliente, para o
 * construtor de imagens não ir parar ao JavaScript que o telemóvel
 * descarrega.
 * ─────────────────────────────────────────────────────────────────
 */

import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/** Forma mínima de uma imagem vinda do GROQ, com o recorte que o Studio guardou. */
export interface ImagemSanity {
  asset?: { _ref?: string; _id?: string };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

const builder = projectId
  ? imageUrlBuilder({ projectId, dataset })
  : null;

/**
 * Endereço de uma imagem no CDN do Sanity, recortada à medida pedida.
 *
 * Devolve `undefined` — e não um endereço partido — quando o Sanity
 * não está configurado ou o campo está vazio. Quem chama decide o que
 * mostrar em vez da fotografia.
 */
export function urlDaImagem(
  imagem: ImagemSanity | undefined | null,
  opcoes: { largura: number; altura: number; qualidade?: number }
): string | undefined {
  if (!builder || !imagem?.asset?._ref) return undefined;
  return builder
    .image(imagem as SanityImageSource)
    .width(opcoes.largura)
    .height(opcoes.altura)
    .fit("crop")
    // Sem isto o recorte ignora o hotspot e corta pelo centro.
    .crop("focalpoint")
    .auto("format")
    .quality(opcoes.qualidade ?? 80)
    .url();
}
