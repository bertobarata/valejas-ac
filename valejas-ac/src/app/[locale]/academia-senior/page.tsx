import type { Metadata } from "next";
import { paraPagina } from "@/lib/seo/metadados";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
import {
  ACADEMIA, FAMILIAS, atividadesPorFamilia,
} from "@/lib/data/academiaSenior";
// Importação estática: o Next tira daqui as dimensões e o placeholder
// desfocado. Ficheiros já sem EXIF/GPS (ver public/academia-senior/).
import fotoArcos from "../../../public/academia-senior/jogo-dos-arcos.webp";
import fotoRoda from "../../../public/academia-senior/roda-no-recreio.webp";
import fotoLabirintos from "../../../public/academia-senior/labirintos-de-cartao.webp";

export const metadata: Metadata = paraPagina("/academia-senior", {
  title: "Academia Sénior",
  description:
    "Programa comunitário do Valejas A.C. Social para maiores de 50 anos. " +
    "Coro, chi kung, pintura, informática, danças tradicionais, sueca e bilhar.",
});

export default function AcademiaSeniorPage() {
  return (
    <div className="bg-surface">
      {/* Cabeçalho */}
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-20 md:py-28 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] gap-12 lg:gap-16 items-center">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
              {ACADEMIA.projeto}
            </p>
            <h1 className="font-headline font-black text-5xl md:text-7xl uppercase leading-none tracking-tighter text-on-surface">
              Academia <span className="text-yellow">Sénior</span>
            </h1>
            <p className="font-body text-xl md:text-2xl text-blue mt-5 leading-relaxed">
              {ACADEMIA.tagline}
            </p>
            <p className="font-body text-lg text-on-surface-muted mt-4 max-w-2xl leading-relaxed">
              {ACADEMIA.intro}
            </p>

            {/* Prática — onde e quando */}
            <div className="mt-10 flex flex-col sm:flex-row gap-8">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-yellow flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted">
                    Onde
                  </p>
                  <p className="font-body text-base text-on-surface mt-1">{ACADEMIA.local}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-yellow flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted">
                    Quando
                  </p>
                  {ACADEMIA.horario.map((h) => (
                    <p key={h.dias} className="font-body text-base text-on-surface mt-1">
                      {h.dias} — {h.horas}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <figure>
            <div className="relative aspect-[4/3] lg:aspect-[4/5] overflow-hidden bg-surface-high">
              <Image
                src={fotoArcos}
                alt="Uma participante da Academia Sénior faz o jogo dos arcos coloridos no chão, enquanto crianças e outras seniores esperam a vez."
                fill
                priority
                placeholder="blur"
                sizes="(max-width: 1024px) 100vw, 30rem"
                className="object-cover object-[50%_72%] lg:object-[50%_60%]"
              />
            </div>
            <figcaption className="font-body text-sm text-on-surface-muted mt-3">
              Jogo dos arcos, a meias com os mais novos.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Atividades, por família */}
      <section className="section-container py-16 md:py-24">
        <h2 className="font-headline font-black uppercase tracking-tighter leading-none text-3xl md:text-4xl text-on-surface">
          O que se faz
        </h2>
        <p className="font-body text-on-surface-muted mt-2 max-w-2xl">
          Não é preciso saber nada de antemão. Nenhuma atividade exige experiência.
        </p>

        <div className="mt-12 space-y-14">
          {FAMILIAS.map((f) => {
            const itens = atividadesPorFamilia(f.id);
            if (itens.length === 0) return null;
            return (
              <div key={f.id}>
                <h3 className="font-headline font-black text-2xl uppercase tracking-tighter text-yellow border-b border-on-surface/10 pb-3">
                  {f.titulo}
                </h3>
                <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-14">
                  {itens.map((a) => (
                    <li
                      key={a.nome}
                      className="py-4 border-b border-on-surface/10 flex flex-col sm:flex-row sm:items-baseline gap-x-5 gap-y-1"
                    >
                      <span className="font-headline font-black uppercase text-lg text-on-surface sm:w-44 shrink-0">
                        {a.nome}
                      </span>
                      <span className="font-body text-on-surface-muted leading-relaxed">
                        {a.descricao}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Entre gerações — fotografias */}
      <section className="bg-surface-low border-t border-on-surface/10">
        <div className="section-container py-16 md:py-24">
          <h2 className="font-headline font-black uppercase tracking-tighter leading-none text-3xl md:text-4xl text-on-surface">
            Com os mais novos
          </h2>
          <p className="font-body text-on-surface-muted mt-2 max-w-2xl leading-relaxed">
            De vez em quando, a Academia junta-se às crianças para jogos de
            recreio: roda, arcos e labirintos de cartão, a meias entre gerações.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-5 gap-px bg-on-surface/10">
            <figure className="md:col-span-3 bg-surface-low">
              <div className="relative aspect-[4/3] md:aspect-[3/2] overflow-hidden bg-surface-high">
                <Image
                  src={fotoRoda}
                  alt="Seniores e crianças num jogo de roda ao ar livre, de braços abertos, no recreio."
                  fill
                  placeholder="blur"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover object-[50%_80%]"
                />
              </div>
              <figcaption className="font-body text-sm text-on-surface-muted p-4">
                Jogo de roda no recreio.
              </figcaption>
            </figure>
            <figure className="md:col-span-2 bg-surface-low flex flex-col">
              <div className="relative aspect-[4/3] md:aspect-auto md:flex-1 overflow-hidden bg-surface-high">
                <Image
                  src={fotoLabirintos}
                  alt="Uma sénior ajuda uma criança a equilibrar uma bola num labirinto feito com uma caixa e rolos de cartão."
                  fill
                  placeholder="blur"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-[35%_50%]"
                />
              </div>
              <figcaption className="font-body text-sm text-on-surface-muted p-4">
                Labirintos de cartão, feitos à mão.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Porquê */}
      <section className="section-dark bg-blue text-white">
        <div className="section-container py-16 md:py-20">
          <div className="max-w-2xl">
            <h2 className="font-headline font-black uppercase tracking-tighter leading-none text-3xl md:text-4xl">
              Porque é que isto existe
            </h2>
            <p className="font-body text-lg text-white/80 leading-relaxed mt-4">
              Um clube não é só quem joga. A Academia Sénior existe para combater o
              isolamento e manter ativa uma parte da comunidade que continua a ser
              do Valejas muito depois de deixar de competir.
            </p>
            <p className="font-body text-lg text-white/80 leading-relaxed mt-4">
              Aqui há competições de sueca e de bilhar organizadas pelo clube, idas
              ao teatro em grupo, e gente que aparece só para conviver. Também isso
              conta.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-container py-16 md:py-24">
        <div className="bg-surface-high p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="max-w-xl">
            <h2 className="font-headline font-black uppercase tracking-tight leading-none text-2xl md:text-3xl text-on-surface">
              Queres participar?
            </h2>
            <p className="font-body text-on-surface-muted leading-relaxed mt-2">
              Passa pela sede no horário da Academia, ou fala connosco. Para
              participar basta ser sócio — a quota é de 1 € por mês.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link href="/socios/inscricao" className="btn-primary text-sm">
              Fazer-me sócio
            </Link>
            <Link href="/contactos" className="btn-ghost text-sm">
              Contactos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
