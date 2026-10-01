import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { paraPagina } from "@/lib/seo/metadados";
import type { Lingua } from "@/i18n/routing";
import ContactoSection from "@/components/socios/ContactoSection";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Lingua };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "contactos.meta" });
  return paraPagina("/contactos", { title: t("titulo"), description: t("descricao") }, locale);
}

export default function ContactosPage({ params: { locale } }: { params: { locale: Lingua } }) {
  setRequestLocale(locale);
  const t = useTranslations("contactos.hero");

  return (
    <>
      {/* Hero band — clears fixed navbar */}
      <section className="section-dark relative bg-blue-deep pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
        {/* Diagonal red sash — crest motif */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "linear-gradient(135deg, transparent 45%, #D4150C 45%, #D4150C 48%, transparent 48%)",
          }}
          aria-hidden
        />
        <div className="section-container relative z-10">
          <p className="font-body font-semibold text-xs uppercase tracking-[0.35em] text-yellow mb-4">
            {t("etiqueta")}
          </p>
          <h1 className="font-headline font-black text-6xl md:text-8xl uppercase leading-none tracking-tighter text-white">
            {t("titulo")}
          </h1>
          <p className="font-body text-lg text-white/80 max-w-xl leading-relaxed mt-6">
            {t("texto")}
          </p>
        </div>
      </section>

      <ContactoSection /></>
  );
}
