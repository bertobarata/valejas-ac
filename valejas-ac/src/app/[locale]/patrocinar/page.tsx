import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Lingua } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { ArrowDown, ArrowRight } from "lucide-react";
import { paraPagina } from "@/lib/seo/metadados";
import { FUNDADO_EM } from "@/lib/data/clube";
import { FORMAS_DE_APOIO } from "@/lib/data/patrocinio";
import { MODALIDADES } from "@/lib/data/modalidades";
import PedidoPatrocinio from "@/components/patrocinio/PedidoPatrocinio";

export async function generateMetadata({ params: { locale } }: { params: { locale: Lingua } }) {
  const t = await getTranslations({ locale, namespace: "patrocinio.meta" });
  return paraPagina("/patrocinar", { title: t("titulo"), description: t("descricao") }, locale);
}

/**
 * QUERO SER PATROCINADOR
 * ─────────────────────────────────────────────────────────────────
 * /patrocinadores mostra quem já apoia; esta página é a porta para
 * quem ainda não apoia. Separadas de propósito: a lista de apoios é
 * um agradecimento, e não deve parecer um balcão de vendas.
 *
 * O endereço é /patrocinar — um verbo, curto, que se diz ao telefone
 * e cabe num cartaz do pavilhão («valejasac.pt/patrocinar»), ao lado
 * de /inscricoes. Debaixo de /patrocinadores ficava comprido e a ler
 * mal («patrocinadores/quero-ser»).
 *
 * O tom é o de /patrocinadores: trata-se a pessoa por você. Quem
 * escreve é muitas vezes uma empresa, e é o registo que o clube usa
 * na apresentação.
 *
 * A troca é simples: a pessoa diz quem é, e a apresentação de
 * parcerias — com os valores — chega-lhe ao email na hora. Os valores
 * não estão nesta página (ver @/lib/data/patrocinio).
 * ─────────────────────────────────────────────────────────────────
 */
export default function PatrocinarPage({ params: { locale } }: { params: { locale: Lingua } }) {
  setRequestLocale(locale);
  const t = useTranslations("patrocinio");
  const anos = new Date().getFullYear() - FUNDADO_EM;

  return (
    <div className="bg-surface">
      {/* Cabeçalho */}
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-16 md:py-24">
          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            {t("cabecalho.etiqueta")}
          </p>
          <h1 className="section-title text-4xl md:text-6xl">
            {t.rich("cabecalho.titulo", { destaque: (c) => <span>{c}</span> })}
          </h1>
          <p className="font-body text-lg md:text-xl text-on-surface-muted mt-5 max-w-2xl leading-relaxed">
            {t("cabecalho.texto", { anos, modalidades: MODALIDADES.length })}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 mt-8">
            <a href="#pedido" className="btn-primary text-sm">
              {t("cabecalho.pedir")} <ArrowDown size={16} aria-hidden />
            </a>
            <Link
              href="/patrocinadores"
              className="alvo-toque inline-flex items-center gap-1.5 font-body text-sm text-on-surface-muted hover:text-yellow underline underline-offset-4 transition-colors duration-200"
            >
              {t("cabecalho.verApoios")}
            </Link>
          </div>
        </div>
      </section>

      {/* Onde pode estar a sua marca */}
      <section className="section-container py-14 md:py-20">
        <div className="max-w-2xl mb-10">
          <h2 className="font-headline font-black uppercase text-2xl md:text-3xl tracking-tighter text-on-surface">
            {t("marca.titulo")}
          </h2>
          <p className="font-body text-on-surface-muted leading-relaxed mt-2">
            {t("marca.texto")}
          </p>
        </div>

        <ul className="border-t border-on-surface/15">
          {FORMAS_DE_APOIO.filter((f) => f.id !== "outro").map((f) => (
            <li key={f.id} className="border-b border-on-surface/10">
              <div className="grid grid-cols-1 sm:grid-cols-[16rem_1fr] sm:items-baseline gap-x-8 gap-y-1 py-5">
                <span className="font-headline font-black uppercase text-lg md:text-xl text-on-surface leading-tight">
                  {t(`formasDeApoio.${f.id}.nome`)}
                </span>
                <span className="font-body text-on-surface-muted leading-relaxed max-w-prose">
                  {t(`formasDeApoio.${f.id}.descricao`)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Formulário */}
      <section
        id="pedido"
        className="section-container py-14 md:py-20 border-t border-on-surface/10 scroll-mt-32"
      >
        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 lg:gap-16">
          {/* Como em /inscricoes: o limite de leitura vai no texto, não
              na grelha, que só se divide a partir de `lg`. */}
          <div className="max-w-prose">
            <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
              {t("passos.titulo")}
            </h2>
            <ol className="mt-6 space-y-5">
              {(["quem", "apresentacao", "contacto"] as const).map((k) => ({
                titulo: t(`passos.${k}.titulo`),
                texto: t(`passos.${k}.texto`),
              })).map((p, i) => (
                <li key={p.titulo} className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                  <span
                    aria-hidden
                    className="font-headline font-black text-3xl text-yellow/40 leading-none tabular-nums whitespace-nowrap shrink-0 md:w-12"
                  >
                    0{i + 1}
                  </span>
                  <div className="text-center md:text-left">
                    <h3 className="font-headline font-black uppercase text-base text-on-surface">
                      {p.titulo}
                    </h3>
                    <p className="font-body text-on-surface-muted leading-relaxed mt-1">
                      {p.texto}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <PedidoPatrocinio />
        </div>
      </section>

      {/* Fecho — quem prefere falar primeiro */}
      <section className="section-container pb-20 md:pb-28">
        <div className="bg-surface-high border border-on-surface/10 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <p className="font-body text-on-surface-muted leading-relaxed max-w-prose">
            {t("fecho.texto")}
          </p>
          <Link href="/contactos" className="btn-ghost text-sm shrink-0 self-center md:self-auto">
            {t("fecho.botao")} <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}
