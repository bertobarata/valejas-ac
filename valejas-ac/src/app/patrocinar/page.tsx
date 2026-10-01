import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { paraPagina } from "@/lib/seo/metadados";
import { FUNDADO_EM } from "@/lib/data/clube";
import { FORMAS_DE_APOIO } from "@/lib/data/patrocinio";
import { MODALIDADES } from "@/lib/data/modalidades";
import PedidoPatrocinio from "@/components/patrocinio/PedidoPatrocinio";

export const metadata: Metadata = paraPagina("/patrocinar", {
  title: "Quero ser patrocinador",
  description:
    "Patrocinar o Valejas Atlético Clube: equipamentos, lonas no pavilhão, conteúdo digital, apoio a um escalão ou mecenato desportivo. Peça a apresentação de parcerias e receba-a no email.",
});

/**
 * QUERO SER PATROCINADOR
 * ─────────────────────────────────────────────────────────────────
 * /patrocinadores mostra quem já apoia; esta página é a porta para
 * quem ainda não apoia. Separadas de propósito: a lista de apoios é
 * um agradecimento, e não deve parecer um balcão de vendas.
 *
 * O endereço é /patrocinar — um verbo, curto, que se diz ao telefone
 * e cabe num cartaz do pavilhão («valejasac.pt/patrocinar»), ao lado
 * de /inscricoes. Debaixo de /patrocinadores ficava comprido e a ler
 * mal («patrocinadores/quero-ser»).
 *
 * O tom é o de /patrocinadores: trata-se a pessoa por você. Quem
 * escreve é muitas vezes uma empresa, e é o registo que o clube usa
 * na apresentação.
 *
 * A troca é simples: a pessoa diz quem é, e a apresentação de
 * parcerias — com os valores — chega-lhe ao email na hora. Os valores
 * não estão nesta página (ver @/lib/data/patrocinio).
 * ─────────────────────────────────────────────────────────────────
 */
export default function PatrocinarPage() {
  const anos = new Date().getFullYear() - FUNDADO_EM;

  return (
    <div className="bg-surface">
      {/* Cabeçalho */}
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-16 md:py-24">
          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            Patrocínios e parcerias
          </p>
          <h1 className="section-title text-4xl md:text-6xl">
            Quero ser <span>patrocinador</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-on-surface-muted mt-5 max-w-2xl leading-relaxed">
            {anos} anos de clube, {MODALIDADES.length} modalidades e um pavilhão com gente
            todos os dias da semana. Diga-nos quem é e receba já, no seu
            email, a apresentação de parcerias do Valejas — com tudo o que o
            clube tem para oferecer.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 mt-8">
            <a href="#pedido" className="btn-primary text-sm">
              Pedir a apresentação <ArrowDown size={16} aria-hidden />
            </a>
            <Link
              href="/patrocinadores"
              className="alvo-toque inline-flex items-center gap-1.5 font-body text-sm text-on-surface-muted hover:text-yellow underline underline-offset-4 transition-colors duration-200"
            >
              Ver quem já apoia o clube
            </Link>
          </div>
        </div>
      </section>

      {/* Onde pode estar a sua marca */}
      <section className="section-container py-14 md:py-20">
        <div className="max-w-2xl mb-10">
          <h2 className="font-headline font-black uppercase text-2xl md:text-3xl tracking-tighter text-on-surface">
            Onde pode estar a sua marca
          </h2>
          <p className="font-body text-on-surface-muted leading-relaxed mt-2">
            Do equipamento que os atletas vestem às paredes do pavilhão, que
            tem treinos e jogos das 17h às 23h nos dias úteis e o dia inteiro
            ao fim de semana — o clube estima mais de 3000 pessoas por semana.
            Os formatos e os valores estão todos na apresentação.
          </p>
        </div>

        <ul className="border-t border-on-surface/15">
          {FORMAS_DE_APOIO.filter((f) => f.id !== "outro").map((f) => (
            <li key={f.id} className="border-b border-on-surface/10">
              <div className="grid grid-cols-1 sm:grid-cols-[16rem_1fr] sm:items-baseline gap-x-8 gap-y-1 py-5">
                <span className="font-headline font-black uppercase text-lg md:text-xl text-on-surface leading-tight">
                  {f.nome}
                </span>
                <span className="font-body text-on-surface-muted leading-relaxed max-w-prose">
                  {f.descricao}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Formulário */}
      <section
        id="pedido"
        className="section-container py-14 md:py-20 border-t border-on-surface/10 scroll-mt-32"
      >
        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 lg:gap-16">
          {/* Como em /inscricoes: o limite de leitura vai no texto, não
              na grelha, que só se divide a partir de `lg`. */}
          <div className="max-w-prose">
            <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
              Receber a apresentação
            </h2>
            <ol className="mt-6 space-y-5">
              {[
                {
                  titulo: "Diga-nos quem é",
                  texto: "Uma empresa, uma loja da terra ou a título pessoal — todos contam.",
                },
                {
                  titulo: "A apresentação chega na hora",
                  texto: "Um PDF com o clube, as modalidades e todas as formas de apoio, com os valores.",
                },
                {
                  titulo: "Falamos consigo",
                  texto: "A comunicação do clube recebe o seu pedido e entra em contacto para acertar o resto.",
                },
              ].map((p, i) => (
                <li key={p.titulo} className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                  <span
                    aria-hidden
                    className="font-headline font-black text-3xl text-yellow/40 leading-none tabular-nums whitespace-nowrap shrink-0 md:w-12"
                  >
                    0{i + 1}
                  </span>
                  <div className="text-center md:text-left">
                    <h3 className="font-headline font-black uppercase text-base text-on-surface">
                      {p.titulo}
                    </h3>
                    <p className="font-body text-on-surface-muted leading-relaxed mt-1">
                      {p.texto}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <PedidoPatrocinio />
        </div>
      </section>

      {/* Fecho — quem prefere falar primeiro */}
      <section className="section-container pb-20 md:pb-28">
        <div className="bg-surface-high border border-on-surface/10 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <p className="font-body text-on-surface-muted leading-relaxed max-w-prose">
            Prefere falar primeiro com alguém do clube? Escreva-nos pelo
            formulário de contacto, com o assunto «Proposta de parceria».
          </p>
          <Link href="/contactos" className="btn-ghost text-sm shrink-0 self-center md:self-auto">
            Contactos <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}
