import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, MessageSquare, UserPlus } from "lucide-react";
import { MODALIDADES, VAGAS } from "@/lib/data/modalidades";
import { QUOTA_MENSAL, formatEuros } from "@/lib/data/quota";
import PedidoInscricao from "@/components/inscricoes/PedidoInscricao";

export const metadata: Metadata = {
  title: "Inscrições",
  description:
    "Como começar a praticar no Valejas Atlético Clube: fazer-se sócio, pedir vaga na modalidade e fechar a inscrição na sede.",
};

/**
 * INSCRIÇÕES
 * ─────────────────────────────────────────────────────────────────
 * Quem quer praticar no clube tropeça sempre na mesma ordem: primeiro
 * sócio, depois vaga, depois a sede. Esta página existe para dizer
 * isso por ordem, em vez de a pessoa descobrir pelo caminho.
 * ─────────────────────────────────────────────────────────────────
 */
export default function InscricoesPage() {
  const passos = [
    {
      Icon: UserPlus,
      titulo: "Primeiro, ser sócio",
      texto:
        `Não se pratica no clube sem ser sócio — vale para todas as ` +
        `modalidades e para todas as idades. A quota é de ${formatEuros(QUOTA_MENSAL)} por mês, ` +
        `igual para toda a gente.`,
      accao: { label: "Fazer-me sócio", href: "/socios/inscricao" },
    },
    {
      Icon: MessageSquare,
      titulo: "Depois, pedir vaga",
      texto:
        "Cada modalidade tem poucos lugares. Dizes-nos o que te interessa " +
        "no formulário aqui em baixo e respondemos se há vaga — antes de " +
        "contares com ela.",
    },
    {
      Icon: ClipboardCheck,
      titulo: "Por fim, na sede",
      texto:
        "Havendo vaga, a inscrição desportiva fecha-se na sede: assina-se a " +
        "ficha da federação e entrega-se o exame médico. É também aí que se " +
        "escolhe o horário e se trata do equipamento.",
    },
  ];

  return (
    <div className="bg-surface">
      {/* Cabeçalho */}
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-16 md:py-20">
          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            Começar a praticar
          </p>
          <h1 className="section-title text-4xl md:text-6xl">
            <span>Inscrições</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-on-surface-muted mt-5 max-w-2xl leading-relaxed">
            {MODALIDADES.length} modalidades, dos petizes aos seniores. Começa-se
            sempre da mesma maneira — e são três passos.
          </p>
        </div>
      </section>

      {/* Os três passos */}
      <section className="section-container py-14 md:py-20">
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-on-surface/10">
          {passos.map(({ Icon, titulo, texto, accao }, i) => (
            <li key={titulo} className="bg-surface-high p-7 md:p-8 flex flex-col">
              <span
                aria-hidden
                className="font-headline font-black text-5xl text-yellow/30 leading-none"
              >
                0{i + 1}
              </span>
              <Icon size={22} className="text-yellow mt-5" aria-hidden />
              <h2 className="font-headline font-black uppercase text-xl text-on-surface mt-4">
                {titulo}
              </h2>
              <p className="font-body text-on-surface-muted leading-relaxed mt-2 flex-1">
                {texto}
              </p>
              {accao && (
                <Link href={accao.href} className="btn-primary text-sm mt-6 self-start">
                  {accao.label} <ArrowRight size={14} />
                </Link>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Formulário */}
      <section
        id="pedir-vaga"
        className="section-container py-14 md:py-20 border-t border-on-surface/10 scroll-mt-32"
      >
        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 lg:gap-16">
          <div>
            <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
              Pedir vaga
            </h2>
            <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-4">
              {VAGAS.texto}
            </p>
            <p className="font-body text-on-surface-muted leading-relaxed mt-4">
              Isto não é a inscrição — é o primeiro contacto. Nada fica
              guardado neste site: o pedido segue por email para o clube e
              desaparece daqui.
            </p>
          </div>

          <PedidoInscricao />
        </div>
      </section>
    </div>
  );
}
