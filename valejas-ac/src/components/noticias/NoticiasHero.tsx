"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, Calendar, User } from "lucide-react";
import { formatData, type Artigo } from "@/lib/data/noticias";

gsap.registerPlugin();

interface Props {
  artigo?: Artigo;
}

export default function NoticiasHero({ artigo }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".noticias-hero-content > *",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.2 }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-surface pt-28 pb-0">
      <div className="section-container">

        {/* Page header */}
        <div className="pt-8 pb-10 border-b border-on-surface/10">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.35em] text-yellow mb-3">
            Notícias do Clube
          </p>
          <h1 className="font-headline font-black text-6xl md:text-8xl uppercase leading-none tracking-tighter text-on-surface">
            Notícias &{" "}
            <span className="text-yellow">Comunicados</span>
          </h1>
        </div>

        {/* Featured article */}
        {artigo && (
          <Link
            href={`/noticias/${artigo.slug}`}
            className="group block mt-10 grid grid-cols-1 lg:grid-cols-12 gap-0 bg-surface-high overflow-hidden hover:bg-surface-highest transition-colors duration-300"
          >
            {/* Image */}
            <div className="lg:col-span-7 relative overflow-hidden min-h-[300px] lg:min-h-[420px] bg-surface-mid">
              {artigo.imagemUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={artigo.imagemUrl}
                  alt={artigo.titulo}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-deep/60 to-surface" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <span className="font-headline font-black text-[10rem] text-yellow leading-none">V</span>
                  </div>
                </>
              )}
              {/* Categoria badge */}
              <div className="absolute top-5 left-5">
                <span className="font-body text-[10px] font-bold uppercase tracking-widest bg-red text-white px-3 py-1">
                  {artigo.categoria}
                </span>
              </div>
            </div>

            {/* Text */}
            <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between noticias-hero-content">
              <div className="space-y-4">
                <span className="font-body text-[10px] font-bold uppercase tracking-widest text-yellow">
                  Em Destaque
                </span>
                <h2 className="font-headline font-black text-3xl md:text-4xl uppercase leading-tight tracking-tighter text-on-surface group-hover:text-yellow transition-colors duration-300">
                  {artigo.titulo}
                </h2>
                <p className="font-body text-base text-on-surface-muted leading-relaxed">
                  {artigo.excerto}
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex flex-wrap gap-4 text-on-surface-muted">
                  <span className="flex items-center gap-1.5 font-body text-xs">
                    <Calendar size={12} className="text-yellow" />
                    {formatData(artigo.data)}
                  </span>
                  <span className="flex items-center gap-1.5 font-body text-xs">
                    <User size={12} className="text-yellow" />
                    {artigo.autor}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 font-headline font-black text-sm uppercase tracking-wider text-yellow border-b border-yellow pb-0.5 group-hover:gap-3 transition-all duration-300">
                  Ler artigo <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
