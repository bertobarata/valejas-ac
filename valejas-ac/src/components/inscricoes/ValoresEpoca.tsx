/**
 * VALORES DA ÉPOCA
 * ─────────────────────────────────────────────────────────────────
 * O que custa inscrever alguém, antes de a pessoa preencher o pedido.
 * Sem isto, o site pedia dados pessoais a quem ainda não sabia se
 * podia pagar.
 *
 * Os números vivem em @/lib/data/precos, vindos do comunicado da
 * Direção. Enquanto `PRECOS_CONFIRMADOS` for falso, mostra-se o aviso
 * de que se confirmam na secretaria — nunca se esconde o preço.
 * ─────────────────────────────────────────────────────────────────
 */
import { Info, Users } from "lucide-react";
import {
  DESCONTO_IRMAOS, EPOCA, INSCRICOES, MENSALIDADES, PRECOS_CONFIRMADOS,
  type ValorEpoca,
} from "@/lib/data/precos";
import { formatEuros } from "@/lib/data/quota";

function Linha({ v }: { v: ValorEpoca }) {
  return (
    <article className="bg-surface-high p-7 md:p-8 flex flex-col">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-headline font-black uppercase text-xl text-on-surface">
          {v.nome}
        </h3>
        <p className="font-headline font-black text-2xl text-yellow tabular-nums whitespace-nowrap">
          {formatEuros(v.valor)}
        </p>
      </div>

      <p className="font-body text-xs uppercase tracking-[0.2em] text-on-surface-muted mt-1">
        {v.periodo}
      </p>

      {v.inclui && (
        <ul className="font-body text-on-surface-muted leading-relaxed mt-4 space-y-1">
          {v.inclui.map((i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden className="text-yellow">·</span>
              {i}
            </li>
          ))}
        </ul>
      )}

      {v.nota && (
        <p className="font-body text-sm text-on-surface-muted leading-relaxed mt-4">
          {v.nota}
        </p>
      )}

      {v.desconto && (
        <p className="font-body text-sm text-on-surface-muted mt-4 flex items-center gap-2">
          <Users size={15} className="text-yellow shrink-0" aria-hidden />
          Menos {formatEuros(DESCONTO_IRMAOS)} por cada irmão
        </p>
      )}
    </article>
  );
}

export default function ValoresEpoca() {
  return (
    <section
      id="valores"
      className="section-container py-14 md:py-20 border-t border-on-surface/10 scroll-mt-32"
    >
      <div className="max-w-2xl mb-8">
        <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
          Quanto custa
        </h2>
        <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-3">
          Os valores da época {EPOCA}, tal como saíram no comunicado da
          Direção. O equipamento compra-se à parte, na loja.
        </p>
      </div>

      <div className="grid gap-px bg-on-surface/10 sm:grid-cols-2 lg:grid-cols-4">
        {INSCRICOES.map((v) => <Linha key={v.id} v={v} />)}
      </div>

      <h3 className="font-headline font-black uppercase text-xl text-on-surface mt-12 mb-4">
        Mensalidades de futsal
      </h3>
      <div className="grid gap-px bg-on-surface/10 sm:grid-cols-2">
        {MENSALIDADES.map((v) => <Linha key={v.id} v={v} />)}
      </div>

      {!PRECOS_CONFIRMADOS && (
        <p className="font-body text-sm text-on-surface-muted leading-relaxed mt-8 flex gap-3 max-w-2xl">
          <Info size={18} className="text-yellow shrink-0 mt-0.5" aria-hidden />
          <span>
            Os valores acima são os do comunicado de setembro. Confirma na
            secretaria antes de pagar — é lá que se fecha a inscrição.
          </span>
        </p>
      )}
    </section>
  );
}
