"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { MODALIDADES } from "@/lib/data/modalidades";

gsap.registerPlugin(ScrollTrigger);

const GRUPO_LABEL: Record<string, string> = {
  competicao: "Competição",
  comunidade: "Comunidade",
};
// Barra de acento por grupo: competição = amarelo, comunidade = azul.
const GRUPO_ACCENT: Record<string, string> = {
  competicao: "bg-yellow",
  comunidade: "bg-blue",
};

export default function ModalidadesGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".modalidade-card",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const featured = MODALIDADES.find((m) => m.slug === "futsal") ?? MODALIDADES[0];
  const rest     = MODALIDADES.filter((m) => m.slug !== featured.slug);

  return (
    <section ref={sectionRef} className="bg-surface-low py-28 md:py-40 bg-texture">
      <div className="section-container">

        {/* Header */}
        <div className="mb-10">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-yellow mb-3">
            As nossas modalidades
          </p>
          <h2 className="section-title">
            Um clube, <span>muitas formas de pertencer</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-px bg-on-surface/10">

          {/* Futsal — featured, double width */}
          <Link
            href={`/modalidades#${featured.slug}`}
            className="modalidade-card md:col-span-2 lg:col-span-2 group relative overflow-hidden bg-surface-highest min-h-[280px] flex flex-col justify-between p-6 md:p-8"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 ${GRUPO_ACCENT[featured.grupo]}`} />

            <div>
              <span className="font-body text-xs font-bold uppercase tracking-widest text-yellow">
                {GRUPO_LABEL[featured.grupo]}
              </span>
              <h3 className="font-headline font-black text-3xl md:text-4xl text-on-surface mt-2 leading-none uppercase group-hover:text-yellow transition-colors duration-300">
                {featured.nome}
              </h3>
              <p className="font-body text-sm text-on-surface-muted mt-3 leading-relaxed">
                {featured.tagline}. {featured.publico}.
              </p>
            </div>

            <div className="flex items-end justify-between">
              <span className="font-body text-xs text-on-surface-muted uppercase tracking-widest">
                Ver plantel e escalões
              </span>
              <div className="w-10 h-10 bg-yellow flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ArrowUpRight size={18} className="text-blue-deep" />
              </div>
            </div>
          </Link>

          {/* Restantes modalidades */}
          {rest.map((m) => (
            <Link
              key={m.slug}
              href={`/modalidades#${m.slug}`}
              className="modalidade-card group relative overflow-hidden bg-surface-highest min-h-[200px] flex flex-col justify-between p-5"
            >
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${GRUPO_ACCENT[m.grupo]}`} />

              <div>
                <span className="font-body text-[10px] font-bold uppercase tracking-widest text-on-surface-muted">
                  {GRUPO_LABEL[m.grupo]}
                </span>
                <h3 className="font-headline font-black text-xl text-on-surface mt-1 leading-none uppercase group-hover:text-yellow transition-colors duration-300">
                  {m.nome}
                </h3>
              </div>

              <div className="flex items-end justify-between">
                <span className="font-body text-xs text-on-surface-muted">{m.tagline}</span>
                <ArrowUpRight size={14} className="text-on-surface-muted group-hover:text-yellow transition-colors duration-300 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
