"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Calendar } from "lucide-react";
import { ARTIGOS, formatData } from "@/lib/data/noticias";

gsap.registerPlugin(ScrollTrigger);

/**
 * As notícias vêm de @/lib/data/noticias — antes havia aqui uma segunda
 * lista, escrita à mão, que duplicava a primeira e nem sequer usava os
 * mesmos slugs. Duas fontes para a mesma coisa acabam sempre a divergir.
 *
 * Sem notícias, esta secção não aparece de todo. Uma homepage sem a
 * banda de notícias é melhor do que uma banda de notícias vazia.
 */
const NEWS = ARTIGOS.map((a) => ({
  id:       a.slug,
  category: a.categoria,
  title:    a.titulo,
  excerpt:  a.excerto,
  date:     formatData(a.data),
  href:     "/noticias",
  featured: a.destaque,
}));

const CAT_COLOUR: Record<string, string> = {
  Resultados: "bg-yellow text-black",
  Mercado:    "bg-blue text-white",
  Clube:      "bg-surface-highest text-on-surface",
  Entrevista: "bg-surface-highest text-on-surface",
  Comunicado: "bg-red text-white",
};

export default function NewsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef   = useRef<HTMLDivElement>(null);
  const temNoticias = NEWS.length > 0;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(
        ".news-title",
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      // Cards stagger
      gsap.fromTo(
        ".news-card",
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 85%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const featured = NEWS.find((n) => n.featured) ?? NEWS[0];
  const secondary = NEWS.filter((n) => !n.featured);

  if (!temNoticias || !featured) return null;

  return (
    <section ref={sectionRef} className="bg-surface py-28 md:py-40">
      <div className="section-container">

        {/* Header — editorial bar */}
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-on-surface/10">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-red mb-2">
              Últimas do clube
            </p>
            <h2 className="news-title section-title">
              Notícias do <span>Clube</span>
            </h2>
          </div>
          <Link
            href="/noticias"
            className="hidden md:inline-flex items-center gap-2 font-headline font-black text-xs text-red hover:text-yellow transition-colors duration-200 uppercase tracking-widest"
          >
            Todas as notícias <ArrowRight size={14} />
          </Link>
        </div>

        {/* The Athletic layout: 8-col featured + 4-col stacked secondary */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-12 gap-0">

          {/* ── Featured article — 8 cols, tall, immersive ── */}
          <Link
            href={featured.href}
            className="news-card lg:col-span-8 relative overflow-hidden group block min-h-[420px] lg:min-h-[520px] bg-surface-high"
          >
            {/* Background */}
            <div className="absolute inset-0">
              <div className="w-full h-full bg-gradient-to-br from-blue-deep/80 to-surface-mid" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

            {/* Watermark "V" */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <span className="font-headline font-black text-[30rem] text-white leading-none">V</span>
            </div>

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              {/* Category badge */}
              <span className={`inline-block font-body text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4 ${CAT_COLOUR[featured.category] ?? "bg-surface-high text-on-surface"}`}>
                {featured.category}
              </span>

              <h3 className="font-headline font-black text-3xl md:text-5xl text-white leading-[0.95] tracking-tighter mb-4 group-hover:text-yellow transition-colors duration-300 max-w-2xl uppercase">
                {featured.title}
              </h3>
              <p className="font-body text-base text-white/85 leading-relaxed max-w-xl hidden md:block">
                {featured.excerpt}
              </p>

              <div className="flex items-center gap-4 mt-6">
                <span className="flex items-center gap-1.5 font-body text-xs text-white/85">
                  <Calendar size={12} />
                  {featured.date}
                </span>
                <span className="inline-flex items-center gap-2 font-headline font-black text-xs uppercase tracking-wider text-yellow group-hover:gap-3 transition-all duration-300">
                  Ler artigo <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>

          {/* ── Secondary articles — 4 cols, stacked, text-forward ── */}
          <div className="lg:col-span-4 flex flex-col divide-y divide-on-surface/10 border-l border-on-surface/10">
            {secondary.map((article, i) => (
              <Link
                key={article.id}
                href={article.href}
                className="news-card flex-1 group bg-surface-high hover:bg-surface-highest transition-colors duration-300 block p-6 lg:p-7 flex flex-col justify-center"
              >
                {/* Category + date row */}
                <div className="flex items-center gap-3 mb-3">
                  <span className={`font-body text-xs font-bold uppercase tracking-widest px-2 py-0.5 ${CAT_COLOUR[article.category] ?? "bg-surface-highest text-on-surface"}`}>
                    {article.category}
                  </span>
                  <span className="font-body text-xs text-on-surface-muted">
                    {article.date}
                  </span>
                </div>

                {/* Title — bigger, editorial */}
                <h3 className="font-headline font-black text-lg lg:text-xl uppercase leading-tight tracking-tighter text-on-surface group-hover:text-yellow transition-colors duration-300">
                  {article.title}
                </h3>

                {/* Excerpt — only on larger secondary cards */}
                <p className="font-body text-sm text-on-surface-muted leading-relaxed mt-2 line-clamp-2 hidden lg:block">
                  {article.excerpt}
                </p>

                {/* Read arrow */}
                <div className="mt-3 flex items-center gap-1.5">
                  <ArrowRight
                    size={12}
                    className="text-on-surface-muted group-hover:text-red group-hover:translate-x-1 transition-all duration-300"
                  />
                  <span className="font-body text-xs font-bold uppercase tracking-widest text-on-surface-muted group-hover:text-red transition-colors duration-300">
                    Ler mais
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 md:hidden text-center">
          <Link href="/noticias" className="btn-ghost text-sm">
            Todas as notícias <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
