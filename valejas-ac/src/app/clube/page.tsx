import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import {
  FUNDACAO, ORIGENS, DEPOIS, LOCALIZACAO, anosDeVida,
} from "@/lib/data/historia";
import MapaClube from "@/components/historia/MapaClube";

/** As outras portas do clube. Ordem pensada: identidade, casa, quem manda, quem apoia. */
const PAGINAS_DO_CLUBE = [
  {
    nome: "O Emblema",
    href: "/clube/emblema",
    descricao: "A águia, as cores e o que cada parte do emblema quer dizer.",
  },
  {
    nome: "Instalações",
    href: "/instalacoes",
    descricao: "A sede, o pavilhão e o que lá se faz todos os dias.",
  },
  {
    nome: "Órgãos Sociais",
    href: "/orgaos-sociais",
    descricao: "Quem dirige o clube: Direção, Conselho Fiscal e Mesa da Assembleia.",
  },
  {
    nome: "Patrocinadores",
    href: "/patrocinadores",
    descricao: "As empresas e as pessoas que seguram o clube de pé.",
  },
];

export const metadata: Metadata = {
  title: "O Clube",
  description:
    `Fundado a ${FUNDACAO.data}, em Valejas, Barcarena. O Valejas Atlético Clube ` +
    "começou no atletismo, no cicloturismo e na malha, e é hoje a casa de sete modalidades.",
};

/**
 * O CLUBE
 * ─────────────────────────────────────────────────────────────────
 * O destino de quem carrega em «Conhecer o clube» no início. Abre pela
 * história, porque é por aí que se conhece um clube de 1966, e fecha a
 * apontar para o resto — emblema, instalações, quem dirige, quem apoia.
 *
 * Antes disto a história vivia em /historia, sem entrada na navegação:
 * estava escrita e não se encontrava.
 * ─────────────────────────────────────────────────────────────────
 */
