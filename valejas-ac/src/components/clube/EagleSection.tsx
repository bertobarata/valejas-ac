"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function EagleSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Watermark text scroll
      gsap.to(".eagle-watermark", {
        x: "-20%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      // Content reveal
      gsap.fromTo(
        ".eagle-content > *",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        }
      );
      gsap.fromTo(
        ".eagle-visual",
        { scale: 0.9, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-surface-low flex flex-col justify-center py-24 overflow-hidden">
      {/* Watermark "FORCE" */}
      <div
        className="eagle-watermark absolute right-0 top-0 font-headline font-black italic text-[28rem] text-surface-highest/20 pointer-events-none select-none leading-none translate-x-1/3 -translate-y-1/4 whitespace-nowrap"
        aria-hidden
      >
        FORCE
      </div>

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 items-center">

          {/* Visual — eagle icon with corner brackets */}
          <div className="order-2 lg:order-1 eagle-visual">
            <div className="relative w-full max-w-sm mx-auto aspect-[4/3] bg-surface-mid overflow-hidden">
              {/* Águia oficial do emblema */}
              <Image
                src="/brand/eagle.png"
                alt="A águia do emblema do Valejas Atlético Clube"
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover"
                style={{ objectPosition: "center 32%" }}
              />
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-yellow z-10" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-yellow z-10" />
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2 eagle-content space-y-6">
            <span className="font-body font-black uppercase tracking-[0.3em] text-yellow text-xs">
              Capítulo I
            </span>
            <h2 className="font-headline font-black italic text-6xl md:text-8xl uppercase leading-none tracking-tighter text-on-surface">
              A Águia<br />de{" "}
              <span className="text-yellow">Valejas</span>
            </h2>
            <p className="font-body text-xl text-on-surface-muted leading-relaxed">
              O nosso predador de topo. A águia não apenas observa — ela domina o
              espaço aéreo de Valejas. Simboliza a visão estratégica do clube e a
              ferocidade com que atacamos cada jogo. É a nossa ligação com o céu e
              a nossa ambição sem limites.
            </p>
            {/* Pull quote */}
            <div className="border border-yellow/30 bg-surface-mid p-6">
              <p className="font-body italic text-on-surface">
                "O som do bater de asas é o aviso. O Valejas não recua."
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
