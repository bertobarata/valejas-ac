import { CalendarDays, MapPin } from "lucide-react";
import {
  ehValejas, formatarData, formatarHora, type Jogo,
} from "@/lib/data/jogos";

export default function ProximoJogo({ jogo }: { jogo: Jogo | null }) {
  if (!jogo) {
    return (
      <div className="border border-dashed border-on-surface/25 p-10 text-center">
        <p className="font-body text-on-surface-muted">
          Próximo jogo ainda por anunciar.
        </p>
      </div>
    );
  }

  const j = jogo;

  return (
    <article className="section-dark bg-blue text-white p-7 md:p-10">
      <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-yellow">
        Próximo jogo
      </p>

      {/* Equipas */}
      <div className="mt-7 flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4 md:gap-6">
        <Equipa nome={j.casa} nosso={ehValejas(j.casa)} alinhamento="direita" />
        <span
          aria-hidden
          className="font-headline font-black text-xl sm:text-2xl md:text-3xl text-white/60 sm:text-white/40"
        >
          VS
        </span>
        <Equipa nome={j.fora} nosso={ehValejas(j.fora)} alinhamento="esquerda" />
      </div>

      {/* Data e local */}
      <div className="mt-9 pt-7 border-t border-white/15 space-y-3">
        <p className="flex items-center gap-3 font-body text-sm md:text-base text-white/85">
          <CalendarDays size={18} className="text-yellow flex-shrink-0" />
          <span className="first-letter:uppercase">{formatarData(j.data)}</span>
          <span className="text-white/60" aria-hidden>·</span>
          <span>{formatarHora(j.data)}</span>
        </p>
        <p className="flex items-center gap-3 font-body text-sm md:text-base text-white/85">
          <MapPin size={18} className="text-yellow flex-shrink-0" />
          {j.local}
        </p>
      </div>

      {j.competicao && (
        <p className="font-body text-xs uppercase tracking-widest text-white/85 mt-6">
          {j.competicao}
        </p>
      )}
    </article>
  );
}

function Equipa({
  nome, nosso, alinhamento,
}: {
  nome: string;
  nosso: boolean;
  alinhamento: "esquerda" | "direita";
}) {
  return (
    <p
      className={`font-headline font-black uppercase leading-none tracking-tighter text-xl md:text-3xl ${
        nosso ? "text-yellow" : "text-white"
      } ${alinhamento === "direita" ? "sm:text-right" : "text-left"}`}
    >
      {nome}
    </p>
  );
}
