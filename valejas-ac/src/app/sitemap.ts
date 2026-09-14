import type { MetadataRoute } from "next";
import { MODALIDADES } from "@/lib/data/modalidades";

/**
 * MAPA DO SITE
 * ─────────────────────────────────────────────────────────────────
 * Só o que é público. A área da Direção e o Studio ficam de fora —
 * já estão marcados com `robots: noindex`, e não faz sentido
 * anunciá-los ao Google por outra porta.
 *
 * As prioridades não são um pedido ao Google, são uma declaração de
 * importância relativa: o que o clube quer que apareça primeiro.
 * ─────────────────────────────────────────────────────────────────
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://valejasac.pt";
  const agora = new Date();

  const paginas: { rota: string; prioridade: number; frequencia: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
    { rota: "",                              prioridade: 1.0,  frequencia: "weekly" },
    { rota: "/jogos",                        prioridade: 0.9,  frequencia: "weekly" },
    { rota: "/comunicados",                  prioridade: 0.9,  frequencia: "weekly" },
    { rota: "/inscricoes",                   prioridade: 0.9,  frequencia: "monthly" },
    { rota: "/socios/inscricao",             prioridade: 0.8,  frequencia: "monthly" },
    { rota: "/modalidades",                  prioridade: 0.8,  frequencia: "monthly" },
    { rota: "/loja",                         prioridade: 0.8,  frequencia: "weekly" },
    { rota: "/clube",                        prioridade: 0.7,  frequencia: "yearly" },
    { rota: "/equipas",                      prioridade: 0.7,  frequencia: "monthly" },
    { rota: "/academia-senior",              prioridade: 0.7,  frequencia: "monthly" },
    { rota: "/socios-contacto",              prioridade: 0.7,  frequencia: "monthly" },
    { rota: "/contactos",                    prioridade: 0.7,  frequencia: "yearly" },
    { rota: "/clube/emblema",                prioridade: 0.5,  frequencia: "yearly" },
    { rota: "/instalacoes",                  prioridade: 0.5,  frequencia: "yearly" },
    { rota: "/orgaos-sociais",               prioridade: 0.5,  frequencia: "yearly" },
    { rota: "/patrocinadores",               prioridade: 0.5,  frequencia: "yearly" },
    { rota: "/inscricoes/direitos-de-imagem", prioridade: 0.4, frequencia: "yearly" },
    { rota: "/loja/condicoes",               prioridade: 0.4,  frequencia: "yearly" },
    { rota: "/privacidade",                  prioridade: 0.3,  frequencia: "yearly" },
    { rota: "/termos",                       prioridade: 0.3,  frequencia: "yearly" },
    { rota: "/cookies",                      prioridade: 0.3,  frequencia: "yearly" },
  ];

  return [
    ...paginas.map(({ rota, prioridade, frequencia }) => ({
      url: `${base}${rota}`,
      lastModified: agora,
      changeFrequency: frequencia,
      priority: prioridade,
    })),
    // As modalidades são âncoras da mesma página, mas é por elas que se
    // procura: "karate Barcarena", "judo Valejas".
    ...MODALIDADES.map((m) => ({
      url: `${base}/modalidades#${m.slug}`,
      lastModified: agora,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
