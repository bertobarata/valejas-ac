import type { Metadata } from "next";
import Link from "next/link";
import CTASocio from "@/components/CTASocio";
import {
  ORGAOS, MANDATO, MOSTRAR_NUMERO_SOCIO, anosDeSocio,
  type Membro,
} from "@/lib/data/orgaosSociais";

export const metadata: Metadata = {
  title: "Órgãos Sociais",
  description:
    "Direção, Conselho Fiscal e Mesa da Assembleia Geral do Valejas Atlético Clube — quem são as pessoas que gerem o clube.",
};

export default function OrgaosSociaisPage() {
  return (
    <div className="bg-surface">
      {/* Cabeçalho */}
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-20 md:py-28">
          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            {MANDATO}
          </p>
          <h1 className="section-title text-5xl md:text-7xl">
            Órgãos <span>Sociais</span>
          </h1>
          <p className="font-body text-lg text-on-surface-muted mt-5 max-w-2xl leading-relaxed">
            Quem gere o clube. Todos são sócios do Valejas, e a maior parte
            há muitos anos — há quem esteja cá desde 1981.
          </p>
        </div>
      </section>

      {/* Órgãos */}
      {ORGAOS.map((orgao, i) => {
        const efetivos  = orgao.membros.filter((m) => !m.suplente);
        const suplentes = orgao.membros.filter((m) => m.suplente);

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
                {orgao.nome}
                {orgao.sigla && (
                  <span className="text-on-surface-muted font-body font-normal text-lg normal-case tracking-normal ml-3">
                    {orgao.sigla}
                  </span>
                )}
              </h2>
              <p className="font-body text-on-surface-muted leading-relaxed mt-2">
                {orgao.descricao}
              </p>
            </div>

            <ol className="border-t border-on-surface/15">
              {efetivos.map((m, i) => (
                <Membro key={`${orgao.id}-${m.cargo}`} membro={m} principal={i === 0} />
              ))}
            </ol>

            {suplentes.length > 0 && (
              <div className="mt-10">
                <h3 className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-on-surface-muted mb-1">
                  Suplentes
                </h3>
                <ol className="border-t border-on-surface/15">
                  {suplentes.map((m) => (
                    <Membro key={`${orgao.id}-${m.cargo}`} membro={m} compacto />
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
              Falar com a Direção
            </h2>
            <p className="font-body text-on-surface-muted leading-relaxed mt-2">
              Os comunicados oficiais são publicados no site e nas redes do
              clube. Para tudo o resto, fala connosco.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link href="/comunicados" className="btn-primary text-sm">
              Ver comunicados
            </Link>
            <Link href="/contactos" className="btn-ghost text-sm">
              Contactos
            </Link>
          </div>
        </div>
      </section>

      <CTASocio variante="discreto" />
    </div>
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
  const anos = anosDeSocio(membro.desde);

  return (
    <li
      className={`grid grid-cols-1 sm:grid-cols-[13rem_1fr_auto] sm:items-baseline gap-x-6 gap-y-1 border-b border-on-surface/10 ${
        compacto ? "py-3" : "py-5"
      }`}
    >
      <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted">
        {membro.cargo}
      </span>

      <span
        className={`font-headline font-black uppercase text-on-surface leading-tight ${
          principal ? "text-2xl md:text-3xl tracking-tighter" : compacto ? "text-base" : "text-lg md:text-xl"
        }`}
      >
        {membro.nome}
      </span>

      <span className="font-body text-sm text-on-surface-muted whitespace-nowrap">
        Sócio desde {membro.desde}
        {!compacto && (
          <>
            {" "}· {anos} {anos === 1 ? "ano" : "anos"}
          </>
        )}
        {MOSTRAR_NUMERO_SOCIO && <> · N.º {membro.numero}</>}
      </span>
    </li>
  );
}
