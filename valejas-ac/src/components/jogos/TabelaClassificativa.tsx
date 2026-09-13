import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STANDINGS = [
  { pos: 1, team: "Valejas AC",    j: 12, sg: "+28", pts: 34, isUs: true },
  { pos: 2, team: "Lions FC",      j: 12, sg: "+22", pts: 31, isUs: false },
  { pos: 3, team: "Dragões Sul",   j: 12, sg: "+15", pts: 28, isUs: false },
  { pos: 4, team: "Eagles United", j: 13, sg: "+4",  pts: 24, isUs: false },
  { pos: 5, team: "Titan's",       j: 12, sg: "-2",  pts: 19, isUs: false },
];

export default function TabelaClassificativa() {
  return (
    <div className="bg-surface-mid p-6">
      <h3 className="font-headline font-black text-2xl uppercase tracking-tighter text-on-surface mb-6">
        Tabela Classificativa
      </h3>

      {/* Header row */}
      <div className="grid grid-cols-12 font-body text-[9px] font-bold uppercase tracking-widest text-on-surface-muted mb-3 px-2">
        <span className="col-span-1">#</span>
        <span className="col-span-5">Equipa</span>
        <span className="col-span-2 text-center">J</span>
        <span className="col-span-2 text-center">SG</span>
        <span className="col-span-2 text-right">PTS</span>
      </div>

      <div className="space-y-1">
        {STANDINGS.map((row) => (
          <div
            key={row.team}
            className={`grid grid-cols-12 items-center py-2.5 px-2 transition-colors duration-200 ${
              row.isUs
                ? "bg-yellow/10 border-l-2 border-yellow"
                : "hover:bg-surface-high"
            }`}
          >
            <span className={`col-span-1 font-headline font-black text-sm ${row.isUs ? "text-yellow" : "text-on-surface-muted"}`}>
              {row.pos}
            </span>
            <div className="col-span-5 flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${row.isUs ? "bg-yellow" : "bg-on-surface-muted/40"}`} />
              <span className={`font-body font-semibold text-xs ${row.isUs ? "text-on-surface" : "text-on-surface-muted"}`}>
                {row.team}
              </span>
            </div>
            <span className="col-span-2 text-center font-body text-xs text-on-surface-muted">{row.j}</span>
            <span className="col-span-2 text-center font-body text-xs text-on-surface-muted">{row.sg}</span>
            <span className={`col-span-2 text-right font-headline font-black text-sm ${row.isUs ? "text-yellow" : "text-on-surface"}`}>
              {row.pts}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/jogos/classificacao"
        className="mt-5 flex items-center justify-end gap-1.5 font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted hover:text-yellow transition-colors duration-200"
      >
        Ver classificação completa <ArrowRight size={12} />
      </Link>
    </div>
  );
}
