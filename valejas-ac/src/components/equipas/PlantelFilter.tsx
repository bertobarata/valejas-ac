"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Trophy, Target, Shield, Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ── Types ──────────────────────────────────────────────────────────
type StatKey = "golos" | "assist" | "defesas" | "cleanSheet" | "desarmes";

type Player = {
  number:   number;
  name:     string;
  position: string;
  team:     "futsal" | "futebol" | "formacao";
  gender:   "masculino" | "feminino";
  stat1:    { label: string; value: number; key: StatKey };
  stat2:    { label: string; value: number; key: StatKey };
  rating:   number;
  nacionalidade?: string;
  jogos?:   number;
};

// ── Mock data — replace with CMS/API ──────────────────────────────
const PLAYERS: Player[] = [
  { number: 10, name: "Ricardo Fontes", position: "Ala / Capitão", team: "futsal", gender: "masculino",
    stat1: { label: "Golos",  value: 24, key: "golos"  }, stat2: { label: "Assist.", value: 12, key: "assist"   }, rating: 8.5, nacionalidade: "PT", jogos: 28 },
  { number: 1,  name: "Tiago Santos",   position: "Guarda-Redes",  team: "futsal", gender: "masculino",
    stat1: { label: "Defesas", value: 15, key: "defesas" }, stat2: { label: "Clean Sheet", value: 3, key: "cleanSheet" }, rating: 9.1, nacionalidade: "PT", jogos: 30 },
  { number: 7,  name: "Bruno Mendes",   position: "Fixo",          team: "futsal", gender: "masculino",
    stat1: { label: "Desarmes", value: 45, key: "desarmes" }, stat2: { label: "Golos", value: 5, key: "golos" }, rating: 7.8, nacionalidade: "PT", jogos: 25 },
  { number: 19, name: "Alex Silva",     position: "Pivot",         team: "futsal", gender: "masculino",
    stat1: { label: "Golos",  value: 31, key: "golos"  }, stat2: { label: "Assist.", value: 4,  key: "assist"   }, rating: 9.5, nacionalidade: "BR", jogos: 27 },
  { number: 8,  name: "Dani Ferreira",  position: "Ala",           team: "futsal", gender: "masculino",
    stat1: { label: "Golos",  value: 18, key: "golos"  }, stat2: { label: "Assist.", value: 9,  key: "assist"   }, rating: 8.0, nacionalidade: "PT", jogos: 26 },
  { number: 3,  name: "Pedro Nunes",    position: "Fixo",          team: "futsal", gender: "masculino",
    stat1: { label: "Desarmes", value: 38, key: "desarmes" }, stat2: { label: "Golos", value: 2, key: "golos" }, rating: 7.5, nacionalidade: "PT", jogos: 24 },
  { number: 11, name: "André Costa",    position: "Ala / Pivot",   team: "futsal", gender: "masculino",
    stat1: { label: "Golos",  value: 22, key: "golos"  }, stat2: { label: "Assist.", value: 14, key: "assist"   }, rating: 8.3, nacionalidade: "PT", jogos: 29 },
  { number: 13, name: "Fábio Lima",     position: "Guarda-Redes",  team: "futsal", gender: "masculino",
    stat1: { label: "Defesas", value: 9,  key: "defesas" }, stat2: { label: "Clean Sheet", value: 1, key: "cleanSheet" }, rating: 7.2, nacionalidade: "PT", jogos: 8 },
];

const TEAMS  = ["Todas as Equipas", "Futsal Principal", "Formação"] as const;
const GENDER = ["Masculino", "Feminino"] as const;

// ── Stat icon mapping ──
const STAT_ICON: Record<StatKey, typeof Trophy> = {
  golos:      Target,
  assist:     Trophy,
  defesas:    Shield,
  cleanSheet: Shield,
  desarmes:   Shield,
};

// ── Rating colour ──
function ratingColour(r: number): string {
  if (r >= 9) return "text-yellow";
  if (r >= 8) return "text-green-400";
  return "text-on-surface";
}

