"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const MODALIDADES = [
  {
    slug:    "futsal",
    label:   "Futsal",
    tag:     "Desporto Principal",
    desc:    "A âncora identitária do clube. Velocidade, precisão e energia implacável.",
    titles:  14,
    accent:  "bg-yellow",
    textOn:  "text-black",
    featured: true,
  },
  {
    slug:    "ciclismo",
    label:   "Ciclismo",
    tag:     "Modalidade",
    desc:    "Velocidade nas estradas da região.",
    titles:  3,
    accent:  "bg-blue",
    textOn:  "text-white",
    featured: false,
  },
  {
    slug:    "cicloturismo",
    label:   "Cicloturismo",
    tag:     "Modalidade",
    desc:    "Percursos, comunidade e natureza.",
    titles:  0,
    accent:  "bg-blue-deep",
    textOn:  "text-white",
    featured: false,
  },
  {
    slug:    "kung-fu",
    label:   "Kung Fu",
    tag:     "Modalidade",
    desc:    "Disciplina, foco e arte marcial.",
    titles:  2,
    accent:  "bg-red",
    textOn:  "text-white",
    featured: false,
  },
  {
    slug:    "danca",
    label:   "Dança",
    tag:     "Modalidade",
    desc:    "Movimento, expressão e criatividade.",
    titles:  1,
    accent:  "bg-surface-high",
    textOn:  "text-on-surface",
    featured: false,
  },
  {
    slug:    "yoga",
    label:   "Yoga",
    tag:     "Modalidade",
    desc:    "Equilíbrio, respiração e bem-estar.",
    titles:  0,
    accent:  "bg-surface-high",
    textOn:  "text-on-surface",
    featured: false,
  },
];

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

  const featured = MODALIDADES.find((m) => m.featured)!;
  const rest     = MODALIDADES.filter((m) => !m.featured);

  return (
    <section ref={sectionRef} className="bg-surface-low py-20 md:py-28 bg-texture">
      <div className="section-container">

        {/* Header */}
        <div className="mb-10">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-yellow mb-3">
            As Nossas Modalidades
          </p>
          <h2 className="section-title">
            Um Clube, <span>Seis Paixões</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-px bg-on-surface/10">

          {/* Futsal — featured, double width */}
          <Link
            href={`/modalidades/${featured.slug}`}
            className="modalidade-card md:col-span-2 lg:col-span-2 group relative overflow-hidden bg-surface-highest min-h-[280px] flex flex-col justify-between p-6 md:p-8"
          >
            {/* Accent top bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${featured.accent}`} />

            <div>
              <span className="font-body text-xs font-bold uppercase tracking-widest text-yellow">
                {featured.tag}
              </span>
              <h3 className="font-headline font-black text-3xl md:text-4xl text-on-surface mt-2 leading-none uppercase group-hover:text-yellow transition-colors duration-300">
                {featured.label}
              </h3>
              <p className="font-body text-sm text-on-surface-muted mt-3 leading-relaxed">
                {featured.desc}
              </p>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <span className="font-headline font-black text-5xl text-yellow">{featured.titles}</span>
                <p className="font-body text-xs text-on-surface-muted uppercase tracking-widest">Títulos</p>
              </div>
              <div className="w-10 h-10 bg-yellow flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ArrowUpRight size={18} className="text-black" />
              </div>
            </div>
          </Link>

          {/* Remaining modalidades */}
          {rest.map((m) => (
            <Link
              key={m.slug}
              href={`/modalidades/${m.slug}`}
              className="modalidade-card group relative overflow-hidden bg-surface-highest min-h-[200px] flex flex-col justify-between p-5"
            >
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${m.accent}`} />

              <div>
                <span className="font-body text-[10px] font-bold uppercase tracking-widest text-on-surface-muted">
                  {m.tag}
                </span>
                <h3 className="font-headline font-black text-xl text-on-surface mt-1 leading-none uppercase group-hover:text-yellow transition-colors duration-300">
                  {m.label}
                </h3>
              </div>

              <div className="flex items-end justify-between">
                {m.titles > 0 ? (
                  <div>
                    <span className="font-headline font-black text-2xl text-yellow">{m.titles}</span>
                    <p className="font-body text-[10px] text-on-surface-muted uppercase tracking-widest">Títulos</p>
                  </div>
                ) : (
                  <span className="font-body text-xs text-on-surface-muted">Sem títulos</span>
                )}
                <ArrowUpRight size={14} className="text-on-surface-muted group-hover:text-yellow transition-colors duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
