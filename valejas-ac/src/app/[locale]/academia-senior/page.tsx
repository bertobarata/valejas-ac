import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Lingua } from "@/i18n/routing";
import { paraPagina } from "@/lib/seo/metadados";
import { QUOTA_MENSAL, formatEuros } from "@/lib/data/quota";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
import {
  ACADEMIA, FAMILIAS, atividadesPorFamilia,
} from "@/lib/data/academiaSenior";
// Importação estática: o Next tira daqui as dimensões e o placeholder
// desfocado. Ficheiros já sem EXIF/GPS (ver public/academia-senior/).
import fotoArcos from "../../../../public/academia-senior/jogo-dos-arcos.webp";
import fotoRoda from "../../../../public/academia-senior/roda-no-recreio.webp";
import fotoLabirintos from "../../../../public/academia-senior/labirintos-de-cartao.webp";

export async function generateMetadata(
  { params: { locale } }: { params: { locale: Lingua } },
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "academia.meta" });
  return paraPagina("/academia-senior", {
    title: t("titulo"),
    description: t("descricao"),
  }, locale);
}

export default function AcademiaSeniorPage(
  { params: { locale } }: { params: { locale: Lingua } },
) {
  setRequestLocale(locale);
  const t = useTranslations("academia");

  return (
    <div className="bg-surface">
      {/* Cabeçalho */}
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-20 md:py-28 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] gap-12 lg:gap-16 items-center">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
              {ACADEMIA.projeto}
            </p>
            <h1 className="font-headline font-black text-5xl md:text-7xl uppercase leading-none tracking-tighter text-on-surface">
              {t.rich("cabecalho.titulo", {
                destaque: (c) => <span className="text-yellow">{c}</span>,
              })}
            </h1>
            <p className="font-body text-xl md:text-2xl text-blue mt-5 leading-relaxed">
              {t("cabecalho.tagline")}
            </p>
            <p className="font-body text-lg text-on-surface-muted mt-4 max-w-2xl leading-relaxed">
              {t("cabecalho.intro")}
            </p>

            {/* Prática — onde e quando */}
            <div className="mt-10 flex flex-col sm:flex-row gap-8">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-yellow flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted">
                    {t("cabecalho.onde")}
                  </p>
                  <p className="font-body text-base text-on-surface mt-1">{t("cabecalho.local")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-yellow flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted">
                    {t("cabecalho.quando")}
                  </p>
                  {ACADEMIA.horario.map((h) => (
                    <p key={h.id} className="font-body text-base text-on-surface mt-1">
                      {t(`cabecalho.horario.${h.id}`)} — {h.horas}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <figure>
            <div className="relative aspect-[4/3] lg:aspect-[4/5] overflow-hidden bg-surface-high">
              <Image
                src={fotoArcos}
                alt={t("fotos.arcos.alt")}
                fill
                priority
                placeholder="blur"
                sizes="(max-width: 1024px) 100vw, 30rem"
                className="object-cover object-[50%_72%] lg:object-[50%_60%]"
              />
            </div>
            <figcaption className="font-body text-sm text-on-surface-muted mt-3">
              {t("fotos.arcos.legenda")}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Atividades, por família */}
      <section className="section-container py-16 md:py-24">
        <h2 className="font-headline font-black uppercase tracking-tighter leading-none text-3xl md:text-4xl text-on-surface">
          {t("oQueSeFaz.titulo")}
        </h2>
        <p className="font-body text-on-surface-muted mt-2 max-w-2xl">
          {t("oQueSeFaz.texto")}
        </p>

        <div className="mt-12 space-y-14">
          {FAMILIAS.map((f) => {
            const itens = atividadesPorFamilia(f.id);
            if (itens.length === 0) return null;
            return (
              <div key={f.id}>
                <h3 className="font-headline font-black text-2xl uppercase tracking-tighter text-yellow border-b border-on-surface/10 pb-3">
                  {t(`oQueSeFaz.familias.${f.id}`)}
                </h3>
                <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-14">
                  {itens.map((a) => (
                    <li
                      key={a.id}
                      className="py-4 border-b border-on-surface/10 flex flex-col sm:flex-row sm:items-baseline gap-x-5 gap-y-1"
                    >
                      <span className="font-headline font-black uppercase text-lg text-on-surface sm:w-44 shrink-0">
                        {t(`oQueSeFaz.itens.${a.id}.nome`)}
                      </span>
                      <span className="font-body text-on-surface-muted leading-relaxed">
                        {t(`oQueSeFaz.itens.${a.id}.descricao`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Entre gerações — fotografias */}
      <section className="bg-surface-low border-t border-on-surface/10">
        <div className="section-container py-16 md:py-24">
          <h2 className="font-headline font-black uppercase tracking-tighter leading-none text-3xl md:text-4xl text-on-surface">
            {t("maisNovos.titulo")}
          </h2>
          <p className="font-body text-on-surface-muted mt-2 max-w-2xl leading-relaxed">
            {t("maisNovos.texto")}
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-5 gap-px bg-on-surface/10">
            <figure className="md:col-span-3 bg-surface-low">
              <div className="relative aspect-[4/3] md:aspect-[3/2] overflow-hidden bg-surface-high">
                <Image
                  src={fotoRoda}
                  alt={t("fotos.roda.alt")}
                  fill
                  placeholder="blur"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover object-[50%_80%]"
                />
              </div>
              <figcaption className="font-body text-sm text-on-surface-muted p-4">
                {t("fotos.roda.legenda")}
              </figcaption>
            </figure>
            <figure className="md:col-span-2 bg-surface-low flex flex-col">
              <div className="relative aspect-[4/3] md:aspect-auto md:flex-1 overflow-hidden bg-surface-high">
                <Image
                  src={fotoLabirintos}
                  alt={t("fotos.labirintos.alt")}
                  fill
                  placeholder="blur"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-[35%_50%]"
                />
              </div>
              <figcaption className="font-body text-sm text-on-surface-muted p-4">
                {t("fotos.labirintos.legenda")}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Porquê */}
      <section className="section-dark bg-blue text-white">
        <div className="section-container py-16 md:py-20">
          <div className="max-w-2xl">
            <h2 className="font-headline font-black uppercase tracking-tighter leading-none text-3xl md:text-4xl">
              {t("porque.titulo")}
            </h2>
            <p className="font-body text-lg text-white/80 leading-relaxed mt-4">
              {t("porque.paragrafo1")}
            </p>
            <p className="font-body text-lg text-white/80 leading-relaxed mt-4">
              {t("porque.paragrafo2")}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-container py-16 md:py-24">
        <div className="bg-surface-high p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="max-w-xl">
            <h2 className="font-headline font-black uppercase tracking-tight leading-none text-2xl md:text-3xl text-on-surface">
              {t("cta.titulo")}
            </h2>
            <p className="font-body text-on-surface-muted leading-relaxed mt-2">
              {t("cta.texto", { quota: formatEuros(QUOTA_MENSAL, locale) })}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link href="/socios/inscricao" className="btn-primary text-sm">
              {t("cta.fazerSocio")}
            </Link>
            <Link href="/contactos" className="btn-ghost text-sm">
              {t("cta.contactos")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
