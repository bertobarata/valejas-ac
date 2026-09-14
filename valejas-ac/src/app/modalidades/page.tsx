import type { Metadata } from "next";
import Link from "next/link";
import { GRUPOS, VAGAS, getModalidadesPorGrupo } from "@/lib/data/modalidades";
import ModalidadesAccordion from "@/components/modalidades/ModalidadesAccordion";

export const metadata: Metadata = {
  title: "Modalidades",
  description:
    "Futsal e atletismo federados, judo, karate, dança, teatro e cicloturismo — " +
    "um clube, muitas formas de pertencer.",
};

export default function ModalidadesPage() {
  return (
    <div className="bg-surface">
      {/* Cabeçalho */}
      <section className="section-container pt-14 md:pt-16 pb-6">
        <p className="font-body text-xs font-bold uppercase tracking-widest text-blue mb-3">
          Um clube, muitas idades
        </p>
        <h1 className="font-headline font-black uppercase wdth-condensed tracking-tighter leading-none text-4xl md:text-6xl text-on-surface max-w-3xl">
          Há um lugar para ti no Valejas
        </h1>
        <p className="font-body text-lg text-on-surface-muted mt-4 max-w-2xl">
          Do pavilhão à pista, do tatami ao palco. Competição federada, formação
          para os mais novos e atividades abertas à comunidade.
        </p>

        <div className="mt-8 max-w-2xl bg-surface-high p-6">
          <p className="font-headline font-black uppercase text-sm text-on-surface">
            {VAGAS.titulo}
          </p>
          <p className="font-body text-on-surface-muted leading-relaxed mt-1">
            {VAGAS.texto}
          </p>
        </div>
      </section>

      {GRUPOS.map((grupo) => {
        const itens = getModalidadesPorGrupo(grupo.id);
        return (
          <section
            key={grupo.id}
            id={grupo.id}
            className="section-container py-14 md:py-16 scroll-mt-24"
          >
            <div className="border-t border-on-surface/15 pt-8 mb-10">
              <h2 className="font-headline font-black uppercase tracking-tighter leading-none text-3xl md:text-4xl text-on-surface">
                {grupo.titulo}
              </h2>
              <p className="font-body text-on-surface-muted mt-2 max-w-2xl">
                {grupo.intro}
              </p>
            </div>

            <ModalidadesAccordion itens={itens} />

          </section>
        );
      })}

      {/* Academia Sénior — programa comunitário, não modalidade */}
      <section className="section-container py-14 md:py-16">
        <div className="border-t border-on-surface/15 pt-8">
          <div className="bg-surface-high p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div className="max-w-xl">
              <p className="font-body text-xs font-bold uppercase tracking-widest text-yellow mb-2">
                Maiores de 50
              </p>
              <h2 className="font-headline font-black uppercase tracking-tight leading-none text-2xl md:text-3xl text-on-surface">
                Academia Sénior
              </h2>
              <p className="font-body text-on-surface-muted leading-relaxed mt-2">
                Coro, chi kung, pintura, informática, danças tradicionais, sueca e
                bilhar. O clube não acaba quando se deixa de competir.
              </p>
            </div>
            <Link href="/academia-senior" className="btn-primary shrink-0 text-sm">
              Conhecer a Academia
            </Link>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="section-container pb-24 md:pb-32">
        <div className="bg-blue text-white p-8 md:p-10 flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
          <div className="max-w-lg">
            <p className="font-headline font-black uppercase tracking-tight leading-tight text-xl md:text-2xl">
              Queres experimentar? Fala connosco e trazemos-te para dentro.
            </p>
            <p className="font-body text-sm text-white/85 mt-2">
              {VAGAS.curto}.
            </p>
          </div>
          <Link
            href="/inscricoes"
            className="btn-primary shrink-0 bg-yellow text-blue-deep hover:bg-yellow-dim"
          >
            Inscrever ou saber mais
          </Link>
        </div>
      </section>
    </div>
  );
}
