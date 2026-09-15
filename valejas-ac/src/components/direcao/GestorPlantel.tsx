"use client";

/**
 * GESTOR DE PLANTEL
 * ─────────────────────────────────────────────────────────────────
 * Uma equipa de cada vez, como na página pública. Quem está a
 * atualizar os iniciados não quer ver os seniores pelo meio.
 *
 * A linha de cima é o formulário: número, nome, posição. Escreve-se,
 * carrega-se em juntar, e o jogador aparece na lista por baixo. Editar
 * é carregar no lápis — o mesmo formulário enche-se com o que lá está.
 * ─────────────────────────────────────────────────────────────────
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  AlertCircle, Check, Loader2, Pencil, Plus, RefreshCw, Star, Trash2, X,
} from "lucide-react";
import {
  EQUIPAS, ORDEM_POSICOES, PLURAL_POSICAO, nomeDaEquipa,
  type Posicao,
} from "@/lib/data/plantel";

interface JogadorAPI {
  _id:      string;
  nome:     string;
  numero:   number;
  posicao:  string;
  equipa:   string;
  capitao?: boolean;
  ativo?:   boolean;
}

const VAZIO = {
  _id: "",
  nome: "",
  numero: "",
  posicao: "Ala" as Posicao,
  capitao: false,
  ativo: true,
};

export default function GestorPlantel() {
  const [jogadores, setJogadores] = useState<JogadorAPI[]>([]);
  const [equipa, setEquipa]       = useState(EQUIPAS[0]?.id ?? "a");
  const [form, setForm]           = useState({ ...VAZIO });
  const [aCarregar, setACarregar] = useState(true);
  const [aGuardar, setAGuardar]   = useState(false);
  const [erro, setErro]           = useState("");

  const carregar = useCallback(async () => {
    setACarregar(true);
    setErro("");
    try {
      const res = await fetch("/api/direcao/plantel", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErro(json.erro ?? "Não foi possível ler o plantel.");
        return;
      }
      setJogadores(json.jogadores ?? []);
    } catch {
      setErro("Falha de ligação.");
    } finally {
      setACarregar(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const daEquipa = useMemo(
    () => jogadores
      .filter((j) => j.equipa === equipa)
      .sort((a, b) => a.numero - b.numero),
    [jogadores, equipa]
  );

  const contaDaEquipa = useCallback(
    (id: string) => jogadores.filter((j) => j.equipa === id).length,
    [jogadores]
  );

  function editar(j: JogadorAPI) {
    setForm({
      _id: j._id,
      nome: j.nome,
      numero: String(j.numero),
      posicao: j.posicao as Posicao,
      capitao: Boolean(j.capitao),
      ativo: j.ativo !== false,
    });
    setErro("");
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setAGuardar(true);
    setErro("");
    try {
      const res = await fetch("/api/direcao/plantel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(form._id ? { _id: form._id } : {}),
          nome: form.nome,
          numero: Number(form.numero),
          posicao: form.posicao,
          equipa,
          capitao: form.capitao,
          ativo: form.ativo,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErro(json.erro ?? "Não foi possível guardar.");
        return;
      }
      setForm({ ...VAZIO });
      carregar();
    } catch {
      setErro("Falha de ligação.");
    } finally {
      setAGuardar(false);
    }
  }

  async function apagar(j: JogadorAPI) {
    setErro("");
    try {
      const res = await fetch(`/api/direcao/plantel?id=${encodeURIComponent(j._id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErro(json.erro ?? "Não foi possível apagar.");
        return;
      }
      if (form._id === j._id) setForm({ ...VAZIO });
      carregar();
    } catch {
      setErro("Falha de ligação.");
    }
  }

  if (aCarregar && jogadores.length === 0 && !erro) {
    return (
      <p className="flex items-center gap-3 font-body text-on-surface-muted">
        <Loader2 size={18} className="animate-spin" /> A ler o plantel…
      </p>
    );
  }

  if (erro && jogadores.length === 0) {
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
      {/* Equipas */}
      <div role="group" aria-label="Escolher equipa" className="flex flex-wrap gap-2">
        {EQUIPAS.map((e) => {
          const ativo = equipa === e.id;
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => { setEquipa(e.id); setForm({ ...VAZIO }); }}
              aria-pressed={ativo}
              className={clsx(
                "font-headline font-black text-xs uppercase tracking-widest px-4 py-2.5 transition-colors duration-200",
                "inline-flex items-center gap-2",
                ativo
                  ? "bg-yellow text-blue-deep"
                  : "border border-on-surface/20 text-on-surface-muted hover:border-on-surface/50 hover:text-on-surface"
              )}
            >
              {e.label}
              <span className={clsx("font-body text-xs", ativo ? "opacity-70" : "opacity-60")}>
                {contaDaEquipa(e.id)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Formulário */}
      <form onSubmit={guardar} className="bg-surface-high p-6 md:p-7 space-y-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-headline font-black uppercase text-lg tracking-tight text-on-surface">
            {form._id ? "Editar jogador" : "Juntar jogador"}
          </h2>
          <p className="font-body text-sm text-on-surface-muted">
            {nomeDaEquipa(equipa)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[5rem_minmax(0,1fr)_11rem] gap-4">
          <label className="block">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
              Nº
            </span>
            <input
              value={form.numero}
              onChange={(e) => setForm({ ...form, numero: e.target.value.replace(/\D/g, "").slice(0, 2) })}
              inputMode="numeric"
              required
              className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
            />
          </label>

          <label className="block">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
              Nome
            </span>
            <input
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
              className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
            />
          </label>

          <label className="block">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
              Posição
            </span>
            <select
              value={form.posicao}
              onChange={(e) => setForm({ ...form, posicao: e.target.value as Posicao })}
              className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full appearance-none cursor-pointer"
            >
              {ORDEM_POSICOES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-3 font-body text-sm text-on-surface cursor-pointer">
            <input
              type="checkbox"
              checked={form.capitao}
              onChange={(e) => setForm({ ...form, capitao: e.target.checked })}
              className="w-5 h-5 accent-yellow"
            />
            Capitão
          </label>

          <label className="flex items-center gap-3 font-body text-sm text-on-surface cursor-pointer">
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
              className="w-5 h-5 accent-yellow"
            />
            No plantel
          </label>
        </div>

        {erro && <p role="alert" className="font-body text-sm text-red-500">{erro}</p>}

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={aGuardar} className="btn-primary text-sm disabled:opacity-60">
            {aGuardar ? <Loader2 size={16} className="animate-spin" /> : form._id ? <Check size={16} /> : <Plus size={16} />}
            {form._id ? "Guardar alterações" : "Juntar ao plantel"}
          </button>

          {form._id && (
            <button type="button" onClick={() => setForm({ ...VAZIO })} className="btn-ghost text-sm">
              <X size={16} /> Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista */}
      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
          <h2 className="font-headline font-black uppercase text-lg tracking-tight text-on-surface">
            {nomeDaEquipa(equipa)}
          </h2>
          <button type="button" onClick={carregar} className="btn-ghost text-xs">
            {aCarregar ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Recarregar
          </button>
        </div>

        {daEquipa.length === 0 ? (
          <p className="font-body text-on-surface-muted leading-relaxed">
            Ainda não há ninguém nesta equipa. Escreve o primeiro em cima.
          </p>
        ) : (
          <ul className="border-t border-on-surface/15">
            {ORDEM_POSICOES.filter((p) => daEquipa.some((j) => j.posicao === p)).map((posicao) => (
              <li key={posicao} className="py-4 border-b border-on-surface/10">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-2">
                  {PLURAL_POSICAO[posicao]}
                </p>
                <ul className="space-y-1.5">
                  {daEquipa.filter((j) => j.posicao === posicao).map((j) => (
                    <li
                      key={j._id}
                      className={clsx(
                        "flex flex-wrap items-center gap-x-4 gap-y-1 py-1.5",
                        j.ativo === false && "opacity-50"
                      )}
                    >
                      <span className="font-headline font-black text-lg text-yellow w-8 tabular-nums shrink-0">
                        {j.numero}
                      </span>
                      <span className="font-headline font-black uppercase text-base text-on-surface flex-1 min-w-[8rem]">
                        {j.nome}
                      </span>

                      {j.capitao && (
                        <span className="inline-flex items-center gap-1 font-body text-xs font-bold uppercase tracking-widest text-on-surface bg-yellow/25 px-2 py-0.5 shrink-0">
                          <Star size={11} aria-hidden /> Capitão
                        </span>
                      )}
                      {j.ativo === false && (
                        <span className="font-body text-xs font-bold uppercase tracking-widest text-on-surface-muted border border-on-surface/25 px-2 py-0.5 shrink-0">
                          Fora
                        </span>
                      )}

                      <span className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => editar(j)}
                          aria-label={`Editar ${j.nome}`}
                          className="w-10 h-10 flex items-center justify-center text-on-surface-muted hover:text-on-surface"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => apagar(j)}
                          aria-label={`Apagar ${j.nome}`}
                          className="w-10 h-10 flex items-center justify-center text-on-surface-muted hover:text-red-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
