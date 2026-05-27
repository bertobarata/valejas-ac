import createImageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const imageBuilder = createImageUrlBuilder(sanityClient);

/**
 * Gera URLs optimizadas para imagens do Sanity.
 *
 * Uso: urlFor(imagem).width(800).auto("format").url()
 */
export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source);
}
