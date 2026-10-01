import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Lingua } from "@/i18n/routing";
import { paraPagina } from "@/lib/seo/metadados";
import HeroSection from "@/components/home/HeroSection";
import ComunicadoDestaque from "@/components/home/ComunicadoDestaque";
import ProximoJogoHome from "@/components/home/ProximoJogoHome";
import ModalidadesGrid from "@/components/home/ModalidadesGrid";
import MoteBanner from "@/components/home/MoteBanner";
import ConhecerClube from "@/components/home/ConhecerClube";

/*
 * O próximo jogo e o comunicado em destaque vêm do CMS. Refaz-se de
 * minuto a minuto. Sem isto a página ficava tal como saiu
 * do último deploy: o que se mudava no Studio nunca chegava ao site.
 */
export const revalidate = 60;

/*
 * A inicial não leva o «| Valejas AC» do modelo do layout: o título já
 * começa pelo nome do clube. Por isso o título é absoluto, e a
 * pré-visualização usa a descrição curta, como sempre usou.
 */
export async function generateMetadata(
  { params: { locale } }: { params: { locale: Lingua } }
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "inicio.meta" });
  const base = paraPagina("/", { title: t("titulo"), description: t("descricao") }, locale);
  return {
    ...base,
    title: { absolute: t("titulo") },
    openGraph: { ...base.openGraph, title: t("titulo"), description: t("descricaoPartilha") },
  };
}

export default function HomePage({ params: { locale } }: { params: { locale: Lingua } }) {
  setRequestLocale(locale);

  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* O PRODUCT.md define sucesso como ver o último comunicado e o
          próximo jogo em segundos. É por isso que vêm antes de tudo. */}
      <ComunicadoDestaque />
      <ProximoJogoHome />

      {/* Modalidades */}
      <ModalidadesGrid />

      {/* Mote do clube */}
      <MoteBanner />

      {/* Onde ir a seguir, para quem quer conhecer o clube por dentro */}
      <ConhecerClube />

    </>
  );
}
