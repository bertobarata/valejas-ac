import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { paraPagina } from "@/lib/seo/metadados";
import type { Lingua } from "@/i18n/routing";
import EmblemHero from "@/components/clube/EmblemHero";
import EagleSection from "@/components/clube/EagleSection";
import ColorsBento from "@/components/clube/ColorsBento";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Lingua };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "clube.emblema.meta" });
  return paraPagina("/clube/emblema", { title: t("titulo"), description: t("descricao") }, locale);
}

export default function EmblemaPage({ params: { locale } }: { params: { locale: Lingua } }) {
  setRequestLocale(locale);

  return (
    <>
      <EmblemHero />
      <EagleSection />
      <ColorsBento />
    </>
  );
}
