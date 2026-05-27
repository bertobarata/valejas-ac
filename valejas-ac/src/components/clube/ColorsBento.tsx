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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-on-surface/10 auto-rows-fr md:h-[700px]">

          {/* Electric Yellow — hero block */}
          <div className="bento-block md:col-span-8 bg-yellow p-10 md:p-14 flex flex-col justify-end relative overflow-hidden group cursor-default">
            {/* Lightning bolt watermark */}
            <div className="absolute top-6 right-8 text-black/10 text-[10rem] font-headline font-black leading-none select-none pointer-events-none">
              ⚡
            </div>
            <div>
              <p className="font-body text-[9px] font-bold uppercase tracking-[0.4em] text-black/40 mb-3">01. Primary</p>
              <h3 className="font-headline font-black text-6xl md:text-7xl uppercase tracking-tighter text-black mb-4">
                Electric Yellow
              </h3>
              <p className="font-body text-black/80 text-lg max-w-lg leading-relaxed">
                A energia das luzes do estádio. O amarelo neon representa o futuro,
                a inovação tecnológica e o choque que causamos nos adversários.
              </p>
              <p className="font-body font-bold text-sm text-black/40 mt-4 font-mono">#FADB09</p>
            </div>
          </div>

          {/* Kinetic Red */}
          <div className="bento-block md:col-span-4 bg-red p-10 md:p-12 flex flex-col justify-between group cursor-default">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center text-white text-xl">
                ♥
              </div>
              <span className="font-headline font-bold text-white/30 text-2xl">03.</span>
            </div>
            <div>
              <h3 className="font-headline font-black text-4xl md:text-5xl uppercase tracking-tighter text-white mb-3">
                Kinetic Red
              </h3>
              <p className="font-body text-white/70 leading-relaxed">
                O sangue dos sócios. A batida do coração de Valejas em cada lance decisivo.
              </p>
              <p className="font-body font-bold text-xs text-white/30 mt-4 font-mono">#D4150C</p>
            </div>
          </div>

          {/* Royal Blue */}
          <div className="bento-block md:col-span-5 bg-blue p-10 md:p-12 flex flex-col justify-between group cursor-default">
            <span className="font-headline font-bold text-white/30 text-2xl">02.</span>
            <div>
              <h3 className="font-headline font-black text-4xl md:text-5xl uppercase tracking-tighter text-white mb-3">
                Royal Blue
              </h3>
              <p className="font-body text-white/70 leading-relaxed">
                A nobreza do nosso passado e a profundidade do nosso compromisso com
                a comunidade.
              </p>
              <p className="font-body font-bold text-xs text-white/30 mt-4 font-mono">#1554BB</p>
            </div>
          </div>

          {/* Mural da Vanguarda — text block */}
          <div className="bento-block md:col-span-7 bg-surface-highest p-10 md:p-12 flex items-center">
            <div className="max-w-lg">
              <h4 className="font-headline font-black text-2xl uppercase text-yellow mb-5">
                Mural da Vanguarda
              </h4>
              <p className="font-body text-on-surface-muted leading-relaxed mb-6">
                Cada tom foi calibrado para brilhar sob as luzes noturnas. Não usamos
                cores tradicionais — usamos frequências de energia. O Valejas Atlético
                Clube é o primeiro clube digitalmente nativo na sua expressão cromática.
              </p>
              <button className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface border-b border-yellow pb-1 hover:text-yellow transition-colors duration-200">
                Ver Guia de Marca
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
