import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { paraPagina } from "@/lib/seo/metadados";
import type { Lingua } from "@/i18n/routing";
import { localeIntl } from "@/lib/data/quota";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import {
  TIPOS, apoiosPorTipo, type Apoio,
} from "@/lib/data/patrocinadores";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Lingua };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "clube.patrocinadores.meta" });
  return paraPagina("/patrocinadores", { title: t("titulo"), description: t("descricao") }, locale);
}

export default function PatrocinadoresPage({ params: { locale } }: { params: { locale: Lingua } }) {
  setRequestLocale(locale);
  const t = useTranslations("clube.patrocinadores");
  // O mote já está traduzido no início (inicio.mote.frase); aqui sai
  // sem a marcação e em caixa alta, como o MOTE.caixaAlta de clube.ts.
  const tInicio = useTranslations("inicio");
  const mote = tInicio
    .markup("mote.frase", { destaque: (c) => c })
    .toLocaleUpperCase(localeIntl(locale));

  return (
    <div className="bg-surface">
      {/* Cabeçalho */}
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-20 md:py-28">
          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            {mote}
          </p>
          <h1 className="section-title text-5xl md:text-7xl">
            {t.rich("cabecalho.titulo", { destaque: (c) => <span>{c}</span> })}
          </h1>
          <p className="font-body text-lg text-on-surface-muted mt-5 max-w-2xl leading-relaxed">
            {t("cabecalho.texto")}
          </p>

          {/*
            O convite vem logo aqui, antes da lista, e não só no fim:
            quem chega a esta página é muitas vezes alguém a pensar em
            apoiar, e não tem de rolar por todos os apoios para descobrir
            como. Pedido do Berto Barata (01/10/2026).
          */}
          <div className="mt-8 bg-blue section-dark text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5 justify-between max-w-4xl">
            <div>
              <p className="font-headline font-black uppercase text-xl md:text-2xl tracking-tight">
                {t("convite.titulo")}
              </p>
              <p className="font-body text-white/85 leading-relaxed mt-1.5 max-w-prose">
                {t("convite.texto")}
              </p>
            </div>
            <Link
              href="/patrocinar"
              className="btn-primary shrink-0 self-center md:self-auto bg-yellow text-blue-deep hover:bg-yellow-dim text-sm"
            >
              {t("cta.quero")} <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Apoios por tipo */}
      {TIPOS.map((tipo, i) => {
        const itens = apoiosPorTipo(tipo.id);
        if (itens.length === 0) return null;

        return (
          <section
            key={tipo.id}
            className={`section-container py-14 md:py-20 ${
              i > 0 ? "border-t border-on-surface/10" : ""
            }`}
          >
            <div className="max-w-2xl mb-10">
              <h2 className="font-headline font-black uppercase text-2xl md:text-3xl tracking-tighter text-on-surface">
                {t(`tipos.${tipo.id}.titulo`)}
              </h2>
              <p className="font-body text-on-surface-muted mt-2">{t(`tipos.${tipo.id}.intro`)}</p>
            </div>

            {tipo.id === "principal" ? (
              <div>
                {itens.map((a) => (
                  <ApoioPrincipal key={a.nome} apoio={a} />
                ))}
              </div>
            ) : (
              <ul className="border-t border-on-surface/15">
                {itens.map((a) => (
                  <ApoioLinha key={a.nome} apoio={a} />
                ))}
              </ul>
            )}
          </section>
        );
      })}

      {/* Tornar-se apoiante */}
      <section className="section-container pb-20 md:pb-28">
        <div className="section-dark bg-blue text-white p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="max-w-xl">
            <h2 className="font-headline font-black uppercase text-2xl md:text-3xl tracking-tight">
              {t("cta.titulo")}
            </h2>
            <p className="font-body text-white/80 leading-relaxed mt-2">
              {t("cta.texto", { anos: new Date().getFullYear() - 1966 })}
            </p>
          </div>
          {/* A ação principal passou a ser o pedido da apresentação; falar
              com o clube fica ao lado, para quem prefere conversar primeiro. */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/patrocinar"
              className="btn-primary bg-yellow text-blue-deep hover:bg-yellow-dim text-sm"
            >
              {t("cta.quero")} <ArrowRight size={16} aria-hidden />
            </Link>
            <Link
              href="/contactos"
              className="alvo-toque inline-flex items-center px-3 font-body text-sm text-white/85 hover:text-white underline underline-offset-4"
            >
              {t("cta.botao")}
            </Link>
          </div>
        </div>
      </section></div>
  );
}

/** O patrocinador principal é o único que ganha tratamento próprio. */
function ApoioPrincipal({ apoio }: { apoio: Apoio }) {
  const t = useTranslations("clube.patrocinadores");
  const conteudo = (
    <>
      <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-yellow">
        {t("vesteOClube")}
      </p>
      <h3 className="font-headline font-black uppercase text-4xl md:text-6xl tracking-tighter wdth-condensed text-on-surface mt-2 leading-none">
        {apoio.nome}
      </h3>
      <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-4 max-w-xl">
        {t(`apoios.${apoio.id}`)}
      </p>
      {apoio.url && (
        <span className="inline-flex items-center gap-1.5 font-body text-sm text-yellow mt-5">
          {t("visitarLoja")} <ExternalLink size={14} />
        </span>
      )}
    </>
  );

  return apoio.url ? (
    <a href={apoio.url} target="_blank" rel="noopener noreferrer" className="block group">
      {conteudo}
    </a>
  ) : (
    <div>{conteudo}</div>
  );
}

/**
 * Os restantes apoios são uma lista.
 * ─────────────────────────────────────────────────────────────────
 * Eram cartões com um retângulo em gradiente e as iniciais do nome lá
 * dentro. Sem logótipos, um cartão de apoio não tem nada para mostrar:
 * a moldura só sublinhava a ausência.
 *
 * Os ficheiros chegaram a 17/09/2026 e o logótipo entrou à esquerda,
 * do tamanho de um selo. Quem ainda não tem ficheiro fica sem a
 * coluna — a linha corre para a esquerda em vez de deixar um quadrado
 * vazio a apontar para o que falta.
 * ─────────────────────────────────────────────────────────────────
 */
function ApoioLinha({ apoio }: { apoio: Apoio }) {
  const t = useTranslations("clube.patrocinadores");
  const conteudo = (
    <div className="flex items-center gap-5 py-5">
      {apoio.logo && (
        // A respiração é dada aqui, e não dentro do ficheiro: com folga
        // nos dois sítios o logótipo encolhia para metade do selo.
        <span className="w-20 h-20 bg-white shrink-0 p-2 flex items-center justify-center">
          <Image
            src={apoio.logo}
            alt=""
            width={440}
            height={440}
            sizes="80px"
            className="max-w-full max-h-full object-contain"
          />
        </span>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-[16rem_1fr] sm:items-baseline gap-x-8 gap-y-1 min-w-0 flex-1">
        <span className="font-headline font-black uppercase text-lg md:text-xl text-on-surface leading-tight">
          {apoio.nome}
        </span>
        <span className="font-body text-on-surface-muted leading-relaxed">
          {t(`apoios.${apoio.id}`)}
        </span>
      </div>
    </div>
  );

  return (
    <li className="border-b border-on-surface/10">
      {apoio.url ? (
        <a href={apoio.url} target="_blank" rel="noopener noreferrer" className="block hover:text-yellow transition-colors duration-200">
          {conteudo}
        </a>
      ) : conteudo}
    </li>
  );
}

