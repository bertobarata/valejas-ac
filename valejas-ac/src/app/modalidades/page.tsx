import type { Metadata } from "next";
import Link from "next/link";
import { GRUPOS, getModalidadesPorGrupo } from "@/lib/data/modalidades";

export const metadata: Metadata = {
  title: "Modalidades",
  description:
    "Futebol e futsal federados, mais aulas de comunidade — um clube, muitas formas de pertencer.",
};

export default function ModalidadesPage() {
  return (
    <div className="bg-surface">
      {/* Cabeçalho */}
      <section className="section-container pt-24 md:pt-32 pb-6">
        <p className="font-body text-xs font-bold uppercase tracking-widest text-blue mb-3">
          Um clube, muitas idades
        </p>
        <h1 className="font-display text-4xl md:text-6xl text-on-surface max-w-3xl">
          Há um lugar para ti no Valejas
        </h1>
        <p className="font-body text-lg text-on-surface-muted mt-4 max-w-2xl">
          Do campo ao pavilhão, da estrada ao estúdio. Competição federada e aulas
          abertas à comunidade, dos mais novos aos mais crescidos.
        </p>
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
              <h2 className="font-display text-3xl md:text-4xl text-on-surface">
                {grupo.titulo}
              </h2>
              <p className="font-body text-on-surface-muted mt-2 max-w-2xl">
                {grupo.intro}
              </p>
            </div>

            <div className="flex flex-col divide-y divide-on-surface/10">
              {itens.map((m) => (
                <article
                  key={m.slug}
                  id={m.slug}
                  className="grid md:grid-cols-[auto_1fr_auto] gap-x-10 gap-y-3 py-7 items-baseline scroll-mt-24"
                >
                  <h3 className="font-display text-2xl md:text-3xl text-on-surface md:w-56">
                    {m.nome}
                  </h3>
                  <div className="max-w-prose">
                    <p className="font-display text-lg text-blue">{m.tagline}</p>
                    <p className="font-body text-on-surface-muted leading-relaxed mt-1.5">
                      {m.descricao}
                    </p>
                    <p className="font-body text-xs uppercase tracking-widest text-on-surface-muted mt-3">
                      {m.publico}
                    </p>
                  </div>
                  {m.ancora && (
                    <Link
                      href="/equipas"
                      className="btn-ghost shrink-0 self-start whitespace-nowrap text-sm"
                    >
                      Ver plantel
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </section>
        );
      })}

      {/* CTA final */}
      <section className="section-container pb-24 md:pb-32">
        <div className="bg-blue text-white p-8 md:p-10 flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
          <p className="font-display text-xl md:text-2xl max-w-lg">
            Queres experimentar? Fala connosco e trazemos-te para dentro.
          </p>
          <Link
            href="/socios-contacto"
            className="btn-primary shrink-0 bg-yellow text-blue-deep hover:bg-yellow-dim"
          >
            Inscrever ou saber mais
          </Link>
        </div>
      </section>
    </div>
  );
}
