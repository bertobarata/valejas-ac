import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FUNDACAO, ORIGENS, anosDeVida } from "@/lib/data/historia";
import { MODALIDADES } from "@/lib/data/modalidades";
import { ORGAOS } from "@/lib/data/orgaosSociais";
import { INSTALACOES } from "@/lib/data/instalacoes";
import { ATIVIDADES, ACADEMIA } from "@/lib/data/academiaSenior";
import { CALENDARIO, EPOCA } from "@/lib/data/jogos";

/**
 * CONHECER O CLUBE
 * ─────────────────────────────────────────────────────────────────
 * Quem chega ao mote já leu o site todo por cima e é aí que fica com
 * vontade de saber mais. Esta secção existe para ter onde ir a seguir.
 *
 * Cada cartão traz um facto verdadeiro em vez de um convite vago —
 * «60 anos» diz mais do que «conhece a nossa história», e todos saem
 * da camada de dados, por isso não podem ficar desatualizados.
 * ─────────────────────────────────────────────────────────────────
 */
export default function ConhecerClube() {
  const anos = anosDeVida();
  const membros = ORGAOS.reduce((total, o) => total + o.membros.length, 0);
  const jogosEmCasa = CALENDARIO.filter((j) => j.local?.includes("Valejas")).length;

  const materia = [
    {
      href: "/clube",
      etiqueta: `Desde ${FUNDACAO.ano}`,
      titulo: "A história",
      texto:
        `${anos} anos, começados no atletismo, no cicloturismo e na malha — ` +
        `muito antes do futsal. O que se sabe, e o que ainda falta descobrir.`,
      destaque: true,
    },
    {
      href: "/clube/emblema",
      etiqueta: "A águia e as cores",
      titulo: "O emblema",
      texto: "O que cada parte quer dizer, e porque é que o clube joga de amarelo e azul.",
    },
    {
      href: "/modalidades",
      etiqueta: `${MODALIDADES.length} modalidades`,
      titulo: "O que se pratica",
      texto: "Do pavilhão à pista e à estrada, mais a dança e o teatro. Umas competem federadas, outras existem só para formar.",
    },
    {
      href: "/jogos",
      etiqueta: `Época ${EPOCA}`,
      titulo: "Os jogos",
      texto: `${CALENDARIO.length} jornadas no distrital da AF Lisboa, ${jogosEmCasa} delas em casa. Calendário, resultados e classificação.`,
    },
    {
      href: "/instalacoes",
      etiqueta: `${INSTALACOES.length} espaços`,
      titulo: "Onde acontece",
      texto: "A sede, onde a Direção trabalha e a Academia se reúne. E o pavilhão, onde se joga.",
    },
    {
      href: "/orgaos-sociais",
      etiqueta: `${membros} pessoas`,
      titulo: "Quem dirige",
      texto: "Direção, Conselho Fiscal e Mesa da Assembleia. Todos sócios, a maior parte há décadas.",
    },
    {
      href: "/academia-senior",
      etiqueta: ACADEMIA.idade,
      titulo: "Academia Sénior",
      texto: `${ATIVIDADES.length} atividades, do coro ao chi kung. O clube não acaba quando se deixa de competir.`,
    },
    {
      href: "/patrocinadores",
      etiqueta: "Quem apoia",
      titulo: "Patrocinadores",
      texto: "As empresas e as pessoas da terra que seguram o clube de pé.",
    },
  ];

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="section-container">
        <div className="max-w-2xl mb-10">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-yellow mb-3">
            Ficar a conhecer
          </p>
          <h2 className="section-title">
            Um clube não se explica <span>numa frase</span>
          </h2>
          <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-5">
            {anos} anos dão para muita coisa: {ORIGENS.length} atividades no princípio,
            {" "}{MODALIDADES.length} modalidades hoje, e gente que entra em criança e
            fica para a vida. Escolhe por onde começar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-on-surface/10">
          {materia.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`group bg-surface-high p-7 flex flex-col justify-between min-h-[13rem] ${
                m.destaque ? "sm:col-span-2" : ""
              }`}
            >
              <div>
                <p className="font-body text-xs font-bold uppercase tracking-widest text-yellow">
                  {m.etiqueta}
                </p>
                <h3 className="font-headline font-black uppercase text-xl md:text-2xl tracking-tight text-on-surface leading-none mt-2 group-hover:text-yellow transition-colors duration-300">
                  {m.titulo}
                </h3>
                <p className="font-body text-sm text-on-surface-muted leading-relaxed mt-3">
                  {m.texto}
                </p>
              </div>
              <ArrowUpRight
                size={16}
                aria-hidden
                className="text-on-surface-muted group-hover:text-yellow transition-colors duration-300 mt-5 self-end"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
