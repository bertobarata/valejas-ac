import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { paraPagina } from "@/lib/seo/metadados";
import type { Lingua } from "@/i18n/routing";
import SociosHero from "@/components/socios/SociosHero";
import QuotaSocio from "@/components/socios/QuotaSocio";

export async function generateMetadata(
  { params: { locale } }: { params: { locale: Lingua } }
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "socios.meta.contacto" });
  return paraPagina("/socios-contacto", { title: t("titulo"), description: t("descricao") }, locale);
}

export default function SociosPage({ params: { locale } }: { params: { locale: Lingua } }) {
  setRequestLocale(locale);
  return (
    <>
      <SociosHero />
      <QuotaSocio />
    </>
  );
}
