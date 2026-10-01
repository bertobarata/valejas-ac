"use client";

/**
 * FOTOGRAFIA DA EQUIPA — Área da Direção
 * ─────────────────────────────────────────────────────────────────
 * A imagem grande no topo de /equipas. Escolhe-se, vê-se como fica,
 * guarda-se. Sem fotografia, o topo mostra o emblema do clube.
 * ─────────────────────────────────────────────────────────────────
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ImageUp, Loader2, X } from "lucide-react";

export default function GestorFotoEquipa() {
  // O que está guardado no site, e o que está escolhido e ainda por guardar.
  const [guardada, setGuardada] = useState({ id: "", url: "" });
  const [escolhida, setEscolhida] = useState({ id: "", url: "" });
  const [aCarregar, setACarregar] = useState(true);
  const [aEnviar, setAEnviar]     = useState(false);
  const [aGuardar, setAGuardar]   = useState(false);
  const [erro, setErro]           = useState("");
  const [feito, setFeito]         = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const carregar = useCallback(async () => {
    try {
      const res = await fetch("/api/direcao/equipa-foto", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.ok) { setErro(json.erro ?? "Não foi possível ler a fotografia."); return; }
      const atual = { id: json.fotoAssetId ?? "", url: json.fotoUrl ?? "" };
      setGuardada(atual);
      setEscolhida(atual);
    } catch {
      setErro("Falha de ligação.");
    } finally {
      setACarregar(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function enviar(e: React.ChangeEvent<HTMLInputElement>) {
    const ficheiro = e.target.files?.[0];
    e.target.value = "";
    if (!ficheiro) return;
    setAEnviar(true);
    setErro("");
    setFeito(false);
    try {
      const corpo = new FormData();
      corpo.append("ficheiro", ficheiro);
      const res = await fetch("/api/direcao/plantel/fotografia", { method: "POST", body: corpo });
      const json = await res.json();
      if (!res.ok || !json.ok) { setErro(json.erro ?? "Não foi possível carregar a fotografia."); return; }
      setEscolhida({ id: json.assetId, url: json.url });
    } catch {
      setErro("Falha de ligação.");
    } finally {
      setAEnviar(false);
    }
  }

  async function guardar() {
    setAGuardar(true);
    setErro("");
    try {
      const res = await fetch("/api/direcao/equipa-foto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fotoAssetId: escolhida.id }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) { setErro(json.erro ?? "Não foi possível guardar."); return; }
      setGuardada(escolhida);
      setFeito(true);
    } catch {
      setErro("Falha de ligação.");
    } finally {
      setAGuardar(false);
    }
  }

  const alterada = escolhida.id !== guardada.id;

  return (
    <section aria-labelledby="titulo-foto-equipa" className="bg-surface-high p-6 md:p-7 space-y-5">
      <header>
        <h2 id="titulo-foto-equipa" className="font-headline font-black uppercase text-2xl tracking-tight text-on-surface">
          Fotografia da <span className="text-yellow">equipa</span>
        </h2>
        <p className="font-body text-sm text-on-surface-muted mt-2 leading-relaxed">
          A imagem grande no topo da página das equipas. Funciona melhor na vertical (4:5).
        </p>
      </header>

      {aCarregar ? (
        <p className="flex items-center gap-3 font-body text-on-surface-muted"><Loader2 size={18} className="animate-spin" /> A ler…</p>
      ) : (
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-40 aspect-[4/5] bg-surface-low border border-on-surface/15 shrink-0 overflow-hidden flex items-center justify-center">
            {escolhida.url ? (
              // eslint-disable-next-line @next/next/no-img-element -- pré-visualização
              <img src={escolhida.url} alt="Fotografia da equipa" className="w-full h-full object-cover" />
            ) : (
              <p className="font-body text-xs text-on-surface-muted text-center px-3 leading-relaxed">
                Sem fotografia. O topo mostra o emblema.
              </p>
            )}
          </div>

          <div className="space-y-3 min-w-0">
            <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={enviar} className="sr-only" />
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => input.current?.click()} disabled={aEnviar} className="btn-ghost text-sm disabled:opacity-60">
                {aEnviar ? <Loader2 size={14} className="animate-spin" /> : <ImageUp size={14} />}
                {escolhida.url ? "Trocar" : "Escolher"}
              </button>
              {escolhida.url && (
                <button type="button" onClick={() => { setEscolhida({ id: "", url: "" }); setFeito(false); }} className="btn-ghost text-sm">
                  <X size={14} /> Tirar
                </button>
              )}
              <button type="button" onClick={guardar} disabled={!alterada || aGuardar || aEnviar} className="btn-primary text-sm disabled:opacity-50">
                {aGuardar ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                Guardar
              </button>
            </div>
            <p className="font-body text-xs text-on-surface-muted leading-relaxed">
              JPG, PNG ou WebP, até 15 MB. Só muda no site quando carregares em «Guardar».
            </p>
            {feito && !alterada && <p className="font-body text-sm text-on-surface flex items-center gap-2"><Check size={14} aria-hidden /> Guardada. Aparece no site em instantes.</p>}
            {erro && <p role="alert" className="font-body text-sm text-red-500">{erro}</p>}
          </div>
        </div>
      )}
    </section>
  );
}
