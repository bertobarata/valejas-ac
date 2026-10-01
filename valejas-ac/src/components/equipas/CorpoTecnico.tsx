"use client";

/**
 * CORPO TÉCNICO
 * ─────────────────────────────────────────────────────────────────
 * Havia aqui um treinador chamado Marco Reus — o jogador do Borussia
 * Dortmund — com uma citação inventada e a época 2024/25, mais três
 * adjuntos que também não existem. Estava publicado.
 *
 * Agora a lista vem do CMS (`membroTecnico`), escrita pela Direção em
 * /direcao/plantel. Enquanto estiver vazia, a secção assume isso em vez
 * de encher o espaço.
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import type { MembroTecnicoSite } from "@/sanity/queries";

gsap.registerPlugin(ScrollTrigger);

function iniciais(nome: string): string {
  const p = nome.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
}

export default function CorpoTecnico({ membros }: { membros: MembroTecnicoSite[] }) {
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

          {membros.length > 0 ? (
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-8">
              {membros.map((m) => (
                <li key={m._id} className="space-y-3">
                  <div className="relative aspect-[3/4] bg-surface-high overflow-hidden">
                    {m.fotoUrl ? (
                      <Image
                        src={m.fotoUrl}
                        alt={`${m.nome}, ${m.cargo}`}
                        fill
                        sizes="(min-width: 640px) 16vw, 45vw"
                        placeholder={m.fotoLqip ? "blur" : "empty"}
                        blurDataURL={m.fotoLqip}
                        className="object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="absolute inset-0 flex items-center justify-center font-headline font-black text-5xl text-on-surface/25"
                      >
                        {iniciais(m.nome)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-headline font-black text-lg uppercase leading-tight text-on-surface">
                      {m.nome}
                    </p>
                    <p className="font-body text-xs font-bold uppercase text-on-surface-muted tracking-widest mt-1">
                      {m.cargo}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
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
