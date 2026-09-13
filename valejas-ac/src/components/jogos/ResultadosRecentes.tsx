"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Result = {
  date:       string;
  homeTeam:   string;
  awayTeam:   string;
  homeGoals:  number;
  awayGoals:  number;
  isHome:     boolean;
  outcome:    "win" | "draw" | "loss";
  scorers:    string;
};

const RESULTS: Result[] = [
  {
    date: "18 Ago 2024", homeTeam: "Valejas AC", awayTeam: "Eagles United",
    homeGoals: 4, awayGoals: 2, isHome: true, outcome: "win",
    scorers: "Tiago P. (2), André M., Dani",
  },
  {
    date: "12 Ago 2024", homeTeam: "Dragões Sul", awayTeam: "Valejas AC",
    homeGoals: 1, awayGoals: 1, isHome: false, outcome: "draw",
    scorers: "Fábio Lima (34')",
  },
  {
    date: "05 Ago 2024", homeTeam: "Valejas AC", awayTeam: "Titan's",
    homeGoals: 3, awayGoals: 0, isHome: true, outcome: "win",
    scorers: "Ricardo N. (2), Alex S.",
  },
];

const OUTCOME_STYLES: Record<string, string> = {
  win:  "text-yellow bg-yellow/10 border border-yellow/30",
  draw: "text-on-surface-muted bg-surface-high border border-on-surface/10",
  loss: "text-red bg-red/10 border border-red/30",
};
const OUTCOME_LABEL: Record<string, string> = {
  win: "Vitória", draw: "Empate", loss: "Derrota",
};

export default function ResultadosRecentes() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".result-card",
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-headline font-black text-4xl uppercase tracking-tighter text-on-surface">
          Resultados Recentes
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-blue to-transparent" />
      </div>

      <div className="space-y-3">
        {RESULTS.map((r) => (
          <div
            key={r.date + r.homeTeam}
            className="result-card group flex items-center gap-4 bg-surface-mid p-5 border-l-2 border-transparent hover:border-yellow hover:bg-surface-high transition-all duration-300 cursor-pointer"
          >
            {/* Date — vertical on desktop */}
            <div className="hidden md:flex items-center justify-center text-on-surface-muted text-[10px] font-bold uppercase tracking-widest rotate-180 border-r border-on-surface/10 pr-3 min-h-[60px]"
              style={{ writingMode: "vertical-lr" }}>
              {r.date}
            </div>

            {/* Score row */}
            <div className="flex-1 grid grid-cols-3 items-center gap-3">
              {/* Home */}
              <div className="flex items-center gap-3 justify-end">
                <span className={`font-headline font-black uppercase text-sm hidden sm:inline ${r.isHome ? "text-on-surface" : "text-on-surface-muted"}`}>
                  {r.homeTeam}
                </span>
                <div className="w-8 h-8 bg-surface-highest rounded-none flex items-center justify-center font-headline font-black text-[10px] text-on-surface-muted">
                  {r.homeTeam.slice(0, 2).toUpperCase()}
                </div>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center gap-1">
                <div className="font-headline font-black text-3xl text-on-surface">
                  {r.homeGoals}
                  <span className="text-yellow mx-1">–</span>
                  {r.awayGoals}
                </div>
                <span className={`font-body font-bold text-[9px] uppercase tracking-tight px-2 py-0.5 ${OUTCOME_STYLES[r.outcome]}`}>
                  {OUTCOME_LABEL[r.outcome]}
                </span>
              </div>

              {/* Away */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-surface-highest rounded-none flex items-center justify-center font-headline font-black text-[10px] text-on-surface-muted">
                  {r.awayTeam.slice(0, 2).toUpperCase()}
                </div>
                <span className={`font-headline font-black uppercase text-sm hidden sm:inline ${!r.isHome ? "text-on-surface" : "text-on-surface-muted"}`}>
                  {r.awayTeam}
                </span>
              </div>
            </div>

            {/* Scorers */}
            <div className="hidden lg:block text-right border-l border-on-surface/10 pl-4 min-w-[160px]">
              <p className="font-body text-[9px] font-bold text-on-surface-muted uppercase tracking-widest mb-1">Marcadores</p>
              <p className="font-body text-xs text-on-surface">{r.scorers}</p>
            </div>

            {/* Arrow */}
            <ArrowRight size={14} className="text-on-surface-muted group-hover:text-yellow transition-colors flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
