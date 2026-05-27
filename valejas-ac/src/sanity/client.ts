import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-01-01";

/**
 * Verifica se o Sanity está configurado (variáveis de ambiente presentes).
 * Quando não está configurado, as funções de fetch devolvem [] ou undefined
 * e o site usa os dados mock em @/lib/data/*.
 */
export function isSanityConfigured(): boolean {
  return Boolean(projectId);
}

export const sanityClient = createClient({
  projectId: projectId ?? "unconfigured",
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  // Apenas para mutações server-side (ex: formulários de sócios)
  token: process.env.SANITY_API_TOKEN,
});

/**
 * Cliente sem CDN — para dados ultra-frescos (ex: resultado ao vivo).
 */
export const sanityClientLive = createClient({
  projectId: projectId ?? "unconfigured",
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
