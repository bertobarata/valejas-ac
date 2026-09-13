import {
  ehValejas, formatarDataCurta, resultadoParaValejas, type Jogo,
} from "@/lib/data/jogos";

const ETIQUETA = {
  vitoria: { texto: "V", classe: "bg-yellow text-blue-deep" },
  empate:  { texto: "E", classe: "bg-on-surface/20 text-on-surface" },
  derrota: { texto: "D", classe: "bg-on-surface/10 text-on-surface-muted" },
} as const;

export default function ResultadosRecentes({ jogos }: { jogos: Jogo[] }) {
  if (jogos.length === 0) {
    return (
      <div className="border border-dashed border-on-surface/25 p-10 text-center">
        <p className="font-body text-on-surface-muted">
          Ainda não há resultados para mostrar.
        </p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="font-headline font-black uppercase text-2xl md:text-3xl tracking-tighter text-on-surface mb-6">
        Resultados recentes
      </h2>

      <div className="flex flex-col divide-y divide-on-surface/10 border-y border-on-surface/10">
        {jogos.map((j) => {
          const r = resultadoParaValejas(j);
          const etiqueta = r ? ETIQUETA[r] : null;

          return (
            <article key={j.data} className="py-6">
              <div className="flex items-start gap-4">
                {etiqueta && (
                  <span
                    className={`font-headline font-black text-sm w-8 h-8 flex items-center justify-center flex-shrink-0 ${etiqueta.classe}`}
                    aria-label={r === "vitoria" ? "Vitória" : r === "empate" ? "Empate" : "Derrota"}
                  >
                    {etiqueta.texto}
                  </span>
                )}

                <div className="flex-1 min-w-0">
                  {/* Equipas e resultado */}
                  <div className="flex flex-col gap-1 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-3">
                    <p
                      className={`font-headline font-black uppercase text-base md:text-lg leading-tight sm:text-right ${
                        ehValejas(j.casa) ? "text-on-surface" : "text-on-surface-muted"
                      }`}
                    >
                      {j.casa}
                    </p>
                    <p className="font-headline font-black text-xl md:text-2xl text-on-surface whitespace-nowrap">
                      {j.golosCasa} <span className="text-on-surface-muted">–</span> {j.golosFora}
                    </p>
                    <p
                      className={`font-headline font-black uppercase text-base md:text-lg leading-tight ${
                        ehValejas(j.fora) ? "text-on-surface" : "text-on-surface-muted"
                      }`}
                    >
                      {j.fora}
                    </p>
                  </div>

                  {/* Data e local */}
                  <p className="font-body text-sm text-on-surface-muted mt-2.5">
                    {formatarDataCurta(j.data)}
                  </p>
                  <p className="font-body text-sm text-on-surface-muted">
                    {j.local}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
