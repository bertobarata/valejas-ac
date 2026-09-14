"use client";

/**
 * CORPO TÉCNICO
 * ─────────────────────────────────────────────────────────────────
 * Havia aqui um treinador chamado Marco Reus — o jogador do Borussia
 * Dortmund — com uma citação inventada e a época 2024/25, mais três
 * adjuntos que também não existem. Estava publicado.
 *
 * Agora a lista vem de `EQUIPA_TECNICA`, que está vazia até o clube
 * dizer quem são, e a secção assume isso em vez de encher o espaço.
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EQUIPA_TECNICA } from "@/lib/data/plantel";

gsap.registerPlugin(ScrollTrigger);

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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-surface-low py-24 md:py-32">
      <div className="section-container">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 lg:gap-20 items-start corpo-tecnico-content">
          <div className="space-y-6">
            <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-blue">
              Quem treina
            </p>
            <h2 className="font-headline font-black text-5xl md:text-6xl uppercase leading-none tracking-tighter text-on-surface">
              Corpo{" "}
              <span className="text-yellow block">Técnico</span>
            </h2>
            <p className="font-body text-base text-on-surface-muted leading-relaxed max-w-prose">
              Quem prepara os treinos, escolhe as equipas e está no banco ao
              sábado. Do futsal sénior aos petizes.
            </p>
          </div>

          {EQUIPA_TECNICA.length > 0 ? (
            <div>
              {EQUIPA_TECNICA.map((m) => (
                <div
                  key={m.nome}
                  className="flex flex-wrap justify-between items-end gap-x-6 gap-y-1 border-b border-on-surface/10 py-4"
                >
                  <span className="font-body text-xs font-bold uppercase text-on-surface-muted tracking-widest">
                    {m.funcao}
                  </span>
                  <span className="font-headline font-black text-lg uppercase text-on-surface">
                    {m.nome}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface-high p-7 md:p-8">
              <p className="font-body text-on-surface leading-relaxed">
                A equipa técnica desta época ainda não está publicada aqui.
              </p>
              <p className="font-body text-on-surface-muted leading-relaxed mt-3">
                Na sede dizem-te quem treina cada escalão, e os horários de
                cada equipa.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
