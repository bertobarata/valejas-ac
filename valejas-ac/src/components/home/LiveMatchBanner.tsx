"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MapPin, Clock } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ── Mock data — replace with real API/CMS data ──
const NEXT_MATCH = {
  competition: "Liga Placard",
  round:       "Jornada 32",
  homeTeam:    "Valejas AC",
  awayTeam:    "FC Porto",
  date:        "Sábado, 5 Jul",
  time:        "19:00",
  venue:       "Pavilhão Municipal de Valejas",
  ticketsUrl:  "/jogos",
};

const LAST_RESULT = {
  competition: "Liga Placard • Jornada 31",
  homeTeam:    "Valejas AC",
  awayTeam:    "S.C. Estrela",
  homeGoals:   2,
  awayGoals:   1,
  isWin:       true,
};

export default function LiveMatchBanner() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="bg-surface-low border-y border-on-surface/10">
      <div className="section-container py-4">
        <div className="flex flex-col md:flex-row items-stretch gap-0 divide-y md:divide-y-0 md:divide-x divide-on-surface/10">

          {/* Last result */}
          <div className="flex items-center gap-4 py-4 md:py-3 md:pr-8 md:flex-1">
            <span className={`font-headline font-black text-xs uppercase tracking-widest px-2.5 py-1 ${LAST_RESULT.isWin ? "bg-yellow text-black" : "bg-red text-white"}`}>
              {LAST_RESULT.isWin ? "Vitória" : "Derrota"}
            </span>
            <div className="flex items-center gap-3 flex-1">
              <span className="font-body text-sm text-on-surface font-semibold">{LAST_RESULT.homeTeam}</span>
              <span className="font-headline font-black text-2xl text-on-surface leading-none">
                {LAST_RESULT.homeGoals}
                <span className="text-on-surface-muted mx-1">–</span>
                {LAST_RESULT.awayGoals}
              </span>
              <span className="font-body text-sm text-on-surface-muted">{LAST_RESULT.awayTeam}</span>
            </div>
            <Link href="/jogos" className="text-on-surface-muted hover:text-yellow transition-colors">
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Next match */}
          <div className="flex items-center gap-4 py-4 md:py-3 md:px-8 md:flex-1">
            <div className="hidden sm:block">
              <p className="font-body text-xs text-on-surface-muted uppercase tracking-widest">{NEXT_MATCH.competition} · {NEXT_MATCH.round}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-headline font-black text-sm text-on-surface">{NEXT_MATCH.homeTeam}</span>
                <span className="font-body text-xs text-on-surface-muted">vs</span>
                <span className="font-headline font-black text-sm text-on-surface">{NEXT_MATCH.awayTeam}</span>
              </div>
            </div>
            <div className="sm:hidden">
              <p className="font-headline font-black text-sm text-on-surface">{NEXT_MATCH.homeTeam} vs {NEXT_MATCH.awayTeam}</p>
            </div>
            <div className="flex flex-col gap-0.5 ml-auto text-right">
              <span className="flex items-center justify-end gap-1 font-body text-xs text-on-surface-muted">
                <Clock size={11} />{NEXT_MATCH.date} · {NEXT_MATCH.time}
              </span>
              <span className="flex items-center justify-end gap-1 font-body text-xs text-on-surface-muted">
                <MapPin size={11} />{NEXT_MATCH.venue}
              </span>
            </div>
          </div>

          {/* Ticket CTA — vermelho = urgência de compra */}
          <div className="flex items-center py-4 md:py-3 md:pl-8">
            <Link href={NEXT_MATCH.ticketsUrl} className="btn-danger text-xs whitespace-nowrap">
              Comprar Bilhetes
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
