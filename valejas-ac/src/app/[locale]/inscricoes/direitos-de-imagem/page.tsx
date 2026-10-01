import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { paraPagina } from "@/lib/seo/metadados";
import { Link } from "@/i18n/navigation";
import type { Lingua } from "@/i18n/routing";
import { ArrowLeft, Info } from "lucide-react";
import { CLUBE_DOCUMENTO } from "@/lib/data/direitosImagem";

export async function generateMetadata(
  { params: { locale } }: { params: { locale: Lingua } }
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "inscricoes.direitosImagem.meta" });
  return paraPagina(
    "/inscricoes/direitos-de-imagem",
    { title: t("titulo"), description: t("descricao") },
    locale,
  );
}

/** Os parágrafos do termo, pela ordem do papel (direitosImagem.paragrafos). */
const PARAGRAFOS = ["p1", "p2", "p3", "p4", "p5", "p6"] as const;

/**
 * DIREITOS DE IMAGEM
 * ─────────────────────────────────────────────────────────────────
 * O mesmo texto que se assina em papel na sede, à vista de quem o
 * aceita no formulário de inscrição. Aceitar sem poder ler não é
 * consentimento informado — e é isso que o RGPD exige.
 *
 * Nas outras línguas é uma tradução para se perceber o que se assina;
 * o documento que vale é o português, e a página di-lo no topo.
 * ─────────────────────────────────────────────────────────────────
 */
export default function DireitosDeImagemPage({ params: { locale } }: { params: { locale: Lingua } }) {
  setRequestLocale(locale);
  const t = useTranslations("inscricoes.direitosImagem");
  const lingua = useLocale();

  return (
    <div className="bg-surface">
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-14 md:py-20">
          <Link
            href="/inscricoes"
            className="inline-flex items-center gap-2 min-h-11 font-body text-sm text-on-surface-muted hover:text-on-surface transition-colors mb-2"
          >
            <ArrowLeft size={16} aria-hidden />
            {t("voltarInscricoes")}
          </Link>
          <h1 className="section-title text-3xl md:text-5xl">
            {t.rich("titulo", { destaque: (c) => <span>{c}</span> })}
          </h1>
          <p className="font-body text-lg text-on-surface-muted mt-5 max-w-2xl leading-relaxed">
            {t("documentoTitulo")}
          </p>
        </div>
      </section>

      <div className="section-container py-14 md:py-20 max-w-3xl">
        {/* Fora do português: isto é uma tradução, o que vale é o original. */}
        {lingua !== "pt" && (
          <p className="font-body text-sm text-on-surface-muted leading-relaxed mb-10 flex gap-3">
            <Info size={18} className="text-yellow shrink-0 mt-0.5" aria-hidden />
            <span>{t("avisoVersao")}</span>
          </p>
        )}

        <div className="space-y-6">
          {PARAGRAFOS.map((p) => (
            <p key={p} className="font-body text-on-surface-muted leading-relaxed">
              {t(`paragrafos.${p}`, {
                email: CLUBE_DOCUMENTO.emailDados,
                telefone: CLUBE_DOCUMENTO.telefone,
              })}
            </p>
          ))}
        </div>

        <div className="bg-surface-high p-7 md:p-8 mt-10 space-y-4">
          <h2 className="font-headline font-black uppercase text-lg tracking-tight text-on-surface">
            {t("oQueSeAceita")}
          </h2>
          <p className="font-body text-on-surface leading-relaxed">
            {t("declaracao.maior")}
          </p>
          <p className="font-body text-on-surface-muted leading-relaxed">
            {t("quandoMenor")}
          </p>
          <p className="font-body text-on-surface leading-relaxed">
            {t("declaracao.menor")}
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-on-surface/15">
          <p className="font-body text-sm text-on-surface-muted leading-relaxed">
            <strong className="text-on-surface">{CLUBE_DOCUMENTO.nome}</strong> ·{" "}
            {t("clube.fundado", { data: t("clube.dataFundacao") })} · {t("clube.estatuto")} ·{" "}
            {t("clube.contribuinte", { numero: CLUBE_DOCUMENTO.contribuinte })}
            <br />
            {CLUBE_DOCUMENTO.morada} · {t("clube.telefone", { numero: CLUBE_DOCUMENTO.telefone })}
            <br />
            {t("clube.protecaoDados")}{" "}
            <a href={`mailto:${CLUBE_DOCUMENTO.emailDados}`} className="text-yellow underline">
              {CLUBE_DOCUMENTO.emailDados}
            </a>
          </p>
        </div>

        <div className="mt-10">
          <Link href="/inscricoes#enviar" className="btn-primary text-sm">
            {t("voltarInscricao")}
          </Link>
        </div>
      </div>
    </div>
  );
}
