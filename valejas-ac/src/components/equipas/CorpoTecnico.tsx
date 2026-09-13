"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STAFF = [
  { role: "Treinador Adjunto", name: "Carlos Raposo"  },
  { role: "Prep. Físico",      name: "Hugo Mendes"    },
  { role: "Fisioterapeuta",    name: "Ana Pereira"     },
];

export default function CorpoTecnico() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".corpo-tecnico-content > *",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
      gsap.fromTo(
        ".corpo-tecnico-photo",
        { scale: 1.05, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-surface-low py-24 md:py-32">
      <div className="section-container">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">

          {/* Left — text + staff list */}
          <div className="lg:w-1/3 corpo-tecnico-content space-y-6">
            <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-blue">
              O Estratego
            </p>
            <h2 className="font-headline font-black text-6xl md:text-7xl uppercase leading-none tracking-tighter text-on-surface">
              Corpo{" "}
              <span className="text-yellow block">Técnico</span>
            </h2>
            <p className="font-body text-base text-on-surface-muted leading-relaxed">
              A mente por trás da tática. Liderança, disciplina e a visão necessária para
              levar Valejas ao topo do Futsal nacional.
            </p>

            {/* Staff list */}
            <div className="space-y-5 pt-4">
              {STAFF.map((s) => (
                <div
                  key={s.name}
                  className="flex justify-between items-end border-b border-on-surface/10 pb-4"
                >
                  <span className="font-body text-xs font-bold uppercase text-on-surface-muted tracking-widest">
                    {s.role}
                  </span>
                  <span className="font-headline font-black text-lg uppercase text-on-surface">
                    {s.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Center — coach photo */}
          <div className="lg:flex-1 flex items-center justify-center corpo-tecnico-photo">
            <div className="relative w-full max-w-xs">
              {/* Photo placeholder */}
              <div className="aspect-[3/4] bg-surface-high flex items-end justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-surface-highest to-surface-mid" />
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <span className="font-headline font-black text-[8rem] text-on-surface">MR</span>
                </div>
              </div>
              {/* Name badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-yellow p-4">
                <p className="font-body text-[9px] uppercase tracking-widest text-black/60">Treinador Principal</p>
                <p className="font-headline font-black text-xl uppercase text-black">Marco Reus</p>
              </div>
            </div>
          </div>

          {/* Right — quote */}
          <div className="lg:w-1/3 flex items-center corpo-tecnico-content">
            <div>
              <div className="text-5xl text-yellow font-headline leading-none mb-4">"</div>
              <blockquote className="font-headline font-black text-xl md:text-2xl uppercase leading-tight text-on-surface mb-6">
                Não jogamos apenas para ganhar. Jogamos para honrar a história
                desta terra. Cada segundo em campo é pelo clube e pela nossa gente.
              </blockquote>
              <p className="font-body text-xs text-on-surface-muted uppercase tracking-widest">
                Marco Reus — Temporada 2024/25
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
