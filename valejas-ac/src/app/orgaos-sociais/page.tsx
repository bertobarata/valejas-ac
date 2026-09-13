import type { Metadata } from "next";
import Link from "next/link";
import CTASocio from "@/components/CTASocio";
import {
  ORGAOS, MANDATO, MOSTRAR_NUMERO_SOCIO, anosDeSocio, iniciais,
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-on-surface/10">
              {efetivos.map((m) => (
                <CartaoMembro key={`${orgao.id}-${m.cargo}`} membro={m} />
              ))}
            </div>

            {suplentes.length > 0 && (
              <div className="mt-10">
                <h3 className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-on-surface-muted border-b border-on-surface/10 pb-3 mb-6">
                  Suplentes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-on-surface/10">
                  {suplentes.map((m) => (
                    <CartaoMembro key={`${orgao.id}-${m.cargo}`} membro={m} />
                  ))}
                </div>
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

function CartaoMembro({ membro }: { membro: Membro }) {
  const anos = anosDeSocio(membro.desde);

  return (
    <article className="bg-surface-high hover:bg-surface-highest transition-colors duration-300 group">
      {/* Retrato — iniciais enquanto não houver fotografias */}
      <div className="relative aspect-square bg-gradient-to-b from-blue-deep to-surface-low flex items-center justify-center">
        <span
          aria-hidden
          className="font-headline font-black text-5xl text-white/20 group-hover:text-yellow/30 transition-colors duration-300"
        >
          {iniciais(membro.nome)}
        </span>
      </div>

      <div className="p-4">
        <p className="font-body text-[0.7rem] font-semibold uppercase tracking-widest text-yellow">
          {membro.cargo}
        </p>
        <p className="font-headline font-black uppercase text-base text-on-surface leading-tight mt-1">
          {membro.nome}
        </p>
        <p className="font-body text-xs text-on-surface-muted mt-1.5">
          Sócio desde {membro.desde}
          <span className="text-on-surface-muted">
            {" "}· {anos} {anos === 1 ? "ano" : "anos"}
          </span>
          {MOSTRAR_NUMERO_SOCIO && <> · N.º {membro.numero}</>}
        </p>
      </div>
    </article>
  );
}
