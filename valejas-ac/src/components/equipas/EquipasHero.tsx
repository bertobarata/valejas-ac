"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function EquipasHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".equipa-hero-content > *",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(
        ".equipa-hero-img",
        { x: 40, opacity: 0, scale: 1.05 },
        { x: 0, opacity: 1, scale: 1, duration: 1.0, ease: "power3.out", delay: 0.3 }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-surface pt-28 pb-12 lg:pt-36 lg:pb-20"
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

          {/* Left — text */}
          <div className="lg:col-span-7 equipa-hero-content space-y-6 z-10">
            <nav aria-label="Navegação" className="font-body text-xs uppercase tracking-widest text-on-surface-muted">
              <Link href="/modalidades" className="alvo-toque hover:text-yellow transition-colors">Modalidades</Link>
              <span className="mx-2 text-on-surface/40">/</span>
              <span className="text-yellow">Futsal</span>
            </nav>

            <h1 className="font-headline font-black wdth-condensed text-8xl md:text-[10rem] uppercase leading-[0.85] tracking-tighter">
              Futsal{" "}
              <span
                className="text-yellow block"
                style={{ textShadow: "0 0 30px rgba(250,219,9,0.2)" }}
              >
                de Valejas
              </span>
            </h1>

            <p className="font-body text-lg text-on-surface-muted max-w-lg leading-relaxed">
              Equipa profissional no distrital da AF Lisboa, equipa B logo atrás e
              formação dos petizes aos juniores. Quem entra em criança pode chegar
              a sénior sem mudar de camisola.
            </p>
          </div>

          {/* Right — player image */}
          <div className="lg:col-span-5 equipa-hero-img relative">
            <div className="aspect-[4/5] bg-surface-high relative overflow-hidden">
              {/* Placeholder — replace with real player image */}
              <div className="w-full h-full bg-gradient-to-b from-surface-high to-surface flex items-end justify-center p-8">
                <div className="text-center opacity-20">
                  <p className="font-headline font-black text-8xl text-on-surface">#10</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
            </div>
            {/* Badge do clube */}
            <div className="absolute -bottom-6 -left-6 bg-blue p-6 hidden md:block">
              <div className="font-headline font-black text-3xl text-white uppercase tracking-tighter">
                Valejas
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
