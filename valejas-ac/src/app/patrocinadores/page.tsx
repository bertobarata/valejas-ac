import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  TIPOS, apoiosPorTipo, iniciaisApoio, type Apoio,
} from "@/lib/data/patrocinadores";
import { MOTE } from "@/lib/data/clube";

export const metadata: Metadata = {
  title: "Patrocinadores e Parcerias",
  description:
    "Quem apoia o Valejas Atlético Clube — patrocinador principal, apoios institucionais e o comércio local da freguesia de Barcarena.",
};

export default function PatrocinadoresPage() {
  return (
    <div className="bg-surface">
      {/* Cabeçalho */}
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-20 md:py-28">
          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            {MOTE.caixaAlta}
          </p>
          <h1 className="section-title text-5xl md:text-7xl">
            Quem apoia o <span>clube</span>
          </h1>
          <p className="font-body text-lg text-on-surface-muted mt-5 max-w-2xl leading-relaxed">
            Um clube de bairro não se sustenta sozinho. Estas são as casas e as
            instituições que põem o ombro — umas vestem as equipas, outras abrem
            portas, outras simplesmente não deixam cair.
          </p>
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
                {tipo.titulo}
              </h2>
              <p className="font-body text-on-surface-muted mt-2">{tipo.intro}</p>
            </div>

            <div
              className={`grid gap-px bg-on-surface/10 ${
                tipo.id === "principal"
                  ? "grid-cols-1"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {itens.map((a) => (
                <CartaoApoio key={a.nome} apoio={a} destaque={tipo.id === "principal"} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Tornar-se apoiante */}
      <section className="section-container pb-20 md:pb-28">
        <div className="section-dark bg-blue text-white p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="max-w-xl">
            <h2 className="font-headline font-black uppercase text-2xl md:text-3xl tracking-tight">
              Quer apoiar o Valejas?
            </h2>
            <p className="font-body text-white/80 leading-relaxed mt-2">
              Há muitas formas de dar a mão a um clube com {new Date().getFullYear() - 1966} anos
              — do equipamento de um escalão ao lanche de um convívio. Fale com a Direção.
            </p>
          </div>
          <Link
            href="/contactos"
            className="btn-primary shrink-0 bg-yellow text-blue-deep hover:bg-yellow-dim text-sm"
          >
            Falar com a Direção
          </Link>
        </div>
      </section>
    </div>
  );
}

function CartaoApoio({ apoio, destaque }: { apoio: Apoio; destaque: boolean }) {
  const conteudo = (
    <>
      {/* Logótipo — iniciais enquanto não houver ficheiros */}
      <div
        className={`flex items-center justify-center bg-gradient-to-b from-blue-deep to-surface-low ${
          destaque ? "h-48 md:h-56" : "aspect-[16/9]"
        }`}
      >
        <span
          aria-hidden
          className={`font-headline font-black text-white/25 group-hover:text-yellow/40 transition-colors duration-300 ${
            destaque ? "text-7xl md:text-8xl" : "text-5xl"
          }`}
        >
          {iniciaisApoio(apoio.nome)}
        </span>
      </div>

      <div className={destaque ? "p-7 md:p-9" : "p-6"}>
        <h3
          className={`font-headline font-black uppercase text-on-surface leading-tight ${
            destaque ? "text-2xl md:text-3xl" : "text-lg"
          }`}
        >
          {apoio.nome}
        </h3>
        <p className="font-body text-on-surface-muted leading-relaxed mt-2">
          {apoio.descricao}
        </p>
        {apoio.url && (
          <span className="inline-flex items-center gap-1.5 font-body text-sm text-yellow mt-4">
            Visitar <ExternalLink size={14} />
          </span>
        )}
      </div>
    </>
  );

  const classes =
    "bg-surface-high hover:bg-surface-highest transition-colors duration-300 group block";

  return apoio.url ? (
    <a href={apoio.url} target="_blank" rel="noopener noreferrer" className={classes}>
      {conteudo}
    </a>
  ) : (
    <article className={classes}>{conteudo}</article>
  );
}
