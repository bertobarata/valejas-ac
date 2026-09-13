"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, MapPin } from "lucide-react";
import MatchCountdown from "./MatchCountdown";

gsap.registerPlugin(ScrollTrigger);

// Next match — replace with real data
const NEXT_MATCH = {
  label:    "Próximo Grande Duelo",
  title:    ["Derby de", "Futsal"],
  subtitle: "O próximo desafio no nosso pavilhão. Vem apoiar o Valejas.",
  home:     { name: "Valejas AC",  abbr: "VAC" },
  away:     { name: "Lions FC",    abbr: "LFC" },
  date:     "Sábado, 24 de Agosto • 21:00",
  venue:    "Pavilhão Valejas Arena",
  target:   new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 55 * 60 * 1000),
};

export default function JogosHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".jogos-hero-text > *",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(
        ".jogos-match-card",
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.4 }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-surface-low pt-28 pb-20 md:pt-36 md:pb-28"
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      {/* Blue ambient glow — dark mode only */}
      <div
        className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue/10 rounded-full blur-[120px] pointer-events-none hidden dark:block"
        aria-hidden
      />

      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left — headline + countdown */}
          <div className="lg:col-span-7 jogos-hero-text space-y-6">
            {/* Live badge */}
            <div className="badge-live w-fit">
              Próximo Grande Duelo
            </div>

            {/* Title */}
            <h1 className="font-headline font-black text-7xl md:text-9xl uppercase leading-none tracking-tighter text-yellow glow-yellow">
              {NEXT_MATCH.title[0]}<br />
              {NEXT_MATCH.title[1]}
            </h1>

            <p className="font-body text-lg text-on-surface-muted max-w-xl leading-relaxed">
              {NEXT_MATCH.subtitle}
            </p>

            {/* Countdown */}
            <MatchCountdown target={NEXT_MATCH.target} />

            <div className="flex gap-4 pt-2">
              <Link href="/jogos" className="btn-secondary text-sm">
                Ver Plantel
              </Link>
              <Link href="/jogos#calendario" className="btn-ghost text-sm">
                Calendário
              </Link>
            </div>
          </div>

          {/* Right — match card */}
          <div className="lg:col-span-5 jogos-match-card">
            <div
              className="border border-on-surface/12 p-8 flex flex-col gap-8"
              style={{ background: "rgba(46,53,67,0.4)", backdropFilter: "blur(20px)" }}
            >
              {/* Teams vs */}
              <div className="flex items-center justify-between gap-4">
                {/* Home */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-surface-mid mx-auto mb-2 flex items-center justify-center font-headline font-black text-yellow text-xs">
                    {NEXT_MATCH.home.abbr}
                  </div>
                  <span className="font-headline font-black text-xs uppercase text-on-surface">
                    {NEXT_MATCH.home.name}
                  </span>
                </div>

                <div className="font-headline font-black text-5xl text-on-surface-muted">VS</div>

                {/* Away */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-surface-mid mx-auto mb-2 flex items-center justify-center font-headline font-black text-on-surface-muted text-xs">
                    {NEXT_MATCH.away.abbr}
                  </div>
                  <span className="font-headline font-black text-xs uppercase text-on-surface">
                    {NEXT_MATCH.away.name}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-on-surface-muted">
                  <Calendar size={16} className="flex-shrink-0 text-yellow" />
                  <span className="font-body text-sm font-semibold uppercase tracking-wider">
                    {NEXT_MATCH.date}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-muted">
                  <MapPin size={16} className="flex-shrink-0 text-yellow" />
                  <span className="font-body text-sm font-semibold uppercase tracking-wider">
                    {NEXT_MATCH.venue}
                  </span>
                </div>
              </div>

              <Link href="/jogos#bilhetes" className="btn-primary text-sm w-full justify-center">
                Garantir Bilhete
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
