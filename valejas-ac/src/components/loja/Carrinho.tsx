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
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import clsx from "clsx";
import { Check, Loader2, Minus, Plus, Send, ShoppingBag, Trash2 } from "lucide-react";
import { useCarrinho } from "@/lib/loja/carrinho";
import {
  PRAZO_ENCOMENDA_SEMANAS, SINAL_PERCENTAGEM, formatEuros as formatarEuros, getProduto, nomeTamanho,
} from "@/lib/data/loja";
import { MOMENTOS_PAGAMENTO, type MomentoPagamento } from "@/lib/data/encomendas";
import { validarEmail, validarTelemovel } from "@/lib/validacao";
import { irParaOTopo } from "@/lib/scroll";

export default function Carrinho() {
  const t = useTranslations("loja.carrinho");
  const tLoja = useTranslations("loja");
  const lingua = useLocale();
  const formatEuros = (v: number) => formatarEuros(v, lingua);
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
  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    const falhas: string[] = [];
    if (nome.trim().split(/\s+/).length < 2) falhas.push(t("erros.nome"));
    if (!validarEmail(email))       falhas.push(t("erros.email"));
    if (!validarTelemovel(telemovel)) falhas.push(t("erros.telemovel"));
    if (linhas.length === 0)        falhas.push(t("erros.vazio"));
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
        setErros(json.erros ?? [t("erros.registar")]);
        return;
      }
      setFeito({ numero: json.numero, aPagarAgora: json.aPagarAgora });
      esvaziar();
      irParaOTopo();
    } catch {
      setErros([t("erros.ligacao")]);
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
            {t("registada.titulo")}
          </h2>
          <p className="font-body text-lg text-on-surface-muted leading-relaxed">
            {t("registada.guarda")}
          </p>
          <p className="font-headline font-black text-3xl text-yellow tracking-tight">
            {feito.numero}
          </p>
        </div>

        <div className="bg-surface-high p-7 space-y-3">
          <p className="font-body text-on-surface-muted leading-relaxed">
            {t("registada.confirmar")}
          </p>
          <p className="font-body text-on-surface-muted leading-relaxed">
            <strong className="text-on-surface">
              {t("registada.aPagar", { valor: formatEuros(feito.aPagarAgora) })}
            </strong>{" "}
            {t("registada.dadosPagamento")}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/loja" className="btn-primary text-sm">{t("registada.voltar")}</Link>
          <Link href="/contactos" className="btn-ghost text-sm">{t("registada.contactos")}</Link>
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
          {t("vazio.titulo")}
        </h2>
        <p className="font-body text-on-surface-muted leading-relaxed">
          {t("vazio.texto")}
        </p>
        <Link href="/loja" className="btn-primary text-sm">{t("vazio.verLoja")}</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submeter} className="grid lg:grid-cols-[minmax(0,1fr)_22rem] gap-12 py-8" noValidate>
      <div className="space-y-10">
        {/* Linhas */}
        <section>
          <h2 className="font-headline font-black uppercase text-2xl tracking-tight text-on-surface mb-5">
            {t("oQueLevas")}
          </h2>

          <ul className="border-t border-on-surface/15">
            {linhas.map((l, i) => {
              const p = getProduto(l.slug);
              if (!p) return null;
              const nomeProduto = tLoja(`produtos.${p.slug}.nome`);

              return (
                <li key={`${l.slug}-${l.tamanho}-${i}`} className="py-5 border-b border-on-surface/10">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-headline font-black uppercase text-lg text-on-surface">
                        {nomeProduto}
                      </p>
                      <p className="font-body text-sm text-on-surface-muted mt-1">
                        {t("tamanho", { tamanho: nomeTamanho(l.tamanho, tLoja) })}
                        {l.personalizacao && (
                          <> · {l.personalizacao.nome} {l.personalizacao.numero}</>
                        )}
                      </p>

                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center border border-on-surface/20">
                        <button
                          type="button"
                          onClick={() => alterar(i, l.quantidade - 1)}
                          aria-label={t("menosUm", { nome: nomeProduto })}
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
                          aria-label={t("maisUm", { nome: nomeProduto })}
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
                        aria-label={t("remover", { nome: nomeProduto })}
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

          {/* A regra do prazo é dita uma vez, aqui — não peça a peça. */}
          <p className="font-body text-sm text-on-surface-muted mt-4 bg-surface-high p-4">
            {t("prazo", { semanas: PRAZO_ENCOMENDA_SEMANAS })}
          </p>
        </section>

        {/* Quem encomenda */}
        <section>
          <h2 className="font-headline font-black uppercase text-2xl tracking-tight text-on-surface mb-5">
            {t("quemEncomenda")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Campo id="nome-completo" label={t("campos.nome")} valor={nome} set={setNome} larga autoComplete="name" />
            <Campo id="email" label={t("campos.email")} valor={email} set={setEmail} tipo="email" autoComplete="email" />
            <Campo id="telem-vel" label={t("campos.telemovel")} valor={telemovel} set={setTelemovel} tipo="tel" autoComplete="tel" />
            <Campo id="n-mero-de-s-cio" label={t("campos.socio")} valor={socio} set={setSocio} opcional={t("campos.opcional")} />
            <Campo
              id="para-que-atleta"
              label={t("campos.atleta")}
              valor={atleta}
              set={setAtleta}
              opcional={t("campos.opcional")}
              dica={t("campos.atletaDica")}
            />
          </div>

          <label className="block mt-5">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
              {t("campos.notas")} <span className="normal-case tracking-normal opacity-60">{t("campos.opcional")}</span>
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
            {t("quandoPagas")}
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
                        {t(`momentos.${m.id}.nome`)}
                      </span>
                      <span className="font-headline font-black text-xl text-yellow">
                        {formatEuros(valor)}
                      </span>
                    </span>
                    <span className="block font-body text-sm text-on-surface-muted mt-1 leading-relaxed">
                      {t(`momentos.${m.id}.descricao`)}
                      {m.id === "sinal" && t("percentagemSinal", { percentagem: SINAL_PERCENTAGEM })}
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
            {t("resumo")}
          </h2>

          <div className="space-y-2 pb-4 border-b border-on-surface/15">
            <Linha rotulo={t("totalEncomenda")} valor={formatEuros(total)} />
            {momento === "sinal" && (
              <Linha rotulo={t("faltaLevantamento")} valor={formatEuros(total - sinal)} />
            )}
          </div>

          <div className="flex items-baseline justify-between gap-4">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted">
              {t("aPagarAgora")}
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
              <><Loader2 size={16} className="animate-spin" /> {t("aRegistar")}</>
            ) : (
              <><Send size={16} /> {t("encomendar")}</>
            )}
          </button>

          <p className="font-body text-xs text-on-surface-muted leading-relaxed">
            {t("levantamento")}
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
  id: chave, label, valor, set, tipo = "text", opcional, larga, dica, autoComplete,
}: {
  /** Fixo, para o `id` do campo não mudar com a língua. */
  id: string;
  label: string;
  valor: string;
  set: (v: string) => void;
  tipo?: string;
  /** O texto «(opcional)» na língua da página; sem ele o campo é obrigatório. */
  opcional?: string;
  larga?: boolean;
  dica?: string;
  autoComplete?: string;
}) {
  const id = `enc-${chave}`;
  return (
    <div className={larga ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
        {label} {opcional ? <span className="normal-case tracking-normal opacity-60">{opcional}</span> : "*"}
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
