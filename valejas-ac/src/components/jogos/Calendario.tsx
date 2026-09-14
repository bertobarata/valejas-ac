import clsx from "clsx";
import { MapPin } from "lucide-react";
import {
  CALENDARIO, CLUBE, EPOCA, ehValejas, formatarHora,
} from "@/lib/data/jogos";

/**
 * CALENDÁRIO DA ÉPOCA
 * ─────────────────────────────────────────────────────────────────
 * As trinta jornadas como saem do programa de jogos da AF Lisboa.
 * Quem vem aqui quer saber duas coisas: quando é o próximo, e se é
 * em casa. Por isso a jornada seguinte fica marcada e o «casa/fora»
 * é a primeira coisa depois da data.
 * ─────────────────────────────────────────────────────────────────
 */
export default function Calendario() {
  const agora = new Date();
  const proximoIndice = CALENDARIO.findIndex((j) => new Date(j.data) >= agora);

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-6">
        <h2 className="font-headline font-black uppercase text-2xl md:text-3xl tracking-tighter text-on-surface">
          Calendário
        </h2>
        <p className="font-body text-sm text-on-surface-muted">
          {CALENDARIO.length} jornadas · época {EPOCA}
        </p>
      </div>

      <ol className="border-t border-on-surface/15">
        {CALENDARIO.map((jogo, i) => {
          const emCasa   = ehValejas(jogo.casa);
          const adversario = emCasa ? jogo.fora : jogo.casa;
          const passado  = new Date(jogo.data) < agora;
          const seguinte = i === proximoIndice;
          const data = new Date(jogo.data);

          return (
            <li
              key={`${jogo.jornada}-${jogo.data}`}
              className={clsx(
                "border-b border-on-surface/10 py-3.5 px-3 -mx-3",
                seguinte && "bg-yellow/15",
                passado && "opacity-50"
              )}
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-headline font-black text-sm text-on-surface-muted w-10 shrink-0 tabular-nums">
                  J{jogo.jornada}
                </span>

                <span className="font-body text-sm text-on-surface-muted w-24 shrink-0 tabular-nums">
                  {new Intl.DateTimeFormat("pt-PT", {
                    day: "2-digit", month: "2-digit", year: "2-digit",
                    timeZone: "Europe/Lisbon",
                  }).format(data)}
                </span>

                <span
                  className={clsx(
                    "font-body text-[0.7rem] font-bold uppercase tracking-widest px-2 py-0.5 shrink-0",
                    emCasa
                      ? "bg-yellow/25 text-on-surface"
                      : "border border-on-surface/25 text-on-surface-muted"
                  )}
                >
                  {emCasa ? "Casa" : "Fora"}
                </span>

                <span className="font-headline font-black uppercase text-base text-on-surface flex-1 min-w-[10rem]">
                  {emCasa ? `${CLUBE} – ${adversario}` : `${adversario} – ${CLUBE}`}
                </span>

                <span className="font-body text-sm text-on-surface tabular-nums shrink-0">
                  {formatarHora(jogo.data)}
                </span>
              </div>

              {jogo.local && (
                <p className="flex items-start gap-2 font-body text-xs text-on-surface-muted mt-1 pl-14">
                  <MapPin size={12} className="shrink-0 mt-0.5" aria-hidden />
                  {jogo.local}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
