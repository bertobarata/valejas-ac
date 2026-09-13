import type { Metadata } from "next";
import Link from "next/link";
import { getComunicados, type Comunicado } from "@/lib/data/comunicados";
import { fetchComunicados } from "@/sanity/queries";
import CTASocio from "@/components/CTASocio";

// ISR: comunicados frescos sem rebuild (quando ligado ao Sanity)
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Comunicados Oficiais",
  description:
    "Comunicados e notas oficiais da Direção do Valejas Atlético Clube.",
};

const CANAL_LABEL: Record<string, string> = {
  site: "Site",
  facebook: "Facebook",
  instagram: "Instagram",
};

export default async function ComunicadosPage() {
  // Tenta Sanity; sem CMS configurado, usa mocks (demo).
  const sanity = (await fetchComunicados()) as Comunicado[] | null;
  const comunicados = sanity ?? getComunicados();

  return (
    <section className="bg-surface py-24 md:py-32">
      <div className="section-container max-w-4xl">
        <header className="mb-14">
          <p className="font-body text-xs font-bold uppercase tracking-widest text-yellow mb-3">
            Direção
          </p>
          <h1 className="font-display text-4xl md:text-6xl text-on-surface">
            Comunicados Oficiais
          </h1>
        </header>

        <div className="flex flex-col divide-y divide-on-surface/10">
          {comunicados.map((c) => (
            <article
              key={c.slug}
              className="py-8 first:pt-0"
            >
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <time className="font-body text-xs uppercase tracking-widest text-on-surface-muted">
                  {new Date(c.data).toLocaleDateString("pt-PT", {
                    day: "2-digit", month: "long", year: "numeric",
                  })}
                </time>
                {c.canais
                  ?.filter((canal) => canal !== "site")
                  .map((canal) => (
                    <span
                      key={canal}
                      className="font-body text-xs font-bold uppercase tracking-widest text-yellow border border-yellow/40 px-2 py-0.5"
                    >
                      {CANAL_LABEL[canal] ?? canal}
                    </span>
                  ))}
              </div>

              <h2 className="font-headline font-black uppercase text-2xl md:text-3xl tracking-tight text-on-surface mb-3">
                <Link
                  href={`/comunicados/${c.slug}`}
                  className="hover:text-yellow transition-colors duration-200"
                >
                  {c.titulo}
                </Link>
              </h2>

              <p className="font-body text-on-surface-muted leading-relaxed">
                {c.corpo?.[0]}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <Link
                  href={`/comunicados/${c.slug}`}
                  className="btn-ghost text-sm"
                >
                  Ler comunicado
                </Link>
                <span className="font-body text-sm text-on-surface-muted">
                  {c.autor}
                </span>
              </div>
            </article>
          ))}

          {comunicados.length === 0 && (
            <p className="font-body text-on-surface-muted">
              Ainda não há comunicados publicados.
            </p>
          )}
        </div>
      </div>

      <CTASocio
        titulo="Não percas nada"
        texto="Os comunicados saem primeiro aqui. Sócio por 1 € por mês — e o clube ganha mais uma voz."
      />
    </section>
  );
}
