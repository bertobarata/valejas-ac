import type { Metadata } from "next";
import Link from "next/link";
import CTASocio from "@/components/CTASocio";
import { ExternalLink } from "lucide-react";
import {
  TIPOS, apoiosPorTipo, type Apoio,
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

      <CTASocio variante="discreto" />
    </div>
  );
}

/** O patrocinador principal é o único que ganha tratamento próprio. */
function ApoioPrincipal({ apoio }: { apoio: Apoio }) {
  const conteudo = (
    <>
      <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-yellow">
        Veste o clube
      </p>
      <h3 className="font-headline font-black uppercase text-4xl md:text-6xl tracking-tighter wdth-condensed text-on-surface mt-2 leading-none">
        {apoio.nome}
      </h3>
      <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-4 max-w-xl">
        {apoio.descricao}
      </p>
      {apoio.url && (
        <span className="inline-flex items-center gap-1.5 font-body text-sm text-yellow mt-5">
          Visitar a loja oficial <ExternalLink size={14} />
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
 * a moldura só sublinhava a ausência. Quando houver ficheiros reais,
 * é aqui que entram.
 * ─────────────────────────────────────────────────────────────────
 */
function ApoioLinha({ apoio }: { apoio: Apoio }) {
  const conteudo = (
    <div className="grid grid-cols-1 sm:grid-cols-[16rem_1fr] sm:items-baseline gap-x-8 gap-y-1 py-5">
      <span className="font-headline font-black uppercase text-lg md:text-xl text-on-surface leading-tight">
        {apoio.nome}
      </span>
      <span className="font-body text-on-surface-muted leading-relaxed">
        {apoio.descricao}
      </span>
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

