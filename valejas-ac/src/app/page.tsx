import HeroSection, { type HeroDestaque } from "@/components/home/HeroSection";
import NewsSection from "@/components/home/NewsSection";
import ModalidadesGrid from "@/components/home/ModalidadesGrid";
import SociosCTA from "@/components/home/SociosCTA";
import { getComunicados, type Comunicado } from "@/lib/data/comunicados";
import { fetchComunicados, fetchArtigoDestaque } from "@/sanity/queries";
import { ARTIGOS, getArtigoDestaque, type Artigo } from "@/lib/data/noticias";

export default async function HomePage() {
  // Destaques mostrados já no hero: último comunicado + notícia em destaque.
  const [comunicadosSanity, artigoSanity] = await Promise.all([
    fetchComunicados() as Promise<Comunicado[] | null>,
    fetchArtigoDestaque(),
  ]);

  const comunicado = (comunicadosSanity ?? getComunicados())[0];
  const artigo = (artigoSanity as Artigo | null) ?? getArtigoDestaque() ?? ARTIGOS[0];

  const destaques: HeroDestaque[] = [];
  if (comunicado) {
    destaques.push({ tipo: "Comunicado", titulo: comunicado.titulo, href: "/comunicados" });
  }
  if (artigo) {
    destaques.push({ tipo: "Notícia", titulo: artigo.titulo, href: "/noticias" });
  }

  return (
    <>
      {/* Hero + destaques (comunicado/notícia) já visíveis sem scroll */}
      <HeroSection destaques={destaques} />

      {/* Notícias */}
      <NewsSection />

      {/* Modalidades */}
      <ModalidadesGrid />

      {/* Sócios CTA */}
      <SociosCTA />
    </>
  );
}
