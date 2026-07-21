"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function EmblemHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const crestRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance
      gsap.fromTo(
        ".emblem-hero-text > *",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.14, ease: "power3.out", delay: 0.3 }
      );
      gsap.fromTo(
        crestRef.current,
        { scale: 0.85, opacity: 0, rotate: -3 },
        { scale: 1, opacity: 1, rotate: 0, duration: 1.2, ease: "power3.out", delay: 0.5 }
      );

      // Scroll parallax on crest
      gsap.to(crestRef.current, {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Scroll indicator fade out
      gsap.to(".scroll-indicator", {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "25% top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface pt-24"
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      {/* Blue ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue/10 rounded-full blur-[120px] pointer-events-none"
        aria-hidden
      />

      <div className="section-container relative z-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left — text */}
          <div className="lg:col-span-7 emblem-hero-text space-y-6">
            <h1
              className="font-headline font-black italic text-[13vw] lg:text-[8rem] uppercase leading-[0.8] tracking-tighter text-on-surface"
            >
              O Nosso{" "}
              <span
                className="text-yellow block"
                style={{ filter: "drop-shadow(0 0 15px rgba(250,219,9,0.30))" }}
              >
                Emblema
              </span>
            </h1>

            <p className="font-body text-lg md:text-xl text-on-surface-muted leading-relaxed max-w-xl">
              Mais do que um símbolo, uma declaração de guerra. O emblema do Valejas
              Atlético Clube é a síntese visual da nossa resistência, herança e a
              energia elétrica que corre nas nossas bancadas.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="h-px w-10 bg-yellow" />
              <span className="font-headline font-bold uppercase tracking-widest text-yellow text-sm">
                Explora o emblema
              </span>
            </div>
          </div>

          {/* Right — crest */}
          <div
            ref={crestRef}
            className="lg:col-span-5 relative group flex items-center justify-center"
          >
            {/* Glow on hover */}
            <div className="absolute -inset-4 bg-yellow/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Crest placeholder — replace with <Image> when real crest is ready */}
            <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-3">
              <div
                className="w-full h-full rounded-none border-4 border-yellow/20 flex items-center justify-center bg-surface-mid relative overflow-hidden"
                style={{ filter: "drop-shadow(0 0 50px rgba(250,219,9,0.15))" }}
              >
                <div className="absolute inset-0 bg-diagonal-stripe opacity-50" />
                <div className="text-center relative z-10">
                  <p className="font-headline font-black text-8xl text-yellow leading-none">V</p>
                  <p className="font-body text-xs uppercase tracking-[0.4em] text-on-surface-muted mt-2">Atlético Clube</p>
                  <p className="font-body text-[9px] uppercase tracking-widest text-on-surface-muted/60 mt-1">Est. 1944</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-on-surface-muted">
        <span className="font-body text-[9px] uppercase tracking-[0.4em]">Scroll para Desconstruir</span>
        <div className="w-px h-16 bg-gradient-to-b from-yellow to-transparent" />
      </div>
    </section>
  );
}
