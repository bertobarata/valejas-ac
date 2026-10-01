import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { paraPagina } from "@/lib/seo/metadados";
import type { Lingua } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, MapPin } from "lucide-react";
import {
  FUNDACAO, ORIGENS, DEPOIS, LOCALIZACAO, anosDeVida,
} from "@/lib/data/historia";
import MapaClube from "@/components/historia/MapaClube";

/**
 * As outras portas do clube. Ordem pensada: identidade, casa, quem manda, quem apoia.
 * Nome e descrição de cada uma estão em clube.historia.resto.paginas.<chave>.
 */
const PAGINAS_DO_CLUBE = [
  { chave: "emblema",        href: "/clube/emblema" },
  { chave: "instalacoes",    href: "/instalacoes" },
  { chave: "orgaos",         href: "/orgaos-sociais" },
  { chave: "patrocinadores", href: "/patrocinadores" },
] as const;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Lingua };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "clube.historia" });
  return paraPagina(
    "/clube",
    { title: t("meta.titulo"), description: t("meta.descricao", { data: t("dataFundacao") }) },
    locale,
  );
}

/**
 * O CLUBE
 * ─────────────────────────────────────────────────────────────────
 * O destino de quem carrega em «Conhecer o clube» no início. Abre pela
 * história, porque é por aí que se conhece um clube de 1966, e fecha a
 * apontar para o resto — emblema, instalações, quem dirige, quem apoia.
 *
 * Antes disto a história vivia em /historia, sem entrada na navegação:
 * estava escrita e não se encontrava.
 * ─────────────────────────────────────────────────────────────────
 */
