import type { Metadata } from "next";
import NoticiasHero from "@/components/noticias/NoticiasHero";
import NoticiasGrid from "@/components/noticias/NoticiasGrid";
import { fetchArtigos, fetchArtigoDestaque } from "@/sanity/queries";
import { ARTIGOS, getArtigoDestaque } from "@/lib/data/noticias";

// ISR: notícias frescas sem rebuild manual (Vercel)
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Notícias & Comunicados",
  description:
    "Resultados, transferências, comunicados e histórias do Valejas Atlético Clube.",
};

export default async function NoticiasPage() {
  // Tenta Sanity — se não estiver configurado, usa dados mock
  const [artigosSanity, destaqueSanity] = await Promise.all([
    fetchArtigos(),
    fetchArtigoDestaque(),
  ]);

  const artigos  = artigosSanity  ?? ARTIGOS;
  const destaque = destaqueSanity ?? getArtigoDestaque() ?? artigos[0];

  return (
    <>
      <NoticiasHero artigo={destaque} />
      <NoticiasGrid  artigos={artigos.filter((a) => !a.destaque)} />
    </>
  );
}
