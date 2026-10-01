"use client";

/**
 * GESTOR DA EQUIPA TÉCNICA
 * ─────────────────────────────────────────────────────────────────
 * Igual ao dos jogadores: nome, cargo e fotografia no formulário,
 * a lista por baixo, lápis para editar. Quem sai a meio da época
 * desliga-se em vez de se apagar.
 * ─────────────────────────────────────────────────────────────────
 */

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import {
  AlertCircle, Check, ImageUp, Loader2, Pencil, Plus, RefreshCw, Trash2, User, X,
} from "lucide-react";

interface MembroAPI {
  _id:    string;
  nome:   string;
  cargo:  string;
  ordem?: number;
  ativo?: boolean;
  fotoAssetId?: string;
  fotoUrl?:     string;
}

const VAZIO = {
  _id: "", nome: "", cargo: "", ordem: "10", ativo: true,
  // "" = sem fotografia; é o estado final que o formulário vai gravar.
  fotoAssetId: "", fotoUrl: "",
};

export default function GestorEquipaTecnica() {
  const [membros, setMembros]     = useState<MembroAPI[]>([]);
  const [form, setForm]           = useState({ ...VAZIO });
  const [aCarregar, setACarregar] = useState(true);
  const [aGuardar, setAGuardar]   = useState(false);
  const [aEnviarFoto, setAEnviarFoto] = useState(false);
  const [aApagar, setAApagar]     = useState<string | null>(null);
  const [erro, setErro]           = useState("");
  const inputFoto = useRef<HTMLInputElement>(null);

  const carregar = useCallback(async () => {
    setACarregar(true);
    try {
      const res = await fetch("/api/direcao/equipa-tecnica", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.ok) { setErro(json.erro ?? "Não foi possível ler a equipa técnica."); return; }
      setErro("");
      setMembros(json.membros ?? []);
    } catch {
      setErro("Falha de ligação.");
    } finally {
      setACarregar(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  function editar(m: MembroAPI) {
    setForm({
      _id: m._id, nome: m.nome, cargo: m.cargo, ordem: String(m.ordem ?? 10),
      ativo: m.ativo !== false, fotoAssetId: m.fotoAssetId ?? "", fotoUrl: m.fotoUrl ?? "",
    });
    setErro("");
  }

  async function enviarFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const ficheiro = e.target.files?.[0];
    e.target.value = "";
    if (!ficheiro) return;
    setAEnviarFoto(true);
    setErro("");
    try {
      const corpo = new FormData();
      corpo.append("ficheiro", ficheiro);
      const res = await fetch("/api/direcao/plantel/fotografia", { method: "POST", body: corpo });
      const json = await res.json();
      if (!res.ok || !json.ok) { setErro(json.erro ?? "Não foi possível carregar a fotografia."); return; }
      setForm((f) => ({ ...f, fotoAssetId: json.assetId, fotoUrl: json.url }));
    } catch {
      setErro("Falha de ligação.");
    } finally {
      setAEnviarFoto(false);
    }
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setAGuardar(true);
    setErro("");
    try {
      const res = await fetch("/api/direcao/equipa-tecnica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(form._id ? { _id: form._id } : {}),
          nome: form.nome, cargo: form.cargo, ordem: Number(form.ordem),
          ativo: form.ativo, fotoAssetId: form.fotoAssetId,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) { setErro(json.erro ?? "Não foi possível guardar."); return; }
      setForm({ ...VAZIO });
      carregar();
    } catch {
      setErro("Falha de ligação.");
    } finally {
      setAGuardar(false);
    }
  }

  async function apagar(m: MembroAPI) {
    setErro("");
    try {
      const res = await fetch(`/api/direcao/equipa-tecnica?id=${encodeURIComponent(m._id)}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.ok) { setErro(json.erro ?? "Não foi possível apagar."); return; }
      if (form._id === m._id) setForm({ ...VAZIO });
      setAApagar(null);
      carregar();
    } catch {
      setErro("Falha de ligação.");
    }
  }

  return (
    <section aria-labelledby="titulo-equipa-tecnica" className="space-y-6">
      <header>
        <h2 id="titulo-equipa-tecnica" className="font-headline font-black uppercase text-2xl tracking-tight text-on-surface">
          Equipa <span className="text-yellow">técnica</span>
        </h2>
        <p className="font-body text-sm text-on-surface-muted mt-2 leading-relaxed">
          Quem treina e está no banco. Aparece em «Corpo Técnico», no fim da página das equipas.
        </p>
      </header>

      <form onSubmit={guardar} className="bg-surface-high p-6 md:p-7 space-y-5">
        <h3 className="font-headline font-black uppercase text-lg tracking-tight text-on-surface">
          {form._id ? "Editar membro" : "Juntar membro"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_5rem] gap-4">
          <label className="block">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">Nome</span>
            <input
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required maxLength={80}
              className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
            />
          </label>
          <label className="block">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">Cargo</span>
            <input
              value={form.cargo}
              onChange={(e) => setForm({ ...form, cargo: e.target.value })}
              required maxLength={80}
              placeholder="Ex.: Treinador principal"
              className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
            />
          </label>
          <label className="block">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">Ordem</span>
            <input
              value={form.ordem}
              onChange={(e) => setForm({ ...form, ordem: e.target.value.replace(/\D/g, "").slice(0, 3) })}
              inputMode="numeric"
              className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
            />
          </label>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-20 aspect-[3/4] bg-surface-low border border-on-surface/15 shrink-0 overflow-hidden flex items-center justify-center">
            {form.fotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- pré-visualização temporária
              <img src={form.fotoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <User size={22} className="text-on-surface-muted/50" aria-hidden />
            )}
          </div>
          <div className="space-y-2 min-w-0">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block">Fotografia</span>
            <input ref={inputFoto} type="file" accept="image/jpeg,image/png,image/webp" onChange={enviarFoto} className="sr-only" />
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => inputFoto.current?.click()} disabled={aEnviarFoto} className="btn-ghost text-xs disabled:opacity-60">
                {aEnviarFoto ? <Loader2 size={14} className="animate-spin" /> : <ImageUp size={14} />}
                {form.fotoUrl ? "Trocar" : "Escolher"}
              </button>
              {form.fotoUrl && (
                <button type="button" onClick={() => setForm({ ...form, fotoAssetId: "", fotoUrl: "" })} className="btn-ghost text-xs">
                  <X size={14} /> Tirar
                </button>
              )}
            </div>
            <p className="font-body text-xs text-on-surface-muted leading-relaxed">
              JPG, PNG ou WebP, até 15 MB. Sem fotografia, aparecem as iniciais.
            </p>
          </div>
        </div>

        <label className="flex items-center gap-3 font-body text-sm text-on-surface cursor-pointer">
          <input
            type="checkbox" checked={form.ativo}
            onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
            className="w-5 h-5 accent-yellow"
          />
          Na equipa técnica
        </label>

        {erro && <p role="alert" className="font-body text-sm text-red-500 flex items-start gap-2"><AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden />{erro}</p>}

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={aGuardar} className="btn-primary text-sm disabled:opacity-60">
            {aGuardar ? <Loader2 size={16} className="animate-spin" /> : form._id ? <Check size={16} /> : <Plus size={16} />}
            {form._id ? "Guardar alterações" : "Juntar à equipa técnica"}
          </button>
          {form._id && (
            <button type="button" onClick={() => setForm({ ...VAZIO })} className="btn-ghost text-sm">
              <X size={16} /> Cancelar
            </button>
          )}
        </div>
      </form>

      <div>
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <h3 className="font-headline font-black uppercase text-lg tracking-tight text-on-surface">Na lista</h3>
          <button type="button" onClick={carregar} className="btn-ghost text-xs">
            {aCarregar ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Recarregar
          </button>
        </div>

        {membros.length === 0 && !aCarregar ? (
          <p className="font-body text-on-surface-muted leading-relaxed">
            Ainda não há ninguém. Escreve o primeiro em cima.
          </p>
        ) : (
          <ul className="border-t border-on-surface/15">
            {membros.map((m) => (
              <li key={m._id} className={clsx("py-3 border-b border-on-surface/10", m.ativo === false && "opacity-50")}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="w-8 h-10 bg-surface-low border border-on-surface/15 shrink-0 overflow-hidden flex items-center justify-center">
                    {m.fotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- miniatura de gestão interna
                      <img src={m.fotoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={13} className="text-on-surface-muted/40" aria-hidden />
                    )}
                  </span>
                  <span className="min-w-[8rem] flex-1">
                    <span className="font-headline font-black uppercase text-base text-on-surface block">{m.nome}</span>
                    <span className="font-body text-xs uppercase tracking-widest text-on-surface-muted">{m.cargo}</span>
                  </span>
                  {m.ativo === false && (
                    <span className="font-body text-xs font-bold uppercase tracking-widest text-on-surface-muted border border-on-surface/25 px-2 py-0.5 shrink-0">Fora</span>
                  )}
                  <span className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => editar(m)} aria-label={`Editar ${m.nome}`} className="w-10 h-10 flex items-center justify-center text-on-surface-muted hover:text-on-surface">
                      <Pencil size={15} />
                    </button>
                    <button type="button" onClick={() => setAApagar(m._id)} aria-label={`Apagar ${m.nome}`} className="w-10 h-10 flex items-center justify-center text-on-surface-muted hover:text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </span>
                </div>

                {aApagar === m._id && (
                  <div role="alertdialog" className="mt-3 border-2 border-yellow bg-yellow/10 p-4 flex flex-wrap items-center gap-4">
                    <p className="font-body text-sm text-on-surface flex-1 min-w-[12rem]">
                      Apagar <strong>{m.nome}</strong>? Não se desfaz. Se só saiu da equipa, desliga «Na equipa técnica» em vez de apagar.
                    </p>
                    <button type="button" onClick={() => apagar(m)} className="btn-primary text-sm"><Trash2 size={14} /> Sim, apagar</button>
                    <button type="button" onClick={() => setAApagar(null)} className="btn-ghost text-sm"><X size={14} /> Voltar</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