// ── FLIP 3D PLAYER CARD ─────────────────────────────────────────
function PlayerCard({ p }: { p: Player }) {
  const Stat1Icon = STAT_ICON[p.stat1.key];
  const Stat2Icon = STAT_ICON[p.stat2.key];

  return (
    <div className="perspective-1000 group">
      <div className="relative w-full aspect-[3/4] preserve-3d transition-transform duration-700 ease-out group-hover:rotate-y-180">

        {/* ═══ FRONT FACE ═══ */}
        <div className="absolute inset-0 backface-hidden">
          {/* Photo area */}
          <div className="w-full h-full bg-surface-mid overflow-hidden relative">
            {/* Placeholder gradient */}
            <div className="w-full h-full bg-gradient-to-b from-surface-highest to-surface-mid flex items-center justify-center">
              <span className="font-headline font-black text-8xl text-on-surface/5 italic">
                {p.number}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />

            {/* Jersey number watermark */}
            <div className="absolute top-3 left-4">
              <span className="font-headline font-black italic text-7xl text-white/10 leading-none">
                {p.number}
              </span>
            </div>

            {/* Rating badge — top right */}
            <div className="absolute top-3 right-3 bg-blue px-2.5 py-1.5">
              <span className={`font-headline font-black italic text-lg leading-none ${ratingColour(p.rating)}`}>
                {p.rating}
              </span>
            </div>

            {/* Name + position */}
            <div className="absolute bottom-0 left-0 w-full p-5">
              <div className="font-body text-[10px] font-black uppercase tracking-widest text-yellow mb-1">
                {p.position}
              </div>
              <h3 className="font-headline font-black italic text-2xl uppercase leading-none text-white">
                {p.name.split(" ")[0]}<br />{p.name.split(" ").slice(1).join(" ")}
              </h3>
            </div>

            {/* "Flip for stats" hint */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="font-body text-[8px] uppercase tracking-widest text-white/40">
                ↻ Stats
              </span>
            </div>
          </div>
        </div>

        {/* ═══ BACK FACE — Stats detalhados ═══ */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="w-full h-full bg-gradient-to-b from-blue-deep to-surface-mid flex flex-col overflow-hidden relative">

            {/* Number watermark — giant, background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-headline font-black italic text-[14rem] text-white/[0.03] leading-none select-none">
                {p.number}
              </span>
            </div>

            {/* Header — name + number */}
            <div className="relative p-5 pb-3 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-body text-[9px] font-black uppercase tracking-widest text-yellow">
                    #{p.number} · {p.position}
                  </span>
                  <h3 className="font-headline font-black italic text-xl uppercase leading-tight text-white mt-1">
                    {p.name}
                  </h3>
                </div>
                <div className="bg-yellow px-2.5 py-1.5">
                  <span className="font-headline font-black italic text-xl text-black leading-none">
                    {p.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="relative flex-1 p-5 flex flex-col justify-center gap-4">

              {/* Primary stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 flex flex-col items-center">
                  <Stat1Icon size={16} className="text-yellow mb-1.5" />
                  <span className="font-headline font-black italic text-3xl text-white leading-none">
                    {p.stat1.value}
                  </span>
                  <span className="font-body text-[8px] font-bold uppercase tracking-widest text-white/50 mt-1">
                    {p.stat1.label}
                  </span>
                </div>
                <div className="bg-white/5 p-3 flex flex-col items-center">
                  <Stat2Icon size={16} className="text-yellow mb-1.5" />
                  <span className="font-headline font-black italic text-3xl text-white leading-none">
                    {p.stat2.value}
                  </span>
                  <span className="font-body text-[8px] font-bold uppercase tracking-widest text-white/50 mt-1">
                    {p.stat2.label}
                  </span>
                </div>
              </div>

              {/* Secondary stats row */}
              <div className="flex gap-2">
                <div className="flex-1 bg-white/5 py-2.5 text-center">
                  <div className="font-headline font-black italic text-lg text-white">{p.jogos ?? "—"}</div>
                  <div className="font-body text-[8px] font-bold uppercase tracking-widest text-white/50">Jogos</div>
                </div>
                <div className="flex-1 bg-white/5 py-2.5 text-center">
                  <div className="font-headline font-black italic text-lg text-white">{p.nacionalidade ?? "—"}</div>
                  <div className="font-body text-[8px] font-bold uppercase tracking-widest text-white/50">Nac.</div>
                </div>
                <div className="flex-1 bg-white/5 py-2.5 text-center flex flex-col items-center justify-center">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className={i < Math.round(p.rating / 2) ? "text-yellow fill-yellow" : "text-white/20"}
                      />
                    ))}
                  </div>
                  <div className="font-body text-[8px] font-bold uppercase tracking-widest text-white/50 mt-0.5">Nível</div>
                </div>
              </div>
            </div>

            {/* Bottom bar — club branding */}
            <div className="relative border-t border-white/10 px-5 py-3 flex items-center justify-between">
              <span className="font-headline font-black text-[10px] uppercase tracking-widest text-white/30">
                Valejas AC
              </span>
              <span className="font-body text-[9px] text-white/30">
                2024/25
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────
export default function PlantelFilter() {
  const [activeTeam, setActiveTeam]     = useState<string>("Todas as Equipas");
  const [activeGender, setActiveGender] = useState<string>("Masculino");
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const filtered = PLAYERS.filter((p) => {
    const genderOk = activeGender.toLowerCase() === p.gender;
    const teamOk =
      activeTeam === "Todas as Equipas" ||
      (activeTeam === "Futsal Principal" && p.team === "futsal") ||
      (activeTeam === "Formação"         && p.team === "formacao");
    return genderOk && teamOk;
  });

  // Re-animate on filter change
  useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(
      gridRef.current.querySelectorAll(".player-card-anim"),
      { y: 20, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, ease: "back.out(1.4)" }
    );
  }, [activeTeam, activeGender]);

  // Scroll entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1, duration: 0.5,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Sticky filter bar */}
      <div className="sticky top-16 z-40 bg-surface-low/95 backdrop-blur-xl border-b border-on-surface/10">
        <div className="section-container py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Team tabs */}
            <div className="flex items-center gap-1 bg-surface p-1 rounded-full border border-on-surface/10">
              {TEAMS.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTeam(t)}
                  className={`px-5 py-1.5 rounded-full font-headline font-black uppercase tracking-tight text-xs transition-all duration-200 ${
                    activeTeam === t
                      ? "bg-yellow text-black"
                      : "text-on-surface-muted hover:text-on-surface"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Gender tabs */}
            <div className="flex items-center gap-2">
              {GENDER.map((g) => (
                <button
                  key={g}
                  onClick={() => setActiveGender(g)}
                  className={`font-headline font-black uppercase tracking-tight text-xs px-4 py-1.5 transition-all duration-200 ${
                    activeGender === g
                      ? "bg-blue text-white"
                      : "text-on-surface-muted hover:text-on-surface border border-on-surface/10"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section ref={sectionRef} className="bg-surface py-16 md:py-24">
        <div className="section-container">
          <h2 className="font-headline font-black italic text-4xl uppercase tracking-tighter text-on-surface mb-10">
            Plantel Principal
          </h2>

          <div
            ref={gridRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10"
          >
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <div key={p.number} className="player-card-anim">
                  <PlayerCard p={p} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-on-surface-muted font-body">
                Nenhum jogador encontrado com estes filtros.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
