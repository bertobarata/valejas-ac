"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    title: "Movimento",
    desc:  "Inspirada na dinâmica do futebol total, a nossa diagonal nunca está estática.",
  },
  {
    title: "Identidade",
    desc:  "Corta o azul e o amarelo para lembrar que a paixão (vermelho) une tudo.",
  },
  {
    title: "Resiliência",
    desc:  "Uma marca indelével que resiste ao tempo e às adversidades.",
  },
];

export default function FaixaSagrada() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Diagonal strip reveal
      gsap.fromTo(
        ".diagonal-strip-anim",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1, duration: 1.4, ease: "power4.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        }
      );
      // Title reveal
      gsap.fromTo(
        ".faixa-title",
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        }
      );
      // Cards stagger
      gsap.fromTo(
        ".faixa-card",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: ".faixa-cards", start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 md:py-40 bg-surface overflow-hidden">
      {/* Diagonal red strip background */}
      <div
        className="diagonal-strip-anim absolute inset-0 pointer-events-none z-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(135deg, transparent 40%, rgba(212,21,12,0.06) 40%, rgba(212,21,12,0.06) 60%, transparent 60%)",
        }}
      />

      <div className="section-container relative z-10">
        {/* Headline */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="faixa-title font-headline font-black italic text-7xl md:text-9xl uppercase tracking-tighter leading-none mb-4">
            Faixa{" "}
            <span
              className="text-red"
              style={{ filter: "drop-shadow(0 0 15px rgba(212,21,12,0.4))" }}
            >
              Sagrada
            </span>
          </h2>
          <p className="font-body text-xl text-on-surface-muted font-light">
            A diagonal que corta o peito é a nossa linhagem de sangue.
          </p>
        </div>

        {/* Pillars */}
        <div className="faixa-cards grid grid-cols-1 md:grid-cols-3 gap-px bg-on-surface/10">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="faixa-card group bg-surface-high p-10 md:p-12 flex flex-col items-center text-center hover:bg-red transition-colors duration-500 cursor-default"
            >
              <h3 className="font-headline font-black text-3xl md:text-4xl uppercase tracking-tighter text-on-surface group-hover:text-white mb-5 transition-colors duration-500">
                {p.title}
              </h3>
              <p className="font-body text-on-surface-muted group-hover:text-white/80 leading-relaxed transition-colors duration-500">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
