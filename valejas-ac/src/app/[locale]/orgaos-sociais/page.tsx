import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { paraPagina } from "@/lib/seo/metadados";
import type { Lingua } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import {
  ORGAOS, MOSTRAR_NUMERO_SOCIO, anosDeSocio,
  type Membro,
} from "@/lib/data/orgaosSociais";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Lingua };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "clube.orgaos.meta" });
  return paraPagina("/orgaos-sociais", { title: t("titulo"), description: t("descricao") }, locale);
}

/** "conselho-fiscal" → "conselhoFiscal", a chave em clube.orgaos.orgaos. */
function chaveOrgao(id: string): string {
  return id.replace(/-(\w)/g, (_, letra: string) => letra.toUpperCase());
}

export default function OrgaosSociaisPage({ params: { locale } }: { params: { locale: Lingua } }) {
  setRequestLocale(locale);
  const t = useTranslations("clube.orgaos");

  return (
    <div className="bg-surface">
      {/* Cabeçalho */}
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-20 md:py-28">
          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            {t("mandato")}
          </p>
          <h1 className="section-title text-5xl md:text-7xl">
            {t.rich("cabecalho.titulo", { destaque: (c) => <span>{c}</span> })}
          </h1>
          <p className="font-body text-lg text-on-surface-muted mt-5 max-w-2xl leading-relaxed">
            {t("cabecalho.texto")}
          </p>
        </div>
      </section>

      {/* Órgãos */}
      {ORGAOS.map((orgao, i) => {
        const efetivos  = orgao.membros.filter((m) => !m.suplente);
        const suplentes = orgao.membros.filter((m) => m.suplente);
        const chave     = `orgaos.${chaveOrgao(orgao.id)}`;
        // Sigla só onde a há em português (MAG) e a língua a usa.
        const sigla     = orgao.sigla && t(`${chave}.sigla`);

        return (
          <section
            key={orgao.id}
            id={orgao.id}
            className={`section-container py-16 md:py-20 scroll-mt-24 ${
              i > 0 ? "border-t border-on-surface/10" : ""
            }`}
          >
            <div className="max-w-2xl mb-10">
              <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
                {t(`${chave}.nome`)}
                {sigla && (
                  <span className="text-on-surface-muted font-body font-normal text-lg normal-case tracking-normal ml-3">
                    {sigla}
                  </span>
                )}
              </h2>
              <p className="font-body text-on-surface-muted leading-relaxed mt-2">
                {t(`${chave}.descricao`)}
              </p>
            </div>

            <ol className="border-t border-on-surface/15">
              {efetivos.map((m, i) => (
                <Membro key={`${orgao.id}-${m.cargoId}`} membro={m} principal={i === 0} />
              ))}
            </ol>

            {suplentes.length > 0 && (
              <div className="mt-10">
                <h3 className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-on-surface-muted mb-1">
                  {t("suplentes")}
                </h3>
                <ol className="border-t border-on-surface/15">
                  {suplentes.map((m) => (
                    <Membro key={`${orgao.id}-${m.cargoId}`} membro={m} compacto />
                  ))}
                </ol>
              </div>
            )}
          </section>
        );
      })}

      {/* CTA */}
      <section className="section-container pb-20 md:pb-28">
        <div className="bg-surface-high p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="max-w-xl">
            <h2 className="font-headline font-black uppercase text-2xl tracking-tight text-on-surface">
              {t("cta.titulo")}
            </h2>
            <p className="font-body text-on-surface-muted leading-relaxed mt-2">
              {t("cta.texto")}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link href="/comunicados" className="btn-primary text-sm">
              {t("cta.comunicados")}
            </Link>
            <Link href="/contactos" className="btn-ghost text-sm">
              {t("cta.contactos")}
            </Link>
          </div>
        </div>
      </section></div>
  );
}

/**
 * Uma linha por pessoa.
 * ─────────────────────────────────────────────────────────────────
 * Isto eram vinte cartões iguais, cada um com um retângulo em
 * gradiente e as iniciais lá dentro. Três problemas: o Presidente e o
 * segundo suplente recebiam o mesmo peso, as iniciais não identificam
 * ninguém (a Dina Faustino e a Diana Figueira davam ambas "DF"), e
 * sem fotografia o cartão não tinha nada para mostrar.
 *
 * Uma lista resolve os três: o cargo manda, o nome é o que se lê, e a
 * hierarquia vive na escala em vez de na moldura.
 * ─────────────────────────────────────────────────────────────────
 */
function Membro({
  membro, principal, compacto,
}: {
  membro: Membro;
  principal?: boolean;
  compacto?: boolean;
}) {
  const t = useTranslations("clube.orgaos");
  const anos = anosDeSocio(membro.desde);

  return (
    <li
      className={`grid grid-cols-1 sm:grid-cols-[13rem_1fr_auto] sm:items-baseline gap-x-6 gap-y-1 border-b border-on-surface/10 ${
        compacto ? "py-3" : "py-5"
      }`}
    >
      <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted">
        {t(`cargos.${membro.cargoId}`)}
      </span>

      <span
        className={`font-headline font-black uppercase text-on-surface leading-tight ${
          principal ? "text-2xl md:text-3xl tracking-tighter" : compacto ? "text-base" : "text-lg md:text-xl"
        }`}
      >
        {membro.nome}
      </span>

      <span className="font-body text-sm text-on-surface-muted whitespace-nowrap">
        {/* O ano em texto, para não sair «2,024» em inglês. */}
        {t("socioDesde", { ano: String(membro.desde) })}
        {!compacto && (
          <>
            {" "}· {t("anos", { anos })}
          </>
        )}
        {MOSTRAR_NUMERO_SOCIO && <> · {t("numero", { numero: membro.numero })}</>}
      </span>
    </li>
  );
}
