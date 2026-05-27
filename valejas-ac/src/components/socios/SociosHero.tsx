"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SociosHero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".socios-hero-content > *",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.2 }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative bg-blue overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28"
    >
      {/* Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        aria-hidden
      >
        <span className="font-headline font-black text-[22vw] uppercase text-white/5 leading-none whitespace-nowrap select-none">
          VANGUARDA
        </span>
      </div>

      {/* Diagonal accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(135deg, transparent 55%, rgba(0,0,0,0.15) 55%)" }}
        aria-hidden
      />

      <div className="section-container relative z-10 socios-hero-content space-y-5">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.35em] text-yellow/80">
          Faz parte da família
        </p>
        <h1 className="font-headline font-black italic text-6xl md:text-8xl uppercase leading-none tracking-tighter text-white">
          Junta-te à<br />
          <span className="text-yellow">Vanguarda</span>
        </h1>
        <p className="font-body text-lg text-white/70 max-w-xl leading-relaxed">
          Mais de <strong className="text-white">850 sócios</strong> já fazem parte desta família.
          Escolhe o teu plano, preenche a ficha e passa a viver o clube por dentro.
        </p>
      </div>
    </section>
  );
}
