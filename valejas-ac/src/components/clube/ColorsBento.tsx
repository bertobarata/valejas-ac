"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ColorsBento() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bento-block",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-surface-dim py-24">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-on-surface/10 auto-rows-fr">

          {/* Amarelo — bloco principal */}
          <div className="bento-block md:col-span-7 bg-yellow p-10 md:p-14 flex flex-col justify-end relative overflow-hidden min-h-[320px] md:min-h-[420px] cursor-default">
            <div>
              <p className="font-body text-[9px] font-bold uppercase tracking-[0.4em] text-black/40 mb-3">01. Cor principal</p>
              <h3 className="font-headline font-black text-6xl md:text-7xl uppercase tracking-tighter text-black mb-4">
                Amarelo
              </h3>
              <p className="font-body text-black/80 text-lg max-w-lg leading-relaxed">
                A cor do clube. O amarelo da camisola que veste gerações de valejenses
                desde 1966 — quente, vibrante e inconfundível no campo.
              </p>
              <p className="font-body font-bold text-sm text-black/40 mt-4 font-mono">#FADB09</p>
            </div>
          </div>

          {/* Azul */}
          <div className="bento-block md:col-span-5 bg-blue p-10 md:p-12 flex flex-col justify-between min-h-[320px] md:min-h-[420px] cursor-default">
            <span className="font-headline font-black text-white/30 text-2xl">02.</span>
            <div>
              <h3 className="font-headline font-black text-4xl md:text-5xl uppercase tracking-tighter text-white mb-3">
                Azul
              </h3>
              <p className="font-body text-white/70 leading-relaxed">
                A lealdade e a serenidade de quem representa Valejas dentro e fora das
                quatro linhas. A profundidade do nosso compromisso com a comunidade.
              </p>
              <p className="font-body font-bold text-xs text-white/30 mt-4 font-mono">#1554BB</p>
            </div>
          </div>

          {/* As nossas cores — texto */}
          <div className="bento-block md:col-span-12 bg-surface-highest p-10 md:p-12 flex items-center">
            <div className="max-w-2xl">
              <h4 className="font-headline font-black text-2xl uppercase text-yellow mb-5">
                As nossas cores
              </h4>
              <p className="font-body text-on-surface-muted leading-relaxed">
                Amarelo e azul — as cores do Valejas Atlético Clube desde 1966,
                vestidas com orgulho por sócios, atletas e adeptos. Simples e honestas,
                como a terra que representam.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
