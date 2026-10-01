import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { paraPagina } from "@/lib/seo/metadados";
import { Link } from "@/i18n/navigation";
import type { Lingua } from "@/i18n/routing";
import { ArrowRight, ClipboardCheck, Download, FileText, MessageSquare, UserPlus } from "lucide-react";
import { MODALIDADES } from "@/lib/data/modalidades";
import { QUOTA_MENSAL, formatEuros } from "@/lib/data/quota";
import { DOCUMENTOS } from "@/lib/data/documentos";
import PedidoInscricao from "@/components/inscricoes/PedidoInscricao";
import ValoresEpoca from "@/components/inscricoes/ValoresEpoca";

export async function generateMetadata(
  { params: { locale } }: { params: { locale: Lingua } }
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "inscricoes.meta" });
  return paraPagina("/inscricoes", { title: t("titulo"), description: t("descricao") }, locale);
}

/** O que se leva à sede além dos PDFs — chaves em levar.itens. */
const LEVAR = ["ccAtleta", "ccEncarregado", "fotografia", "fichaFederacao"] as const;

/**
 * INSCRIÇÕES
 * ─────────────────────────────────────────────────────────────────
 * Quem quer praticar no clube tropeça sempre na mesma ordem: primeiro
 * sócio, depois vaga, depois a sede. Esta página existe para dizer
 * isso por ordem, em vez de a pessoa descobrir pelo caminho.
 * ─────────────────────────────────────────────────────────────────
 */
export default function InscricoesPage({ params: { locale } }: { params: { locale: Lingua } }) {
  setRequestLocale(locale);
  const t = useTranslations("inscricoes");
  const tm = useTranslations("modalidades");
  const lingua = useLocale();

  const passos = [
    {
      Icon: UserPlus,
      titulo: t("passos.socio.titulo"),
      texto: t("passos.socio.texto", { quota: formatEuros(QUOTA_MENSAL, lingua) }),
      accao: { label: t("passos.socio.accao"), href: "/socios/inscricao" },
    },
    {
      Icon: MessageSquare,
      titulo: t("passos.inscricao.titulo"),
      texto: t("passos.inscricao.texto"),
    },
    {
      Icon: ClipboardCheck,
      titulo: t("passos.sede.titulo"),
      texto: t("passos.sede.texto"),
    },
  ];

  return (
    <div className="bg-surface">
      {/* Cabeçalho */}
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-16 md:py-20">
          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            {t("cabecalho.etiqueta")}
          </p>
          <h1 className="section-title text-4xl md:text-6xl">
            <span>{t("cabecalho.titulo")}</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-on-surface-muted mt-5 max-w-2xl leading-relaxed">
            {t("cabecalho.texto", { n: MODALIDADES.length })}
          </p>
        </div>
      </section>

      {/* Os três passos */}
      <section className="section-container py-14 md:py-20">
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-on-surface/10">
          {passos.map(({ Icon, titulo, texto, accao }, i) => (
            <li key={titulo} className="bg-surface-high p-7 md:p-8 flex flex-col">
              <span
                aria-hidden
                className="font-headline font-black text-5xl text-yellow/30 leading-none"
              >
                0{i + 1}
              </span>
              <Icon size={22} className="text-yellow mt-5" aria-hidden />
              <h2 className="font-headline font-black uppercase text-xl text-on-surface mt-4">
                {titulo}
              </h2>
              <p className="font-body text-on-surface-muted leading-relaxed mt-2 flex-1">
                {texto}
              </p>
              {accao && (
                <Link href={accao.href} className="btn-primary text-sm mt-6 self-start">
                  {accao.label} <ArrowRight size={14} />
                </Link>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Formulário */}
      <section
        id="enviar"
        className="section-container py-14 md:py-20 border-t border-on-surface/10 scroll-mt-32"
      >
        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 lg:gap-16">
          {/* A coluna só se divide em dois a partir de `lg`. Abaixo disso é a
              largura toda, e num iPad vertical isso dava linhas de 95
              caracteres. O limite de leitura não pode depender da grelha. */}
          <div className="max-w-prose">
            <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
              {t("envio.titulo")}
            </h2>
            <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-4">
              {tm("vagas.texto")}
            </p>
            <p className="font-body text-on-surface-muted leading-relaxed mt-4">
              {t("envio.sede")}
            </p>
            <p className="font-body text-on-surface-muted leading-relaxed mt-4">
              {t.rich("envio.direitos", {
                link: (c) => (
                  <Link href="/inscricoes/direitos-de-imagem" className="text-yellow underline">
                    {c}
                  </Link>
                ),
              })}
            </p>
          </div>

          <PedidoInscricao />
        </div>
      </section>

      <ValoresEpoca />

      {/* O que é preciso levar à sede */}
      <section className="section-container py-14 md:py-20 border-t border-on-surface/10">
        <div className="max-w-2xl mb-8">
          <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
            {t("levar.titulo")}
          </h2>
          <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-3">
            {t("levar.texto")}
          </p>
        </div>

        <div className="grid gap-px bg-on-surface/10 sm:grid-cols-2">
          {DOCUMENTOS.map((doc) => (
            <article key={doc.ficheiro} className="bg-surface-high p-7 md:p-8 flex flex-col">
              <FileText size={22} className="text-yellow" aria-hidden />
              <h3 className="font-headline font-black uppercase text-xl text-on-surface mt-4">
                {t(`documentos.${doc.chave}.nome`)}
              </h3>
              <p className="font-body text-on-surface-muted leading-relaxed mt-2">
                {t(`documentos.${doc.chave}.descricao`)}
              </p>
              <p className="font-body text-sm text-on-surface-muted leading-relaxed mt-3">
                {t(`documentos.${doc.chave}.comoUsar`)}
              </p>
              {doc.origem && (
                <p className="font-body text-xs text-on-surface-muted mt-3">
                  {t("levar.oficialDe", { origem: doc.origem })}
                </p>
              )}
              <a
                href={doc.ficheiro}
                download
                className="btn-primary text-sm mt-6 self-start"
              >
                <Download size={16} /> {t("levar.descarregar")}
              </a>
            </article>
          ))}

          {/* Os outros papéis não são ficheiros: são coisas para trazer. */}
          <article className="bg-surface-high p-7 md:p-8 flex flex-col">
            <ClipboardCheck size={22} className="text-yellow" aria-hidden />
            <h3 className="font-headline font-black uppercase text-xl text-on-surface mt-4">
              {t("levar.maisIsto")}
            </h3>
            <ul className="mt-3 space-y-2">
              {LEVAR.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-yellow shrink-0 mt-2.5" />
                  <span className="font-body text-on-surface-muted leading-relaxed">
                    {t(`levar.itens.${item}`)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="font-body text-sm text-on-surface-muted leading-relaxed mt-5">
              {t("levar.horario")}
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
