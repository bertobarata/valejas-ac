import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { paraPagina } from "@/lib/seo/metadados";
import { Link } from "@/i18n/navigation";
import type { Lingua } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import PropostaSocioForm from "@/components/socios/PropostaSocioForm";
import { QUOTA_MENSAL, formatEuros } from "@/lib/data/quota";

export async function generateMetadata(
  { params: { locale } }: { params: { locale: Lingua } }
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "socios.meta.inscricao" });
  return paraPagina(
    "/socios/inscricao",
    {
      title: t("titulo"),
      description: t("descricao", { quota: formatEuros(QUOTA_MENSAL, locale) }),
    },
    locale,
  );
}

export default function InscricaoPage({ params: { locale } }: { params: { locale: Lingua } }) {
  setRequestLocale(locale);
  const t = useTranslations("socios.inscricao");
  const lingua = useLocale();

  return (
    <div className="bg-surface min-h-screen">
      {/* Cabeçalho */}
      <header className="bg-surface-low border-b border-on-surface/10 bg-texture">
        <div className="section-container py-14 md:py-20">
          <Link
            href="/socios-contacto"
            className="inline-flex items-center gap-2 min-h-11 font-body text-xs uppercase tracking-widest text-on-surface-muted hover:text-yellow transition-colors mb-6"
          >
            <ArrowLeft size={14} /> {t("voltar")}
          </Link>

          <p className="font-body text-xs font-semibold uppercase tracking-[0.35em] text-yellow">
            Valejas Atlético Clube
          </p>
          <h1 className="font-headline font-black text-5xl md:text-7xl uppercase leading-none tracking-tighter text-on-surface mt-3">
            {t.rich("titulo", { destaque: (c) => <span className="text-yellow">{c}</span> })}
          </h1>
          <p className="font-body text-base md:text-lg text-on-surface-muted mt-5 max-w-xl leading-relaxed">
            {t("texto", { quota: formatEuros(QUOTA_MENSAL, lingua) })}
          </p>
        </div>
      </header>

      {/* Formulário */}
      <div className="section-container py-14 md:py-20">
        <div className="max-w-3xl">
          <PropostaSocioForm />
        </div>
      </div>
    </div>
  );
}
