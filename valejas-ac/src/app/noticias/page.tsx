import type { Metadata } from "next";
import Link from "next/link";
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

  // Sem notícias, o site diz que não há. Não inventa.
  if (!destaque) {
    return (
      <>
        <section className="bg-surface-low bg-texture border-b border-on-surface/10">
          <div className="section-container py-20 md:py-28">
            <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
              Vida do clube
            </p>
            <h1 className="section-title text-4xl md:text-6xl">
              Notícias do <span>Valejas</span>
            </h1>
            <p className="font-body text-lg text-on-surface-muted mt-5 max-w-xl leading-relaxed">
              Ainda não há notícias publicadas. Entretanto, os comunicados
              oficiais da Direção estão sempre em dia.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/comunicados" className="btn-primary text-sm">
                Ver comunicados
              </Link>
              <Link href="/jogos" className="btn-ghost text-sm">
                Jogos e classificação
              </Link>
            </div>
          </div>
        </section></>
    );
  }

  return (
    <>
      <NoticiasHero artigo={destaque} />
      <NoticiasGrid  artigos={artigos.filter((a) => !a.destaque)} /></>
  );
}
