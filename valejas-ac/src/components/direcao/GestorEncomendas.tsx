"use client";

/**
 * GESTOR DE ENCOMENDAS
 * ─────────────────────────────────────────────────────────────────
 * O que a Direção precisa de ver de relance: quem espera por quê, o
 * que falta pedir ao fornecedor, e quem ainda não pagou. Tudo o resto
 * é ruído.
 *
 * A lista abre filtrada pelas encomendas em curso — as levantadas e as
 * canceladas já não pedem nada a ninguém.
 * ─────────────────────────────────────────────────────────────────
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  AlertCircle, Check, ChevronDown, Euro, Loader2, Package, RefreshCw,
} from "lucide-react";
import { formatEuros } from "@/lib/data/loja";
import { ESTADOS, type EstadoEncomenda } from "@/lib/data/encomendas";

interface LinhaAPI {
  slug: string;
  nome: string;
  tamanho: string;
  quantidade: number;
  preco: number;
  emStock: boolean;
  personalizacao?: { nome?: string; numero?: string };
}

interface EncomendaAPI {
  id: string;
  numero: string;
  data: string;
  nome: string;
  email: string;
  telemovel: string;
  socio?: string;
  atleta?: string;
  notas?: string;
  notasInternas?: string;
  total: number;
  aPagarAgora: number;
  momento: "sinal" | "total";
  estado: EstadoEncomenda;
  pago: boolean;
  linhas: LinhaAPI[];
}

const CORES: Record<EstadoEncomenda, string> = {
  recebida:    "bg-yellow/20 text-on-surface",
  encomendada: "bg-blue/15 text-on-surface",
  pronta:      "bg-green-500/20 text-on-surface",
  levantada:   "bg-on-surface/10 text-on-surface-muted",
  cancelada:   "bg-on-surface/10 text-on-surface-muted line-through",
};

/** Em curso = alguém ainda espera alguma coisa. */
const EM_CURSO: EstadoEncomenda[] = ["recebida", "encomendada", "pronta"];

