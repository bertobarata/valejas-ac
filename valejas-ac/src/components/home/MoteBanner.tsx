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
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MoteBanner() {
  const ref = useRef<HTMLElement>(null);
  // O mote e o contexto vivem em MOTE (@/lib/data/clube), em português;
  // aqui vêm das traduções, com o mesmo texto em PT.
  const t = useTranslations("inicio.mote");

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
          {t("etiqueta")}
        </p>

        <p className="mote-linha font-headline font-black uppercase leading-[0.9] tracking-tighter wdth-condensed text-3xl md:text-5xl">
          {t.rich("frase", {
            destaque: (c) => <span className="text-yellow">{c}</span>,
          })}
        </p>

        <p className="mote-linha font-body text-base md:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto mt-8">
          {t("contexto")}
        </p>
      </div>
    </section>
  );
}
