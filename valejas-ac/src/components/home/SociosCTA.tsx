"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SociosCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { scale: 0.94, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-blue py-24 md:py-32"
    >
      {/* Background watermark text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        aria-hidden
      >
        <span className="font-headline font-black text-[20vw] uppercase text-white/5 leading-none whitespace-nowrap select-none">
          VANGUARDA
        </span>
      </div>

      {/* Diagonal accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.15) 50%)",
        }}
      />

      <div className="section-container relative z-10">
        <div ref={textRef} className="text-center max-w-2xl mx-auto">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.35em] text-yellow/80 mb-4">
            Sê Parte da Revolução
          </p>
          <h2 className="font-headline font-black text-5xl md:text-7xl uppercase leading-none tracking-tighter text-white mb-4">
            Junta-te à{" "}
            <span className="text-yellow">Revolução</span>
          </h2>
          <p className="font-body text-base text-white/70 leading-relaxed mb-10">
            Recebe relatórios exclusivos, acesso antecipado a bilhetes de
            futsal, conteúdos de bastidores e faz parte dos{" "}
            <strong className="text-white">850 sócios</strong> que vivem a
            Vanguarda.
          </p>

          {/* Email form */}
          <form className="flex gap-0 max-w-md mx-auto mb-8">
            <input
              type="email"
              placeholder="Introduz o teu email"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 font-body text-sm focus:outline-none focus:border-yellow transition-colors duration-200"
            />
            <button type="submit" className="btn-primary rounded-none px-6 py-3 text-xs">
              Inscrever Agora
            </button>
          </form>

          {/* Secondary CTAs */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/socios-contacto" className="btn-ghost text-white border-white/30 text-sm hover:border-yellow hover:text-yellow">
              Tornar-se Sócio
            </Link>
            <Link href="/instagram" className="btn-ghost text-white border-white/30 text-sm hover:border-yellow hover:text-yellow">
              Instagram
            </Link>
            <Link href="/youtube" className="btn-ghost text-white border-white/30 text-sm hover:border-yellow hover:text-yellow">
              YouTube
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
