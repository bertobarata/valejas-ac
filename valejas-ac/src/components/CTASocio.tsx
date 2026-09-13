/**
 * BLOCO DE FECHO — SÓCIOS
 * ─────────────────────────────────────────────────────────────────
 * A Direção quer o convite a ser sócio em todas as páginas. O botão
 * da navbar e do rodapé não chega: quem chega ao fim de uma página
 * já leu tudo e é aí que decide.
 *
 * Duas variantes:
 *  - `destaque` — faixa azul, para páginas sem nenhum fecho próprio
 *  - `discreto` — barra simples, para páginas que já fecham com outra
 *    coisa e não aguentam dois blocos grandes seguidos
 * ─────────────────────────────────────────────────────────────────
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { QUOTA_MENSAL, formatEuros } from "@/lib/data/quota";
import { MOTE } from "@/lib/data/clube";

interface Props {
  variante?: "destaque" | "discreto";
  /** Substitui o título, para a mensagem encaixar na página. */
  titulo?: string;
  /** Substitui o texto de apoio. */
  texto?: string;
}

export default function CTASocio({
  variante = "destaque",
  titulo,
  texto,
}: Props) {
  const tituloFinal = titulo ?? MOTE.caixaAlta;
  const textoFinal =
    texto ??
    `A quota é de ${formatEuros(QUOTA_MENSAL)} por mês. O cartão levanta-se na sede.`;

  if (variante === "discreto") {
    return (
      <div className="section-container pb-20 md:pb-28">
        <div className="border-t border-on-surface/15 pt-8 flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
          <p className="font-body text-base text-on-surface-muted max-w-xl">
            {textoFinal}
          </p>
          <Link href="/socios/inscricao" className="btn-primary text-sm shrink-0">
            Fazer-me sócio <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="section-container pb-20 md:pb-28">
      <div className="section-dark bg-blue text-white bg-texture p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-8 justify-between">
        <div className="max-w-xl">
          <h2 className="font-headline font-black uppercase text-2xl md:text-4xl tracking-tighter leading-none">
            {tituloFinal}
          </h2>
          <p className="font-body text-base md:text-lg text-white/80 leading-relaxed mt-3">
            {textoFinal}
          </p>
        </div>
        <Link
          href="/socios/inscricao"
          className="btn-primary shrink-0 bg-yellow text-blue-deep hover:bg-yellow-dim text-base px-8 py-4"
        >
          Fazer-me sócio <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
