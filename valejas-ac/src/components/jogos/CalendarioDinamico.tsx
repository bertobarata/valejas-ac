"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type UpcomingMatch = {
  competition: string;
  round:       string;
  isHome:      boolean;
  home:        string;
  away:        string;
  date:        string;
  time:        string;
  ticketsUrl:  string | null;
};

const UPCOMING: UpcomingMatch[] = [
  {
    competition: "Liga de Futsal", round: "Jornada 14", isHome: true,
    home: "V. Atlético AC", away: "Titan's",
    date: "01 Set", time: "18:30", ticketsUrl: "/jogos/bilhetes",
  },
  {
    competition: "Taça Nacional", round: "Quartos", isHome: false,
    home: "Porto M.", away: "Valejas AC",
    date: "08 Set", time: "20:00", ticketsUrl: null,
  },
  {
    competition: "Liga de Futsal", round: "Jornada 15", isHome: true,
    home: "Valejas AC", away: "Dragões Sul",
    date: "15 Set", time: "19:00", ticketsUrl: "/jogos/bilhetes",
  },
  {
    competition: "Liga de Futsal", round: "Jornada 16", isHome: false,
    home: "Eagles United", away: "Valejas AC",
    date: "22 Set", time: "21:00", ticketsUrl: null,
  },
];

export default function CalendarioDinamico() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".calendar-card",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} id="calendario">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-headline font-black italic text-4xl uppercase tracking-tighter text-on-surface">
          Calendário Dinâmico
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-yellow to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {UPCOMING.map((m, i) => (
          <div
            key={i}
            className="calendar-card bg-surface-high p-6 flex flex-col justify-between min-h-[200px] border-t border-yellow/20 hover:border-yellow/60 transition-colors duration-300"
          >
            {/* Top */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-body font-bold text-[10px] uppercase tracking-widest text-on-surface-muted">
                  {m.competition} · {m.round}
                </p>
              </div>
              <span className={`font-headline font-black text-[10px] uppercase px-2 py-1 ${
                m.isHome
                  ? "bg-yellow text-black"
                  : "bg-surface-highest text-on-surface-muted"
              }`}>
                {m.isHome ? "Casa" : "Fora"}
              </span>
            </div>

            {/* Match */}
            <div className="font-headline font-black text-xl uppercase leading-tight text-on-surface mb-4">
              {m.home}{" "}
              <span className="text-yellow">vs</span>{" "}
              {m.away}
            </div>

            {/* Footer */}
            <div className="flex items-end justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-on-surface-muted">
                  <Clock size={11} />
                  <span className="font-body text-xs">{m.date}, {m.time}</span>
                </div>
              </div>
              {m.ticketsUrl ? (
                <Link href={m.ticketsUrl} className="btn-primary text-xs py-2 px-4">
                  Comprar Bilhetes
                </Link>
              ) : (
                <span className="font-body text-xs text-on-surface-muted uppercase tracking-widest">
                  Brevemente disponível
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
