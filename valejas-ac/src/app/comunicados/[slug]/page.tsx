import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getComunicados, type Comunicado } from "@/lib/data/comunicados";
import { fetchComunicados } from "@/sanity/queries";
import CTASocio from "@/components/CTASocio";

/**
 * PÁGINA DE UM COMUNICADO
 * ─────────────────────────────────────────────────────────────────
 * Esta rota não é opcional: `/api/direcao/publicar` constrói
 * `/comunicados/<slug>` como `urlSite`, mostra-o ao Presidente como
 * "ver comunicado" e envia-o na legenda que vai para o Facebook e o
 * Instagram. Sem esta página, o clube estava a publicar links mortos
 * nas suas próprias redes.
 * ─────────────────────────────────────────────────────────────────
 */

export const revalidate = 60;

async function obter(slug: string): Promise<Comunicado | null> {
  const doSanity = (await fetchComunicados()) as Comunicado[] | null;
  const lista = doSanity ?? getComunicados();
  return lista.find((c) => c.slug === slug) ?? null;
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const c = await obter(params.slug);
  if (!c) return { title: "Comunicado não encontrado" };

  return {
    title: c.titulo,
    description: c.resumoRedes || c.corpo[0]?.slice(0, 160),
    openGraph: {
      title: c.titulo,
      description: c.resumoRedes || c.corpo[0]?.slice(0, 160),
      type: "article",
      publishedTime: c.data,
      images: [
        `/api/comunicado-imagem?titulo=${encodeURIComponent(c.titulo)}` +
        `&data=${encodeURIComponent(c.data.slice(0, 10))}`,
      ],
    },
  };
}

export default async function ComunicadoPage({
  params,
}: {
  params: { slug: string };
}) {
  const c = await obter(params.slug);
  if (!c) notFound();

  const data = new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit", month: "long", year: "numeric", timeZone: "Europe/Lisbon",
  }).format(new Date(c.data));

  return (
    <div className="bg-surface">
      <header className="section-dark bg-blue text-white bg-texture">
        <div className="section-container py-14 md:py-20 max-w-3xl">
          <Link
            href="/comunicados"
            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest text-white/85 hover:text-yellow transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Comunicados
          </Link>

          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            Comunicado oficial
          </p>
          <h1 className="font-headline font-black uppercase text-3xl md:text-5xl leading-none tracking-tighter wdth-condensed">
            {c.titulo}
          </h1>
          <p className="font-body text-sm text-white/85 mt-6">
            {data} · {c.autor}
          </p>
        </div>
      </header>

      <article className="section-container py-12 md:py-16 max-w-3xl">
        {c.corpo.map((paragrafo, i) => (
          <p
            key={i}
            className="font-body text-lg text-on-surface-muted leading-relaxed mb-5"
          >
            {paragrafo}
          </p>
        ))}

        <p className="font-headline font-black uppercase text-base text-on-surface mt-10 pt-8 border-t border-on-surface/15">
          {c.autor}
        </p>
      </article>

      <CTASocio variante="discreto" />
    </div>
  );
}
