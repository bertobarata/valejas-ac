"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ClubIdentitySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Diagonal sash reveal
      gsap.fromTo(
        ".sash-diagonal",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1, duration: 1.2, ease: "power4.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );

      // Text reveal
      gsap.fromTo(
        ".identity-text",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        }
      );

      // Crest parallax
      gsap.to(".crest-element", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-surface py-20 md:py-32 overflow-hidden">

      {/* Diagonal red sash — crest motif */}
      <div
        className="sash-diagonal absolute top-0 bottom-0 left-0 right-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "linear-gradient(135deg, transparent 45%, rgba(212,21,12,0.08) 45%, rgba(212,21,12,0.08) 55%, transparent 55%)",
        }}
      />

      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div>
            <p className="identity-text font-body text-xs font-semibold uppercase tracking-[0.3em] text-yellow mb-4">
              O Nosso Emblema
            </p>
            <h2 className="identity-text font-headline font-black text-5xl md:text-6xl uppercase leading-none tracking-tighter text-on-surface mb-6">
              A Faixa{" "}
              <span className="text-red">Sagrada</span>
            </h2>
            <p className="identity-text font-body text-base text-on-surface-muted leading-relaxed mb-4">
              A faixa diagonal vermelha é mais do que uma escolha de design
              — é a velocidade da nossa história. Inspirada no voo da águia
              que guarda o nosso pavilhão, cada risca no nosso equipamento
              carrega o peso de oito décadas de garra, glória e comunidade
              no futsal e no futebol.
            </p>
            <ul className="identity-text space-y-3 mb-8">
              {[
                { title: "Identidade Inabalável", desc: "Nunca mudámos as nossas cores. Mudámos o jogo." },
                { title: "Clube dos Sócios",       desc: "Construído pelas gentes de Valejas, para as gentes de Valejas." },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-body font-semibold text-sm text-on-surface">{item.title}</p>
                    <p className="font-body text-sm text-on-surface-muted">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="identity-text flex flex-wrap gap-4">
              <Link href="/clube" className="btn-primary text-sm">
                Conhecer o clube
              </Link>
              <Link href="/clube#historia" className="btn-ghost text-sm">
                A Nossa História
              </Link>
            </div>
          </div>

          {/* Crest / visual */}
          <div className="crest-element relative flex items-center justify-center">
            <div className="relative w-72 h-72 md:w-80 md:h-80">
              {/* Glow rings */}
              <div className="absolute inset-0 rounded-full bg-yellow/5 animate-pulse" style={{ animationDuration: "3s" }} />
              <div className="absolute inset-4 rounded-full bg-yellow/5 animate-pulse" style={{ animationDuration: "3s", animationDelay: "0.5s" }} />
              {/* Emblema oficial */}
              <div className="absolute inset-8 flex items-center justify-center">
                <Image
                  src="/brand/crest.png"
                  alt="Emblema do Valejas Atlético Clube"
                  width={280}
                  height={280}
                  className="w-full h-full object-contain drop-shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
                />
              </div>
              {/* Stats floating */}
              <div className="absolute -bottom-4 -left-4 bg-surface-high px-4 py-3 border border-yellow/40">
                <span className="font-headline font-black text-3xl text-yellow">12</span>
                <p className="font-body text-xs text-on-surface-muted uppercase tracking-widest">Títulos nacionais</p>
              </div>
              <div className="absolute -top-4 -right-4 bg-surface-high px-4 py-3 border border-red/40">
                <span className="font-headline font-black text-3xl text-red">1945</span>
                <p className="font-body text-xs text-on-surface-muted uppercase tracking-widest">Fundação</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
