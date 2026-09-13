"use client";

/**
 * CARRINHO E ENCOMENDA
 * ─────────────────────────────────────────────────────────────────
 * Rever, identificar-se, escolher quando paga. Tudo numa página: com
 * uma encomenda de duas ou três peças, um checkout em passos seria
 * cerimónia a mais.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Check, Loader2, Minus, Plus, Send, ShoppingBag, Trash2 } from "lucide-react";
import { useCarrinho } from "@/lib/loja/carrinho";
import {
  PRAZO_ENCOMENDA_SEMANAS, SINAL_PERCENTAGEM, formatEuros, getProduto, stockDe,
} from "@/lib/data/loja";
import { MOMENTOS_PAGAMENTO, type MomentoPagamento } from "@/lib/data/encomendas";
import { validarEmail, validarTelemovel } from "@/lib/validacao";
import { irParaOTopo } from "@/lib/scroll";

export default function Carrinho() {
  const { linhas, total, sinal, alterar, remover, esvaziar, pronto } = useCarrinho();

  const [nome, setNome]           = useState("");
  const [email, setEmail]         = useState("");
  const [telemovel, setTelemovel] = useState("");
  const [socio, setSocio]         = useState("");
  const [atleta, setAtleta]       = useState("");
  const [notas, setNotas]         = useState("");
  const [momento, setMomento]     = useState<MomentoPagamento>("sinal");

  const [aEnviar, setAEnviar] = useState(false);
  const [erros, setErros]     = useState<string[]>([]);
  const [feito, setFeito]     = useState<{ numero: string; aPagarAgora: number } | null>(null);

  const aPagarAgora = momento === "sinal" ? sinal : total;
  const porEncomendar = linhas.filter((l) => {
    const p = getProduto(l.slug);
    return p ? stockDe(p, l.tamanho) === 0 : false;
  });

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    const falhas: string[] = [];
    if (nome.trim().split(/\s+/).length < 2) falhas.push("Escreve o nome completo.");
    if (!validarEmail(email))       falhas.push("Email inválido.");
    if (!validarTelemovel(telemovel)) falhas.push("Telemóvel português inválido.");
    if (linhas.length === 0)        falhas.push("O carrinho está vazio.");
    if (falhas.length) { setErros(falhas); return; }

    setErros([]);
    setAEnviar(true);
    try {
      const res = await fetch("/api/loja/encomenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome, email, telemovel, socio, atleta, notas, momento,
          linhas: linhas.map((l) => ({
            slug: l.slug, tamanho: l.tamanho,
            quantidade: l.quantidade, personalizacao: l.personalizacao,
          })),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErros(json.erros ?? ["Não foi possível registar a encomenda."]);
        return;
      }
      setFeito({ numero: json.numero, aPagarAgora: json.aPagarAgora });
      esvaziar();
      irParaOTopo();
    } catch {
      setErros(["Falha de ligação. Tenta outra vez."]);
    } finally {
      setAEnviar(false);
    }
  }

  /* ── Encomenda registada ── */
  if (feito) {
    return (
      <div className="max-w-2xl py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-yellow/15 flex items-center justify-center mx-auto">
            <Check size={32} className="text-yellow" />
          </div>
          <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
            Encomenda registada
          </h2>
          <p className="font-body text-lg text-on-surface-muted leading-relaxed">
            Guarda este número. É por ele que o clube te identifica.
          </p>
          <p className="font-headline font-black text-3xl text-yellow tracking-tight">
            {feito.numero}
          </p>
        </div>

        <div className="bg-surface-high p-7 space-y-3">
          <p className="font-body text-on-surface-muted leading-relaxed">
            O clube vai confirmar o que tem na sede e encomendar o que faltar.
            Avisamos-te por email quando estiver pronta para levantar.
          </p>
          <p className="font-body text-on-surface-muted leading-relaxed">
            <strong className="text-on-surface">
              A pagar: {formatEuros(feito.aPagarAgora)}
            </strong>{" "}
            — os dados de pagamento seguem no email.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/loja" className="btn-primary text-sm">Voltar à loja</Link>
          <Link href="/contactos" className="btn-ghost text-sm">Contactos</Link>
        </div>
      </div>
    );
  }

  if (!pronto) return null;

  /* ── Carrinho vazio ── */
  if (linhas.length === 0) {
    return (
      <div className="max-w-xl py-12 space-y-5">
        <ShoppingBag size={32} className="text-on-surface-muted" aria-hidden />
        <h2 className="font-headline font-black uppercase text-2xl text-on-surface">
          O carrinho está vazio
        </h2>
        <p className="font-body text-on-surface-muted leading-relaxed">
          Ainda não escolheste nada. O kit de formação e o restante equipamento
          estão na loja.
        </p>
        <Link href="/loja" className="btn-primary text-sm">Ver a loja</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submeter} className="grid lg:grid-cols-[minmax(0,1fr)_22rem] gap-12 py-8" noValidate>
      <div className="space-y-10">
        {/* Linhas */}
        <section>
          <h2 className="font-headline font-black uppercase text-2xl tracking-tight text-on-surface mb-5">
            O que levas
          </h2>

          <ul className="border-t border-on-surface/15">
            {linhas.map((l, i) => {
              const p = getProduto(l.slug);
              if (!p) return null;
              const emStock = stockDe(p, l.tamanho) > 0;

              return (
                <li key={`${l.slug}-${l.tamanho}-${i}`} className="py-5 border-b border-on-surface/10">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-headline font-black uppercase text-lg text-on-surface">
                        {p.nome}
                      </p>
                      <p className="font-body text-sm text-on-surface-muted mt-1">
                        Tamanho {l.tamanho}
                        {l.personalizacao && (
                          <> · {l.personalizacao.nome} {l.personalizacao.numero}</>
                        )}
                      </p>
                      <p className="font-body text-sm text-on-surface-muted">
                        {emStock
                          ? "Na sede"
                          : `Por encomenda, até ${PRAZO_ENCOMENDA_SEMANAS} semanas`}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center border border-on-surface/20">
                        <button
                          type="button"
                          onClick={() => alterar(i, l.quantidade - 1)}
                          aria-label={`Menos um ${p.nome}`}
                          className="w-11 h-11 flex items-center justify-center text-on-surface-muted hover:text-on-surface"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-headline font-black text-base w-8 text-center">
                          {l.quantidade}
                        </span>
                        <button
                          type="button"
                          onClick={() => alterar(i, l.quantidade + 1)}
                          aria-label={`Mais um ${p.nome}`}
                          className="w-11 h-11 flex items-center justify-center text-on-surface-muted hover:text-on-surface"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <p className="font-headline font-black text-lg text-on-surface w-20 text-right">
                        {formatEuros(p.preco * l.quantidade)}
                      </p>

                      <button
                        type="button"
                        onClick={() => remover(i)}
                        aria-label={`Remover ${p.nome}`}
                        className="w-11 h-11 flex items-center justify-center text-on-surface-muted hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {porEncomendar.length > 0 && (
            <p className="font-body text-sm text-on-surface-muted mt-4 bg-surface-high p-4">
              {porEncomendar.length === 1 ? "Uma peça não está" : `${porEncomendar.length} peças não estão`} na
              sede e {porEncomendar.length === 1 ? "tem" : "têm"} de ser encomendada
              {porEncomendar.length === 1 ? "" : "s"} ao fornecedor. A encomenda
              inteira fica pronta quando chegar, até {PRAZO_ENCOMENDA_SEMANAS} semanas.
            </p>
          )}
        </section>

        {/* Quem encomenda */}
        <section>
          <h2 className="font-headline font-black uppercase text-2xl tracking-tight text-on-surface mb-5">
            Quem encomenda
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Campo label="Nome completo" valor={nome} set={setNome} larga autoComplete="name" />
            <Campo label="Email" valor={email} set={setEmail} tipo="email" autoComplete="email" />
            <Campo label="Telemóvel" valor={telemovel} set={setTelemovel} tipo="tel" autoComplete="tel" />
            <Campo label="Número de sócio" valor={socio} set={setSocio} opcional />
            <Campo
              label="Para que atleta"
              valor={atleta}
              set={setAtleta}
              opcional
              dica="Se a encomenda for para um filho ou outro atleta"
            />
          </div>

          <label className="block mt-5">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
              Notas <span className="normal-case tracking-normal opacity-60">(opcional)</span>
            </span>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full resize-y"
            />
          </label>
        </section>

        {/* Quando paga */}
        <section>
          <h2 className="font-headline font-black uppercase text-2xl tracking-tight text-on-surface mb-5">
            Quando pagas
          </h2>

          <div className="space-y-3">
            {MOMENTOS_PAGAMENTO.map((m) => {
              const ativo = momento === m.id;
              const valor = m.id === "sinal" ? sinal : total;
              return (
                <label
                  key={m.id}
                  className={clsx(
                    "flex items-start gap-4 p-5 border cursor-pointer transition-colors duration-200",
                    ativo ? "border-yellow bg-yellow/10" : "border-on-surface/15 hover:border-on-surface/40"
                  )}
                >
                  <input
                    type="radio"
                    name="momento"
                    checked={ativo}
                    onChange={() => setMomento(m.id)}
                    className="mt-1 w-5 h-5 accent-yellow shrink-0"
                  />
                  <span className="flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span className="font-headline font-black uppercase text-base text-on-surface">
                        {m.nome}
                      </span>
                      <span className="font-headline font-black text-xl text-yellow">
                        {formatEuros(valor)}
                      </span>
                    </span>
                    <span className="block font-body text-sm text-on-surface-muted mt-1 leading-relaxed">
                      {m.descricao}
                      {m.id === "sinal" && ` São ${SINAL_PERCENTAGEM}% do total.`}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </section>
      </div>

      {/* Resumo */}
      <aside className="lg:sticky lg:top-28 h-fit">
        <div className="bg-surface-high p-7 space-y-4">
          <h2 className="font-headline font-black uppercase text-lg tracking-tight text-on-surface">
            Resumo
          </h2>

          <div className="space-y-2 pb-4 border-b border-on-surface/15">
            <Linha rotulo="Total da encomenda" valor={formatEuros(total)} />
            {momento === "sinal" && (
              <Linha rotulo="Falta no levantamento" valor={formatEuros(total - sinal)} />
            )}
          </div>

          <div className="flex items-baseline justify-between gap-4">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted">
              A pagar agora
            </span>
            <span className="font-headline font-black text-3xl text-yellow leading-none">
              {formatEuros(aPagarAgora)}
            </span>
          </div>

          {erros.length > 0 && (
            <div role="alert" className="space-y-1 pt-2">
              {erros.map((e) => (
                <p key={e} className="font-body text-sm text-red-500">{e}</p>
              ))}
            </div>
          )}

          <button type="submit" disabled={aEnviar} className="btn-primary w-full justify-center text-sm py-4 disabled:opacity-60">
            {aEnviar ? (
              <><Loader2 size={16} className="animate-spin" /> A registar…</>
            ) : (
              <><Send size={16} /> Encomendar</>
            )}
          </button>

          <p className="font-body text-xs text-on-surface-muted leading-relaxed">
            Levantamento sempre na sede do clube. Não enviamos para casa.
          </p>
        </div>
      </aside>
    </form>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="font-body text-sm text-on-surface-muted">{rotulo}</span>
      <span className="font-body text-sm text-on-surface">{valor}</span>
    </div>
  );
}

function Campo({
  label, valor, set, tipo = "text", opcional, larga, dica, autoComplete,
}: {
  label: string;
  valor: string;
  set: (v: string) => void;
  tipo?: string;
  opcional?: boolean;
  larga?: boolean;
  dica?: string;
  autoComplete?: string;
}) {
  const id = `enc-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  return (
    <div className={larga ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
        {label} {opcional ? <span className="normal-case tracking-normal opacity-60">(opcional)</span> : "*"}
      </label>
      <input
        id={id}
        type={tipo}
        value={valor}
        autoComplete={autoComplete}
        onChange={(e) => set(e.target.value)}
        className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
      />
      {dica && <p className="font-body text-xs text-on-surface-muted mt-1.5">{dica}</p>}
    </div>
  );
}
