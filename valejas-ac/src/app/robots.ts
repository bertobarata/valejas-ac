import type { MetadataRoute } from "next";

/**
 * O que os motores de busca podem ver.
 *
 * A área da Direção e o Studio ficam de fora — não por segredo, que
 * ambos pedem palavra-passe, mas porque não há nada lá para quem
 * procura o clube.
 */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://valejasac.pt";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/direcao", "/studio", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