export default function ClubePage({ params: { locale } }: { params: { locale: Lingua } }) {
  setRequestLocale(locale);
  const t = useTranslations("clube.historia");
  const anos = anosDeVida();

  return (
    <div className="bg-surface">
      {/* Cabeçalho */}
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-20 md:py-28">
          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            {/* Em texto, para o ano não sair «1,966» em inglês. */}
            {t("cabecalho.etiqueta", { ano: String(FUNDACAO.ano) })}
          </p>
          <h1 className="section-title text-5xl md:text-7xl">
            {t.rich("cabecalho.titulo", { anos, destaque: (c) => <span>{c}</span> })}
          </h1>
          <p className="font-body text-lg md:text-xl text-on-surface-muted mt-5 max-w-2xl leading-relaxed">
            {t.rich("cabecalho.texto", {
              data: t("dataFundacao"),
              localidade: FUNDACAO.localidade,
              freguesia: FUNDACAO.freguesia,
              concelho: FUNDACAO.concelho,
              forte: (c) => <strong className="text-on-surface">{c}</strong>,
            })}
          </p>
        </div>
      </section>

      {/* Como foi fundado — com a honestidade de dizer o que não se sabe */}
      <section className="section-container py-16 md:py-20">
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 md:gap-16">
          <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
            {t("fundacao.titulo")}
          </h2>
          <div className="space-y-5 max-w-prose">
            <p className="font-body text-lg text-on-surface-muted leading-relaxed">
              {t("fundacao.p1")}
            </p>
            <p className="font-body text-lg text-on-surface-muted leading-relaxed">
              {t("fundacao.p2")}
            </p>

            <div className="bg-surface-high p-6 md:p-7">
              <p className="font-headline font-black uppercase text-sm text-on-surface">
                {t("fundacao.naoSabemos.titulo")}
              </p>
              <p className="font-body text-on-surface-muted leading-relaxed mt-2">
                {t("fundacao.naoSabemos.texto")}
              </p>
              <Link href="/contactos" className="btn-ghost text-sm mt-4">
                {t("fundacao.naoSabemos.botao")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Como começou */}
      <section className="section-container py-16 md:py-20 border-t border-on-surface/10">
        <div className="max-w-2xl mb-12">
          <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
            {t("comecou.titulo")}
          </h2>
          <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-3">
            {t("comecou.texto")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-on-surface/10">
          {ORIGENS.map((o, i) => (
            <article key={o.id} className="bg-surface-high p-7 md:p-8">
              <span
                aria-hidden
                className="font-headline font-black text-5xl text-yellow/30 leading-none"
              >
                0{i + 1}
              </span>
              <h3 className="font-headline font-black uppercase text-xl text-on-surface mt-4">
                {t(`comecou.origens.${o.id}.nome`)}
              </h3>
              <p className="font-body text-on-surface-muted leading-relaxed mt-2">
                {t(`comecou.origens.${o.id}.descricao`)}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 max-w-2xl">
          <h3 className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-on-surface-muted border-b border-on-surface/10 pb-3 mb-5">
            {t("comecou.depoisTitulo")}
          </h3>
          <ul className="space-y-3">
            {(t.raw("comecou.depois") as typeof DEPOIS).map((d) => (
              <li key={d} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="w-1.5 h-1.5 rounded-full bg-yellow flex-shrink-0 mt-2.5"
                />
                <span className="font-body text-on-surface-muted leading-relaxed">{d}</span>
              </li>
            ))}
          </ul>
          <p className="font-body text-sm text-on-surface-muted mt-6 leading-relaxed">
            {t("comecou.nota")}
          </p>
        </div>
      </section>

      {/* Onde estamos */}
      <section className="section-container py-16 md:py-20 border-t border-on-surface/10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div>
            <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
              {t("ondeEstamos.titulo")}
            </h2>
            <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-3">
              {t("ondeEstamos.texto")}
            </p>

            <div className="flex items-start gap-3 mt-8">
              <MapPin size={20} className="text-yellow flex-shrink-0 mt-1" />
              <address className="font-body text-base text-on-surface not-italic leading-relaxed">
                {LOCALIZACAO.morada}
                <br />
                {LOCALIZACAO.codigoPostal} {LOCALIZACAO.localidade}
                <br />
                {LOCALIZACAO.freguesia}, {LOCALIZACAO.concelho}
              </address>
            </div>

            <p className="font-body text-sm text-on-surface-muted mt-4">
              {t("ondeEstamos.tambem", { morada: LOCALIZACAO.moradaAlt })}
            </p>
          </div>

          <MapaClube />
        </div>
      </section>

      {/* O resto do clube — daqui vai-se a todo o lado */}
      <section className="section-container py-16 md:py-20 border-t border-on-surface/10">
        <div className="max-w-2xl mb-8">
          <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
            {t("resto.titulo")}
          </h2>
          <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-3">
            {t("resto.texto")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-px md:bg-on-surface/10">
          {PAGINAS_DO_CLUBE.map((pagina) => (
            <Link
              key={pagina.href}
              href={pagina.href}
              className="group bg-surface-high p-7 flex flex-col justify-between min-h-[11rem]"
            >
              <div>
                <h3 className="font-headline font-black uppercase text-xl text-on-surface leading-none group-hover:text-yellow transition-colors duration-300">
                  {t(`resto.paginas.${pagina.chave}.nome`)}
                </h3>
                <p className="font-body text-sm text-on-surface-muted leading-relaxed mt-2">
                  {t(`resto.paginas.${pagina.chave}.descricao`)}
                </p>
              </div>
              <ArrowUpRight
                size={16}
                aria-hidden
                className="text-on-surface-muted group-hover:text-yellow transition-colors duration-300 mt-5 self-end"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-container pb-20 md:pb-28">
        <div className="bg-surface-high p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="max-w-xl">
            <h2 className="font-headline font-black uppercase text-2xl tracking-tight text-on-surface">
              {t("cta.titulo", { anos })}
            </h2>
            <p className="font-body text-on-surface-muted leading-relaxed mt-2">
              {t("cta.texto")}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link href="/socios/inscricao" className="btn-primary text-sm">
              {t("cta.fazerSocio")}
            </Link>
            <Link href="/contactos" className="btn-ghost text-sm">
              {t("cta.falar")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
