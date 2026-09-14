"use client";

/**
 * MOTE DO CLUBE
 * ─────────────────────────────────────────────────────────────────
 * O mote passou a ser o título do hero — é lá que tem a escala toda.
 * Esta faixa deixa de o repetir ao mesmo tamanho e passa a fazer o que
 * o hero não tem espaço para fazer: explicar de onde vem.
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTE } from "@/lib/data/clube";

gsap.registerPlugin(ScrollTrigger);

export default function MoteBanner() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".mote-linha",
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 75%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-dark bg-blue text-white bg-texture">
      <div className="section-container py-20 md:py-28 text-center">
        <p className="mote-linha font-body text-xs font-semibold uppercase tracking-[0.35em] text-yellow mb-6">
          O que o mote quer dizer
        </p>

        <p className="mote-linha font-headline font-black uppercase leading-[0.9] tracking-tighter wdth-condensed text-3xl md:text-5xl">
          A união faz a{" "}
          <span className="text-yellow">força</span>
        </p>

        <p className="mote-linha font-body text-base md:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto mt-8">
          {MOTE.contexto}
        </p>
      </div>
    </section>
  );
}
