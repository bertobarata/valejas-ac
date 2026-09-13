"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NewsletterForm from "@/components/NewsletterForm";
import { CONTACTO } from "@/lib/data/socios";

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
      className="section-dark relative overflow-hidden bg-blue py-24 md:py-32"
    >
      {/* Background watermark text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        aria-hidden
      >
        <span className="font-headline font-black text-[20vw] uppercase text-white/5 leading-none whitespace-nowrap select-none">
          VALEJAS
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
            Faz parte
          </p>
          <h2 className="font-headline font-black text-5xl md:text-7xl uppercase leading-none tracking-tighter text-white mb-4">
            Junta-te ao{" "}
            <span className="text-yellow">clube</span>
          </h2>
          <p className="font-body text-base text-white/85 leading-relaxed mb-10">
            Acompanha os jogos de todos os escalões, recebe as novidades do
            clube em primeira mão e faz parte das famílias que fazem o Valejas.
          </p>

          {/* Email form */}
          <NewsletterForm variant="dark" cta="Inscrever Agora" />

          {/* Secondary CTAs */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/socios/inscricao" className="btn-ghost text-white border-white/30 text-sm hover:border-yellow hover:text-yellow">
              Tornar-se Sócio
            </Link>
            <a href={CONTACTO.redesSociais.instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost text-white border-white/30 text-sm hover:border-yellow hover:text-yellow">
              Instagram
            </a>
            <a href={CONTACTO.redesSociais.youtube} target="_blank" rel="noopener noreferrer" className="btn-ghost text-white border-white/30 text-sm hover:border-yellow hover:text-yellow">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
