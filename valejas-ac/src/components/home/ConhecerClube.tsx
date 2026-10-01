import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { FUNDACAO, ORIGENS, anosDeVida } from "@/lib/data/historia";
import { MODALIDADES } from "@/lib/data/modalidades";
import { ORGAOS } from "@/lib/data/orgaosSociais";
import { INSTALACOES } from "@/lib/data/instalacoes";
import { ATIVIDADES } from "@/lib/data/academiaSenior";
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
  const t = useTranslations("inicio.conhecer");
  const anos = anosDeVida();
  const membros = ORGAOS.reduce((total, o) => total + o.membros.length, 0);
  const jogosEmCasa = CALENDARIO.filter((j) => j.local?.includes("Valejas")).length;

  // Os números saem dos dados; as palavras, das traduções
  // (inicio.conhecer.cartoes.<id>).
  const materia = [
    {
      href: "/clube",
      // Em texto, para o ano não sair «1,966» em inglês.
      etiqueta: t("cartoes.historia.etiqueta", { ano: String(FUNDACAO.ano) }),
      titulo: t("cartoes.historia.titulo"),
      texto: t("cartoes.historia.texto", { anos }),
      destaque: true,
    },
    {
      href: "/clube/emblema",
      etiqueta: t("cartoes.emblema.etiqueta"),
      titulo: t("cartoes.emblema.titulo"),
      texto: t("cartoes.emblema.texto"),
    },
    {
      href: "/modalidades",
      etiqueta: t("cartoes.modalidades.etiqueta", { n: MODALIDADES.length }),
      titulo: t("cartoes.modalidades.titulo"),
      texto: t("cartoes.modalidades.texto"),
    },
    {
      href: "/jogos",
      etiqueta: t("cartoes.jogos.etiqueta", { epoca: EPOCA }),
      titulo: t("cartoes.jogos.titulo"),
      texto: t("cartoes.jogos.texto", { jornadas: CALENDARIO.length, emCasa: jogosEmCasa }),
    },
    {
      href: "/instalacoes",
      etiqueta: t("cartoes.instalacoes.etiqueta", { n: INSTALACOES.length }),
      titulo: t("cartoes.instalacoes.titulo"),
      texto: t("cartoes.instalacoes.texto"),
    },
    {
      href: "/orgaos-sociais",
      etiqueta: t("cartoes.orgaos.etiqueta", { n: membros }),
      titulo: t("cartoes.orgaos.titulo"),
      texto: t("cartoes.orgaos.texto"),
    },
    {
      href: "/academia-senior",
      // Era ACADEMIA.idade; o texto passou para as traduções.
      etiqueta: t("cartoes.academia.etiqueta"),
      titulo: t("cartoes.academia.titulo"),
      texto: t("cartoes.academia.texto", { n: ATIVIDADES.length }),
    },
    {
      href: "/patrocinadores",
      etiqueta: t("cartoes.patrocinadores.etiqueta"),
      titulo: t("cartoes.patrocinadores.titulo"),
      texto: t("cartoes.patrocinadores.texto"),
    },
  ];

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="section-container">
        <div className="max-w-2xl mb-10">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-yellow mb-3">
            {t("etiqueta")}
          </p>
          <h2 className="section-title">
            {t.rich("titulo", { destaque: (c) => <span>{c}</span> })}
          </h2>
          <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-5">
            {t("texto", { anos, origens: ORIGENS.length, modalidades: MODALIDADES.length })}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-px md:bg-on-surface/10">
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
