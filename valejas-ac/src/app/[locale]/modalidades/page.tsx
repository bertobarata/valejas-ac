import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { paraPagina } from "@/lib/seo/metadados";
import { Link } from "@/i18n/navigation";
import type { Lingua } from "@/i18n/routing";
import { GRUPOS, getModalidadesPorGrupo } from "@/lib/data/modalidades";
import ModalidadesAccordion from "@/components/modalidades/ModalidadesAccordion";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Lingua };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "modalidades.meta" });
  return paraPagina("/modalidades", { title: t("titulo"), description: t("descricao") }, locale);
}

export default function ModalidadesPage({ params: { locale } }: { params: { locale: Lingua } }) {
  setRequestLocale(locale);
  const t = useTranslations("modalidades");

  return (
    <div className="bg-surface">
      {/* Cabeçalho */}
      <section className="section-container pt-14 md:pt-16 pb-6">
        <p className="font-body text-xs font-bold uppercase tracking-widest text-blue mb-3">
          {t("pagina.etiqueta")}
        </p>
        <h1 className="font-headline font-black uppercase wdth-condensed tracking-tighter leading-none text-4xl md:text-6xl text-on-surface max-w-3xl">
          {t("pagina.titulo")}
        </h1>
        <p className="font-body text-lg text-on-surface-muted mt-4 max-w-2xl">
          {t("pagina.intro")}
        </p>

        <div className="mt-8 max-w-2xl bg-surface-high p-6">
          <p className="font-headline font-black uppercase text-sm text-on-surface">
            {t("vagas.titulo")}
          </p>
          <p className="font-body text-on-surface-muted leading-relaxed mt-1">
            {t("vagas.texto")}
          </p>
        </div>
      </section>

      {GRUPOS.map((grupo) => {
        const itens = getModalidadesPorGrupo(grupo.id);
        return (
          <section
            key={grupo.id}
            id={grupo.id}
            className="section-container py-14 md:py-16 scroll-mt-24"
          >
            <div className="border-t border-on-surface/15 pt-8 mb-10">
              <h2 className="font-headline font-black uppercase tracking-tighter leading-none text-3xl md:text-4xl text-on-surface">
                {t(`grupos.${grupo.id}.titulo`)}
              </h2>
              <p className="font-body text-on-surface-muted mt-2 max-w-2xl">
                {t(`grupos.${grupo.id}.intro`)}
              </p>
            </div>

            <ModalidadesAccordion itens={itens} />

          </section>
        );
      })}

      {/* Academia Sénior — programa comunitário, não modalidade */}
      <section className="section-container py-14 md:py-16">
        <div className="border-t border-on-surface/15 pt-8">
          <div className="bg-surface-high p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div className="max-w-xl">
              <p className="font-body text-xs font-bold uppercase tracking-widest text-yellow mb-2">
                {t("pagina.academia.etiqueta")}
              </p>
              <h2 className="font-headline font-black uppercase tracking-tight leading-none text-2xl md:text-3xl text-on-surface">
                {t("pagina.academia.titulo")}
              </h2>
              <p className="font-body text-on-surface-muted leading-relaxed mt-2">
                {t("pagina.academia.texto")}
              </p>
            </div>
            <Link href="/academia-senior" className="btn-primary shrink-0 text-sm">
              {t("pagina.academia.botao")}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="section-container pb-24 md:pb-32">
        <div className="bg-blue text-white p-8 md:p-10 flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
          <div className="max-w-lg">
            <p className="font-headline font-black uppercase tracking-tight leading-tight text-xl md:text-2xl">
              {t("pagina.cta.titulo")}
            </p>
            <p className="font-body text-sm text-white/85 mt-2">
              {t("vagas.curto")}.
            </p>
          </div>
          <Link
            href="/inscricoes"
            className="btn-primary shrink-0 bg-yellow text-blue-deep hover:bg-yellow-dim"
          >
            {t("pagina.cta.botao")}
          </Link>
        </div>
      </section>
    </div>
  );
}