export default function GestorEncomendas() {
  const [encomendas, setEncomendas] = useState<EncomendaAPI[]>([]);
  const [aCarregar, setACarregar]   = useState(true);
  const [erro, setErro]             = useState("");
  const [aGuardar, setAGuardar]     = useState<string | null>(null);
  const [aberta, setAberta]         = useState<string | null>(null);
  const [soEmCurso, setSoEmCurso]   = useState(true);

  const carregar = useCallback(async () => {
    setACarregar(true);
    setErro("");
    try {
      const res = await fetch("/api/direcao/encomendas", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErro(json.erro ?? "Não foi possível ler as encomendas.");
        return;
      }
      setEncomendas(json.encomendas ?? []);
    } catch {
      setErro("Falha de ligação.");
    } finally {
      setACarregar(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function alterar(id: string, alteracoes: Partial<Pick<EncomendaAPI, "estado" | "pago" | "notasInternas">>) {
    setAGuardar(id);
    // Otimista: a Direção clica e vê logo. Se falhar, recarregamos.
    setEncomendas((atuais) =>
      atuais.map((e) => (e.id === id ? { ...e, ...alteracoes } : e))
    );
    try {
      const res = await fetch("/api/direcao/encomendas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, ...alteracoes }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErro(json.erro ?? "Não foi possível guardar.");
        carregar();
      }
    } catch {
      setErro("Falha de ligação. A alteração não ficou guardada.");
      carregar();
    } finally {
      setAGuardar(null);
    }
  }

  const visiveis = useMemo(
    () => (soEmCurso ? encomendas.filter((e) => EM_CURSO.includes(e.estado)) : encomendas),
    [encomendas, soEmCurso]
  );

  /** Peças a pedir ao fornecedor, somadas por peça e tamanho. */
  const porPedir = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const e of encomendas) {
      if (e.estado !== "recebida") continue;
      for (const l of e.linhas ?? []) {
        if (l.emStock) continue;
        const chave = `${l.nome} · ${l.tamanho}`;
        mapa.set(chave, (mapa.get(chave) ?? 0) + l.quantidade);
      }
    }
    return Array.from(mapa.entries()).sort((a, b) => a[0].localeCompare(b[0], "pt"));
  }, [encomendas]);

  const semPagar = encomendas.filter((e) => !e.pago && e.estado !== "cancelada").length;

  if (aCarregar && encomendas.length === 0) {
    return (
      <p className="flex items-center gap-3 font-body text-on-surface-muted">
        <Loader2 size={18} className="animate-spin" /> A ler as encomendas…
      </p>
    );
  }

  if (erro && encomendas.length === 0) {
    return (
      <div role="alert" className="bg-surface-high p-6 space-y-4">
        <p className="flex items-start gap-3 font-body text-on-surface leading-relaxed">
          <AlertCircle size={20} className="text-yellow shrink-0 mt-0.5" aria-hidden />
          {erro}
        </p>
        <button type="button" onClick={carregar} className="btn-ghost text-sm">
          <RefreshCw size={14} /> Tentar outra vez
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* O que o clube tem de fazer hoje */}
      <section className="grid sm:grid-cols-2 gap-5">
        <div className="bg-surface-high p-6">
          <h2 className="flex items-center gap-2 font-headline font-black uppercase text-base tracking-tight text-on-surface mb-3">
            <Package size={18} className="text-yellow" aria-hidden />
            A pedir ao fornecedor
          </h2>
          {porPedir.length === 0 ? (
            <p className="font-body text-sm text-on-surface-muted leading-relaxed">
              Nada por pedir. Todas as encomendas novas estão cobertas pelo
              que há na sede.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {porPedir.map(([peca, qtd]) => (
                <li key={peca} className="font-body text-sm text-on-surface">
                  <strong className="font-headline font-black">{qtd}×</strong> {peca}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-surface-high p-6">
          <h2 className="flex items-center gap-2 font-headline font-black uppercase text-base tracking-tight text-on-surface mb-3">
            <Euro size={18} className="text-yellow" aria-hidden />
            Pagamentos
          </h2>
          <p className="font-body text-sm text-on-surface-muted leading-relaxed">
            {semPagar === 0
              ? "Está tudo pago."
              : `${semPagar} ${semPagar === 1 ? "encomenda" : "encomendas"} ainda sem pagamento confirmado.`}
          </p>
        </div>
      </section>

      {/* Filtro e recarregar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-on-surface/10 pb-4">
        <label className="flex items-center gap-3 font-body text-sm text-on-surface cursor-pointer">
          <input
            type="checkbox"
            checked={soEmCurso}
            onChange={(e) => setSoEmCurso(e.target.checked)}
            className="w-5 h-5 accent-yellow"
          />
          Mostrar só as que estão em curso
        </label>

        <button type="button" onClick={carregar} className="btn-ghost text-xs">
          {aCarregar ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Recarregar
        </button>
      </div>

      {erro && (
        <p role="alert" className="font-body text-sm text-red-500">{erro}</p>
      )}

      {/* Lista */}
      {visiveis.length === 0 ? (
        <p className="font-body text-on-surface-muted leading-relaxed">
          {soEmCurso
            ? "Nenhuma encomenda em curso. Desliga o filtro para ver o histórico."
            : "Ainda não há encomendas."}
        </p>
      ) : (
        <ul className="space-y-4">
          {visiveis.map((e) => {
            const expandida = aberta === e.id;
            const faltam = (e.linhas ?? []).filter((l) => !l.emStock).length;

            return (
              <li key={e.id} className="bg-surface-high">
                <button
                  type="button"
                  onClick={() => setAberta(expandida ? null : e.id)}
                  aria-expanded={expandida}
                  className="w-full text-left p-5 flex flex-wrap items-center gap-x-5 gap-y-3"
                >
                  <span className="flex-1 min-w-0">
                    <span className="block font-headline font-black text-lg text-on-surface">
                      {e.numero}
                    </span>
                    <span className="block font-body text-sm text-on-surface-muted truncate">
                      {e.nome}
                      {e.socio && ` · sócio ${e.socio}`}
                      {" · "}
                      {new Intl.DateTimeFormat("pt-PT", { dateStyle: "short" }).format(new Date(e.data))}
                    </span>
                  </span>

                  <span className={clsx("px-3 py-1 font-body text-xs font-bold uppercase tracking-wider shrink-0", CORES[e.estado])}>
                    {ESTADOS.find((x) => x.id === e.estado)?.nome ?? e.estado}
                  </span>

                  {faltam > 0 && e.estado === "recebida" && (
                    <span className="px-3 py-1 bg-yellow/20 font-body text-xs font-bold uppercase tracking-wider text-on-surface shrink-0">
                      {faltam} por pedir
                    </span>
                  )}

                  <span className="font-headline font-black text-lg text-on-surface shrink-0">
                    {formatEuros(e.total)}
                  </span>

                  <span
                    className={clsx(
                      "font-body text-xs font-bold uppercase tracking-wider shrink-0",
                      e.pago ? "text-on-surface-muted" : "text-yellow"
                    )}
                  >
                    {e.pago ? "Pago" : "Por pagar"}
                  </span>

                  <ChevronDown
                    size={18}
                    aria-hidden
                    className={clsx(
                      "text-on-surface-muted shrink-0 transition-transform duration-200",
                      expandida && "rotate-180"
                    )}
                  />
                </button>

                <div className={clsx(expandida ? "block" : "hidden", "px-5 pb-6 border-t border-on-surface/10 pt-5 space-y-6")}>
                  {/* Contactos */}
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                    <p className="font-body text-sm text-on-surface-muted">
                      <a href={`mailto:${e.email}`} className="text-on-surface underline decoration-yellow/50 hover:decoration-yellow">
                        {e.email}
                      </a>
                    </p>
                    <p className="font-body text-sm text-on-surface-muted">
                      <a href={`tel:${e.telemovel.replace(/\s/g, "")}`} className="text-on-surface underline decoration-yellow/50 hover:decoration-yellow">
                        {e.telemovel}
                      </a>
                    </p>
                    {e.atleta && (
                      <p className="font-body text-sm text-on-surface-muted sm:col-span-2">
                        Para o atleta: <span className="text-on-surface">{e.atleta}</span>
                      </p>
                    )}
                    {e.notas && (
                      <p className="font-body text-sm text-on-surface-muted sm:col-span-2">
                        Nota de quem encomendou: <span className="text-on-surface">{e.notas}</span>
                      </p>
                    )}
                  </div>

                  {/* Peças */}
                  <ul className="space-y-2">
                    {(e.linhas ?? []).map((l, i) => (
                      <li key={`${l.slug}-${l.tamanho}-${i}`} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-on-surface/10 pb-2">
                        <span className="font-body text-sm text-on-surface">
                          <strong className="font-headline font-black">{l.quantidade}×</strong>{" "}
                          {l.nome} — tamanho {l.tamanho}
                          {l.personalizacao?.nome || l.personalizacao?.numero ? (
                            <span className="text-on-surface-muted">
                              {" "}· {l.personalizacao.nome} {l.personalizacao.numero}
                            </span>
                          ) : null}
                        </span>
                        <span className="font-body text-sm shrink-0">
                          <span className={l.emStock ? "text-on-surface-muted" : "text-yellow font-semibold"}>
                            {l.emStock ? "na sede" : "pedir ao fornecedor"}
                          </span>
                          <span className="text-on-surface ml-3">{formatEuros(l.preco * l.quantidade)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Valores */}
                  <div className="font-body text-sm space-y-1">
                    <p className="text-on-surface-muted">
                      Escolheu {e.momento === "sinal" ? "pagar sinal" : "pagar tudo"} —{" "}
                      <span className="text-on-surface">{formatEuros(e.aPagarAgora)}</span>
                    </p>
                    {e.momento === "sinal" && (
                      <p className="text-on-surface-muted">
                        A cobrar no levantamento:{" "}
                        <span className="text-on-surface">{formatEuros(e.total - e.aPagarAgora)}</span>
                      </p>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="space-y-4 pt-1">
                    <fieldset>
                      <legend className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-2">
                        Estado
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {ESTADOS.map((estado) => (
                          <button
                            key={estado.id}
                            type="button"
                            onClick={() => alterar(e.id, { estado: estado.id })}
                            aria-pressed={e.estado === estado.id}
                            title={estado.descricao}
                            className={clsx(
                              "px-4 py-2.5 font-body text-sm transition-colors duration-200",
                              e.estado === estado.id
                                ? "bg-yellow text-blue-deep font-semibold"
                                : "border border-on-surface/20 text-on-surface hover:border-on-surface/50"
                            )}
                          >
                            {estado.nome}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <button
                      type="button"
                      onClick={() => alterar(e.id, { pago: !e.pago })}
                      className={clsx(
                        "inline-flex items-center gap-2 px-4 py-2.5 font-body text-sm transition-colors duration-200",
                        e.pago
                          ? "bg-on-surface/10 text-on-surface"
                          : "border border-on-surface/20 text-on-surface hover:border-on-surface/50"
                      )}
                    >
                      {e.pago ? <Check size={16} className="text-yellow" /> : null}
                      {e.pago ? "Pagamento confirmado" : "Marcar como pago"}
                    </button>

                    <label className="block">
                      <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
                        Nota interna
                      </span>
                      <textarea
                        defaultValue={e.notasInternas ?? ""}
                        rows={2}
                        onBlur={(ev) => {
                          const valor = ev.target.value;
                          if (valor !== (e.notasInternas ?? "")) {
                            alterar(e.id, { notasInternas: valor });
                          }
                        }}
                        className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full resize-y"
                      />
                      <span className="font-body text-xs text-on-surface-muted mt-1 block">
                        Guarda quando saíres do campo. Quem encomendou não vê isto.
                      </span>
                    </label>

                    {aGuardar === e.id && (
                      <p className="flex items-center gap-2 font-body text-xs text-on-surface-muted" role="status">
                        <Loader2 size={12} className="animate-spin" /> A guardar…
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
