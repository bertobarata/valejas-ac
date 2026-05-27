"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import { PLANOS } from "@/lib/data/socios";

gsap.registerPlugin(ScrollTrigger);

export default function PlanosSocios() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".plano-card",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-surface py-20 md:py-28">
      <div className="section-container">
        <div className="text-center mb-14">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.35em] text-yellow mb-3">
            Planos de Sócio
          </p>
          <h2 className="font-headline font-black italic text-5xl md:text-6xl uppercase leading-none tracking-tighter text-on-surface">
            Escolhe o <span className="text-yellow">Teu Nível</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-on-surface/10">
          {PLANOS.map((plano) => (
            <div
              key={plano.id}
              className={`plano-card relative flex flex-col p-8 md:p-10 transition-all duration-300 ${
                plano.destaque
                  ? "bg-blue"
                  : "bg-surface-high hover:bg-surface-highest"
              }`}
            >
              {/* Destaque label */}
              {plano.destaque && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="font-body font-black text-[9px] uppercase tracking-widest bg-yellow text-black px-4 py-1">
                    Mais Popular
                  </span>
                </div>
              )}

              {/* Plan name & price */}
              <div className="mb-8">
                <h3 className={`font-headline font-black italic text-3xl uppercase tracking-tighter mb-4 ${plano.destaque ? "text-white" : "text-on-surface"}`}>
                  {plano.nome}
                </h3>
                <div className="flex items-end gap-1">
                  <span className={`font-headline font-black text-5xl leading-none ${plano.destaque ? "text-yellow" : "text-on-surface"}`}>
                    {plano.preco}€
                  </span>
                  <span className={`font-body text-sm mb-1 ${plano.destaque ? "text-white/60" : "text-on-surface-muted"}`}>
                    /{plano.periodo}
                  </span>
                </div>
              </div>

              {/* Benefits */}
              <ul className="space-y-3 flex-1 mb-10">
                {plano.beneficios.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <Check
                      size={14}
                      className={`flex-shrink-0 mt-0.5 ${plano.destaque ? "text-yellow" : "text-yellow"}`}
                    />
                    <span className={`font-body text-sm leading-snug ${plano.destaque ? "text-white/80" : "text-on-surface-muted"}`}>
                      {b}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#ficha-inscricao"
                className={`text-center font-headline font-black text-sm uppercase tracking-widest py-4 transition-all duration-200 ${
                  plano.destaque
                    ? "bg-yellow text-black hover:brightness-110"
                    : "bg-surface-highest text-on-surface hover:bg-yellow hover:text-black"
                }`}
              >
                Aderir Agora
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