export default function ClubePage() {
  const anos = anosDeVida();

  return (
    <div className="bg-surface">
      {/* Cabeçalho */}
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-20 md:py-28">
          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            O clube · desde {FUNDACAO.ano}
          </p>
          <h1 className="section-title text-5xl md:text-7xl">
            {anos} anos de <span>Valejas</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-on-surface-muted mt-5 max-w-2xl leading-relaxed">
            O Valejas Atlético Clube foi fundado a <strong className="text-on-surface">{FUNDACAO.data}</strong>,
            na localidade de {FUNDACAO.localidade}, freguesia de {FUNDACAO.freguesia},
            concelho de {FUNDACAO.concelho}.
          </p>
        </div>
      </section>

      {/* Como foi fundado — com a honestidade de dizer o que não se sabe */}
      <section className="section-container py-16 md:py-20">
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 md:gap-16">
          <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
            Como foi fundado
          </h2>
          <div className="space-y-5 max-w-prose">
            <p className="font-body text-lg text-on-surface-muted leading-relaxed">
              O clube nasceu como uma associação desportiva e recreativa ligada à
              comunidade de Valejas. Ao longo dos anos foi ganhando um papel na
              promoção do desporto em toda a freguesia de Barcarena.
            </p>
            <p className="font-body text-lg text-on-surface-muted leading-relaxed">
              A origem está sobretudo na prática desportiva local, no convívio
              entre moradores e na criação de atividades para a população — e é
              isso que o clube continua a ser.
            </p>

            <div className="bg-surface-high p-6 md:p-7">
              <p className="font-headline font-black uppercase text-sm text-on-surface">
                O que ainda não sabemos
              </p>
              <p className="font-body text-on-surface-muted leading-relaxed mt-2">
                Não há registo público com os nomes dos fundadores nem ata que
                conte o momento exato da fundação. Se tens documentos, fotografias
                ou memórias de família sobre o início do clube, fala connosco — a
                história do Valejas ainda está por escrever como deve ser.
              </p>
              <Link href="/contactos" className="btn-ghost text-sm mt-4">
                Contar o que sei
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Como começou */}
      <section className="section-container py-16 md:py-20 border-t border-on-surface/10">
        <div className="max-w-2xl mb-12">
          <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
            Como começou
          </h2>
          <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-3">
            Muito antes do futsal. As primeiras atividades do clube foram estas
            três — duas de pernas e rodas, uma de convívio à porta da sede.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-on-surface/10">
          {ORIGENS.map((o, i) => (
            <article key={o.nome} className="bg-surface-high p-7 md:p-8">
              <span
                aria-hidden
                className="font-headline font-black text-5xl text-yellow/30 leading-none"
              >
                0{i + 1}
              </span>
              <h3 className="font-headline font-black uppercase text-xl text-on-surface mt-4">
                {o.nome}
              </h3>
              <p className="font-body text-on-surface-muted leading-relaxed mt-2">
                {o.descricao}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 max-w-2xl">
          <h3 className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-on-surface-muted border-b border-on-surface/10 pb-3 mb-5">
            E depois
          </h3>
          <ul className="space-y-3">
            {DEPOIS.map((d) => (
              <li key={d} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="w-1.5 h-1.5 rounded-full bg-yellow flex-shrink-0 mt-2.5"
                />
                <span className="font-body text-on-surface-muted leading-relaxed">{d}</span>
              </li>
            ))}
          </ul>
          <p className="font-body text-sm text-on-surface-muted mt-6 leading-relaxed">
            Sem datas precisas — não há registo que as fixe. Por isso não é uma
            cronologia: é a ordem por que as coisas foram acontecendo.
          </p>
        </div>
      </section>

      {/* Onde estamos */}
      <section className="section-container py-16 md:py-20 border-t border-on-surface/10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div>
            <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
              Onde estamos
            </h2>
            <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-3">
              A sede fica no vale do Jamor, entre Barcarena e Queluz de Baixo.
              É a mesma morada desde sempre.
            </p>

            <div className="flex items-start gap-3 mt-8">
              <MapPin size={20} className="text-yellow flex-shrink-0 mt-1" />
              <address className="font-body text-base text-on-surface not-italic leading-relaxed">
                {LOCALIZACAO.morada}
                <br />
                {LOCALIZACAO.codigoPostal} {LOCALIZACAO.localidade}
                <br />
                {LOCALIZACAO.freguesia}, {LOCALIZACAO.concelho}
              </address>
            </div>

            <p className="font-body text-sm text-on-surface-muted mt-4">
              Também aparece como {LOCALIZACAO.moradaAlt}.
            </p>
          </div>

          <MapaClube />
        </div>
      </section>

      {/* O resto do clube — daqui vai-se a todo o lado */}
      <section className="section-container py-16 md:py-20 border-t border-on-surface/10">
        <div className="max-w-2xl mb-8">
          <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
            Conhecer o resto
          </h2>
          <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-3">
            A história é o princípio. O clube de hoje está nestas páginas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-on-surface/10">
          {PAGINAS_DO_CLUBE.map((pagina) => (
            <Link
              key={pagina.href}
              href={pagina.href}
              className="group bg-surface-high p-7 flex flex-col justify-between min-h-[11rem]"
            >
              <div>
                <h3 className="font-headline font-black uppercase text-xl text-on-surface leading-none group-hover:text-yellow transition-colors duration-300">
                  {pagina.nome}
                </h3>
                <p className="font-body text-sm text-on-surface-muted leading-relaxed mt-2">
                  {pagina.descricao}
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
      </section>

      {/* CTA */}
      <section className="section-container pb-20 md:pb-28">
        <div className="bg-surface-high p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="max-w-xl">
            <h2 className="font-headline font-black uppercase text-2xl tracking-tight text-on-surface">
              {anos} anos e a contar
            </h2>
            <p className="font-body text-on-surface-muted leading-relaxed mt-2">
              O clube é de quem cá está. A quota é de 1€ por mês.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link href="/socios/inscricao" className="btn-primary text-sm">
              Fazer-me sócio
            </Link>
            <Link href="/contactos" className="btn-ghost text-sm">
              Falar connosco
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
